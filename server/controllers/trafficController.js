const path = require('path');
const { checkToken } = require('./jwtController');
const text = require('../assets/public/text.json').trafficTicket.names;
const {
  makeTrafficTicket,
} = require('../docusign/envelopes/makeTrafficTicket');
const { makeSmsEnvelope } = require('../docusign/envelopes/makeSmsEnvelope');
const {
  getRecipientViewUrl,
  sendEnvelope,
  getEnvelopeTabData,
} = require('../docusign/envelope');
const {
  hasSmsEnabled,
  hasCertifiedDeliveryEnabled,
  hasConditionalRoutingEnabled,
} = require('../docusign/workflow');
const errorText = require('../assets/errorText.json').api;
const AppError = require('../utils/appError');

// Set constants
const signerClientId = '1000'; // The id of the signer within this application.
const docsPath = path.resolve(__dirname, '../docusign/pdf');
const docFile = 'TrafficTicket.pdf';
const docFile2 = 'PoliceWitnessStatement.pdf';
const dsReturnUrl =
  process.env.REDIRECT_URI + '/receive-traffic-ticket/submitted-ticket';
const dsPingUrl = process.env.REDIRECT_URI + '/';
const mitigationClerkName = text.mitigationClerkName;
const contestedClerkName = text.contestedClerkName;

/**
 * Controller that creates an envelope and returns a view URL for an
 * embedded signing session.
 */
const createController = async (req, res, next) => {
  // Check the access token, which will also update the token
  // if it is expired
  await checkToken(req);

  // Construct arguments
  const { body } = req;

  const envelopeArgs = {
    signerEmail: body.signerEmail,
    signerName: body.signerName,
    status: 'sent',
    docFile: path.resolve(docsPath, docFile),

    // Embedded signing arguments
    signerClientId: signerClientId,
    dsReturnUrl: dsReturnUrl,
    dsPingUrl: dsPingUrl,

    // Traffic ticket specific arguments
    mitigationClerkName: mitigationClerkName,
    contestedClerkName: contestedClerkName,

    // Payment arguments
    gatewayAccountId: process.env.PAYMENT_GATEWAY_ACCOUNT_ID,
    gatewayName: process.env.PAYMENT_GATEWAY_NAME,
    gatewayDisplayName: process.env.PAYMENT_GATEWAY_DISPLAY_NAME,
  };
  const args = {
    accessToken: req.session.accessToken,
    basePath: req.session.basePath,
    accountId: req.session.accountId,
    envelopeArgs: envelopeArgs,
  };

  let results = null;

  // Send the envelope to signer
  try {
    // Verify that the user has payment related environment variables set up,
    // send to CertifiedDelivery and conditional routing enabled on their account.
    const certifiedDeliveryEnabled = await hasCertifiedDeliveryEnabled(args);
    const conditionalRoutingEnabled = await hasConditionalRoutingEnabled(args);
    if (
      !process.env.PAYMENT_GATEWAY_ACCOUNT_ID ||
      !process.env.PAYMENT_GATEWAY_NAME ||
      !process.env.PAYMENT_GATEWAY_DISPLAY_NAME
    ) {
      throw new AppError(403, errorText.paymentConfigsUndefined);
    } else if (certifiedDeliveryEnabled === 'false') {
      throw new AppError(403, errorText.certifiedDeliveryNotEnabled);
    } else if (conditionalRoutingEnabled === 'false') {
      throw new AppError(403, errorText.conditionalRoutingNotEnabled);
    }

    // Step 1 start
    // Get the envelope definition for the envelope
    const envelopeDef = makeTrafficTicket(args.envelopeArgs);
    // Step 1 end

    // Step 2 start
    // Send the envelope and get the envelope ID
    const envelopeId = await sendEnvelope(envelopeDef, args);
    // Step 2 end

    // Step 3 start
    // Get recipient view URL for embedded signing
    const viewUrl = await getRecipientViewUrl(envelopeId, args);

    // Set results
    results = { envelopeId: envelopeId, redirectUrl: viewUrl };
  } catch (error) {
    console.log('Error sending the envelope.');
    next(error);
  }

  if (results) {
    // Save envelope ID and signer name for later use
    req.session.ticketEnvelopeId = results.envelopeId;
    req.session.ticketSignerName = body.signerName;
    res.status(200).send(results.redirectUrl);
    // Step 3 end
  }
};

/**
 * Gets and returns what the user chose to do with the ticket
 * (plead not guilty/no contest and paid, request mitigation hearing,
 *  or request contested hearing).
 */
const submitTrafficController = async (req, res, next) => {
  // Check the access token, which will also update the token
  // if it is expired
  await checkToken(req);

  // Create args
  const args = {
    accessToken: req.session.accessToken,
    basePath: req.session.basePath,
    accountId: req.session.accountId,

    // Envelope tab related args
    envelopeId: req.session.ticketEnvelopeId, // the last submitted envelopeId
    signerName: req.session.ticketSignerName, // last submitted signer name
    tabName: 'ticketOption', // the name of the tab that we want the value of
  };
  let results = null;

  // Get the tab data
  try {
    results = await getEnvelopeTabData(args);
  } catch (error) {
    console.log('Error getting tab/form data.');
    next(error);
  }

  if (results) {
    res.status(200).send(results);
  }
};

/**
 * Sends an envelope via SMS delivery to the phone provided in the request.
 */
const smsTrafficController = async (req, res, next) => {
  // Check the access token, which will also update the token
  // if it is expired
  await checkToken(req);

  // Construct arguments
  const { body } = req;

  const envelopeArgs = {
    signerName: body.signerName,
    status: 'sent',
    docFile: path.resolve(docsPath, docFile2),

    // SMS args
    countryCode: body.countryCode,
    phoneNumber: body.phoneNumber,
  };
  const args = {
    accessToken: req.session.accessToken,
    basePath: req.session.basePath,
    accountId: req.session.accountId,
    envelopeArgs: envelopeArgs,
  };

  let results = null;

  try {
    // Verify that the user has the SMS Delivery feature enabled on
    // their account first.
    const smsEnabled = await hasSmsEnabled(args);
    if (smsEnabled === 'false') {
      throw new AppError(403, errorText.smsNotEnabled);
    }

    // Step 1 start
    // Get the envelope definition for the envelope
    const envelopeDef = makeSmsEnvelope(args.envelopeArgs);
    // Step 1 end

    // Step 2 start
    // Send the envelope and get the envelope ID
    const envelopeId = await sendEnvelope(envelopeDef, args);
    // Step 2 end

    // Set results
    results = { envelopeId: envelopeId };
  } catch (error) {
    console.log('Error SMS delivery.');
    next(error);
  }

  if (results) {
    req.session.ticketSmsEnvelopeId = results.envelopeId;
    res.status(200).send('Envelope successfully sent!');
  }
};

module.exports = {
  createController,
  submitTrafficController,
  smsTrafficController,
};
