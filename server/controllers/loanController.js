const path = require('path');
const { checkToken } = require('./jwtController');
const text = require('../assets/public/text.json').smallBusinessLoan;
const {
  makeLoanApplicationEnvelope,
} = require('../docusign/envelopes/makeLoanApplication');
const {
  getRecipientViewUrl,
  sendEnvelope,
  getEnvelopeTabData,
  createBrand,
} = require('../docusign/envelope');
const {
  hasConditionalRoutingEnabled,
  hasDocumentVisibilityEnabled,
} = require('../docusign/workflow');
const errorText = require('../assets/errorText.json').api;
const AppError = require('../utils/appError');

// Set constants
const signerClientId = '1000'; // The id of the signer within this application.
const docsPath = path.resolve(__dirname, '../docusign/pdf');
const docFile = 'SmallBusinessLoanApp.pdf';
const doc2File = 'LoanChecklist.pdf';
const dsReturnUrl =
  process.env.REDIRECT_URI + '/apply-for-small-business-loan/submitted-loan';
const dsPingUrl = process.env.REDIRECT_URI + '/index';
const smallLenderName = text.names.smallLenderName;
const bigLenderName = text.names.bigLenderName;
const loanBenchmark = 50000;
const brandName = text.envelope.brandName;
const defaultBrandLanguage = 'en';

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

  // Colors for branding
  const colors = [
    { name: 'buttonPrimaryBackground', value: '#dad1e9' },
    { name: 'buttonPrimaryText', value: '#333333' },
    { name: 'headerBackground', value: '#674ea7' },
    { name: 'headerText', value: '#ffffff' },
  ];

  const envelopeArgs = {
    signerEmail: body.signerEmail,
    signerName: body.signerName,
    status: 'sent',
    docFile: path.resolve(docsPath, docFile),
    doc2File: path.resolve(docsPath, doc2File),

    // Embedded signing arguments
    signerClientId: signerClientId,
    dsReturnUrl: dsReturnUrl,
    dsPingUrl: dsPingUrl,

    // Loan specific arguments
    smallLenderName: smallLenderName,
    bigLenderName: bigLenderName,
    loanBenchmark: loanBenchmark,

    // Branding arguments
    brandName: brandName,
    defaultBrandLanguage: defaultBrandLanguage,
    colors: colors,
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
    // Verify that the user has conditional routing and document visibility
    // enabled on their account.
    const conditionalRoutingEnabled = await hasConditionalRoutingEnabled(args);
    const documentVisibilityEnabled = await hasDocumentVisibilityEnabled(args);
    if (conditionalRoutingEnabled === 'false') {
      throw new AppError(403, errorText.conditionalRoutingNotEnabled);
    } else if (documentVisibilityEnabled === 'false') {
      throw new AppError(403, errorText.documentVisibilityNotEnabled);
    }

    // Create brand for envelope
    results = await createBrand(args);
    envelopeArgs.brandId = results;

    // Get the envelope definition for the envelope
    const envelopeDef = makeLoanApplicationEnvelope(args.envelopeArgs);

    // Send the envelope and get the envelope ID
    const envelopeId = await sendEnvelope(envelopeDef, args);

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
    req.session.loanAppEnvelopeId = results.envelopeId;
    req.session.loanAppSignerName = body.signerName;

    // Send back redirect URL for embedded signing
    res.status(200).send(results.redirectUrl);
  }
};

/**
 * Gets the loan amount the user inputted in their loan application envelope
 * and return the lender name based on that.
 */
const submitLoanController = async (req, res, next) => {
  // Check the access token, which will also update the token
  // if it is expired
  await checkToken(req);

  // Create args
  const args = {
    accessToken: req.session.accessToken,
    basePath: req.session.basePath,
    accountId: req.session.accountId,

    // Envelope tab related args
    envelopeId: req.session.loanAppEnvelopeId, // the last submitted envelopeId
    signerName: req.session.loanAppSignerName, // last submitted signer name
    tabName: 'loanAmount', // the name of the tab that we want the value of
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
    // Based on the loan amount, return lender name
    if (parseFloat(results) < loanBenchmark) {
      res.status(200).send(smallLenderName);
    } else {
      res.status(200).send(bigLenderName);
    }
  }
};

module.exports = {
  createController,
  submitLoanController,
};
