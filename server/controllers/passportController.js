const path = require('path');
const { checkToken } = require('./jwtController');
const {
  makePassportApplicationEnvelope,
} = require('../docusign/envelopes/makePassportApplication');
const { sendEnvelope } = require('../docusign/envelope');
const { getIdvWorkflowId } = require('../docusign/workflow');
const errorText = require('../assets/errorText.json').api;
const AppError = require('../utils/appError');

// Set constants
const docsPath = path.resolve(__dirname, '../docusign/pdf');
const docFile = 'PassportApplication.pdf';

/**
 * Controller that creates and sends an envelope to the signer.
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
    // Verify that the user has Payment related environment variables set up,
    // and if they don't send error message back.
    if (
      !process.env.PAYMENT_GATEWAY_ACCOUNT_ID ||
      !process.env.PAYMENT_GATEWAY_NAME ||
      !process.env.PAYMENT_GATEWAY_DISPLAY_NAME
    ) {
      throw new AppError(403, errorText.paymentConfigsUndefined);
    }

    // Step 1 start
    // Get the workflowId and add it to envelopeArgs
    const workflowId = await getIdvWorkflowId(args);

    // If IDV is not enabled in the account, send back error message.
    if (workflowId === null) {
      throw new AppError(403, errorText.idvNotEnabled);
    }

    args.envelopeArgs.workflowId = workflowId;
    // Step 1 end

    // Step 2 start
    // Get the envelope definition for the envelope
    const envelopeDef = makePassportApplicationEnvelope(args.envelopeArgs);
    // Step 2 end

    // Step 3 start
    // Send the envelope and get the envelope ID
    const envelopeId = await sendEnvelope(envelopeDef, args);
    // Step 3 end

    // Set results. We don't need the envelopeId for the rest of this example,
    // but you can store it for use later in other use cases.
    results = { envelopeId: envelopeId };
  } catch (error) {
    console.log('Error sending the envelope.');
    next(error);
  }

  if (results) {
    res.status(200).send('Envelope successfully sent!');
  }
};

module.exports = {
  createController,
};
