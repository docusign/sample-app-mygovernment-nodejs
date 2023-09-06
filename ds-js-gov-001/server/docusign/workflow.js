/**
 * Util functions that help with determining user account settings.
 */
const eSignSdk = require('docusign-esign');

/**
 * Returns the workflow ID for IDV.
 */
const getIdvWorkflowId = async (args) => {
  // Make AccountApi client to call
  let eSignApi = new eSignSdk.ApiClient();
  eSignApi.setBasePath(args.basePath);
  eSignApi.addDefaultHeader('Authorization', 'Bearer ' + args.accessToken);
  let accountsApi = new eSignSdk.AccountsApi(eSignApi);

  let workflowId = null;
  let workflowResults = await accountsApi.getAccountIdentityVerification(
    args.accountId
  );

  // Find the workflow ID corresponding to the name "DocuSign ID Verification"
  workflowResults.identityVerification.forEach((workflow) => {
    if (workflow.defaultName === 'DocuSign ID Verification') {
      workflowId = workflow.workflowId;
    }
  });

  return workflowId;
};

/**
 * Returns whether or not the user has send to CertifiedDelivery recipients
 * enabled on their account.
 */
const hasCertifiedDeliveryEnabled = async (args) => {
  const res = await hasSettingEnabled(args, 'sendToCertifiedDeliveryEnabled');
  return res;
};

/**
 * Returns whether or not the user has conditional routing enabled on their
 * account.
 */
const hasConditionalRoutingEnabled = async (args) => {
  const res = await hasSettingEnabled(
    args,
    'allowAdvancedRecipientRoutingConditional'
  );
  return res;
};

/**
 * Returns whether or not the user has Document Visibility
 * enabled on their account.
 */
const hasDocumentVisibilityEnabled = async (args) => {
  const res = await hasSettingEnabled(args, 'allowDocumentVisibility');
  return res;
};

/**
 * Returns whether or not the user has SMS delivery enabled on
 * their account.
 */
const hasSmsEnabled = async (args) => {
  const res = await hasSettingEnabled(args, 'allowSMSDelivery');
  return res;
};

/**
 * Helper function that returns the result of whether or not the given setting
 * is enabled on the user's account.
 */
const hasSettingEnabled = async (args, setting) => {
  // Make AccountApi client to call
  let eSignApi = new eSignSdk.ApiClient();
  eSignApi.setBasePath(args.basePath);
  eSignApi.addDefaultHeader('Authorization', 'Bearer ' + args.accessToken);
  let accountsApi = new eSignSdk.AccountsApi(eSignApi);

  let workflowResults = await accountsApi.listSettings(args.accountId);

  if (workflowResults.hasOwnProperty(setting)) {
    return workflowResults[setting];
  } else {
    throw new Error(`Given setting \"${setting}\" does not exist.`);
  }
};

module.exports = {
  getIdvWorkflowId,
  hasCertifiedDeliveryEnabled,
  hasConditionalRoutingEnabled,
  hasDocumentVisibilityEnabled,
  hasSmsEnabled,
};
