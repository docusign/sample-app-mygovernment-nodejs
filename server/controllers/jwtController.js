const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const eSignSdk = require('docusign-esign');
const fs = require('fs');
const dayjs = require('dayjs');
const oAuth = eSignSdk.ApiClient.OAuth;
const restApi = eSignSdk.ApiClient.RestApi;

const rsaKey = fs.readFileSync(path.resolve(__dirname, '../private.key'));
const jwtLifeSec = 60 * 60;
const scopes = 'signature';
const basePath = restApi.BasePath.DEMO;
const oAuthBasePath = oAuth.BasePath.DEMO;

const getToken = async (req) => {
  try {
    const eSignApi = new eSignSdk.ApiClient();
    eSignApi.setOAuthBasePath(oAuthBasePath);

    const results = await eSignApi.requestJWTUserToken(
      process.env.INTEGRATION_KEY,
      process.env.USER_ID,
      scopes,
      rsaKey,
      jwtLifeSec
    );

    const expiresAt = dayjs().add(results.body.expires_in, 's');
    req.session.accessToken = results.body.access_token;
    req.session.tokenExpirationTimestamp = expiresAt;
  } catch (error) {
    throw error;
  }
};

const checkToken = async (req) => {
  try {
    const noToken = !req.session.accessToken || !req.session.tokenExpirationTimestamp;
    const currentTime = dayjs();
    const bufferTime = 1;

    let needToken = noToken || dayjs(req.session.tokenExpirationTimestamp)
      .subtract(bufferTime, 'm')
      .isBefore(currentTime);

    if (needToken) {
      await getToken(req);
    }
  } catch (error) {
    if (error.response && error.response.body.error === 'consent_required') {
      throw new Error('Consent required');
    } else {
      throw error;
    }
  }
};

const getUserInfo = async (req) => {
  try {
    const eSignApi = new eSignSdk.ApiClient();
    const targetAccountId = process.env.targetAccountId;
    const baseUriSuffix = '/restapi';
    eSignApi.setOAuthBasePath(oAuthBasePath);
    console.log("Seesion Access token", req.session.accessToken)
    const results = await eSignApi.getUserInfo(req.session.accessToken);

    let accountInfo;
    if (!Boolean(targetAccountId)) {
      accountInfo = results.accounts.find(account => account.isDefault === 'true');
    } else {
      accountInfo = results.accounts.find(account => account.accountId == targetAccountId);
    }

    if (typeof accountInfo === 'undefined') {
      throw new Error(`Target account ${targetAccountId} not found!`);
    }
    console.log("accountInfo", accountInfo)
    req.session.accountId = accountInfo.accountId;
    req.session.basePath = accountInfo.baseUri + baseUriSuffix;
  } catch (error) {
    throw error;
  }
};

const login = async (req, res, next) => {
  try {
    req.session.isLoggedIn = true;
    try { await checkToken(req); await getUserInfo(req); } catch (e) { console.log(e) }
    res.status(200).send('Successfully logged in.');
  } catch (error) {
    if (error.message === 'Consent required') {
      const consent_scopes = scopes + '%20impersonation';
      const consent_url = `${process.env.DS_OAUTH_SERVER}/oauth/auth?response_type=code&` +
        `scope=${consent_scopes}&client_id=${process.env.INTEGRATION_KEY}&` +
        `redirect_uri=${process.env.REDIRECT_URI_HOME}`;
      res.status(210).send(consent_url);
    } else {
      req.session.isLoggedIn = false;
      next(error);
    }
  }
};

const logout = (req, res) => {
  try {
    req.session = null;
    res.status(200).send('Success: you have logged out');
  } catch (error) {
    res.status(500).send("Error logging out");
  }
};

const isLoggedIn = (req, res) => {
  try {
    let isLoggedIn = req.session.isLoggedIn || false;
    res.status(200).send(isLoggedIn);
  } catch (error) {
    res.status(500).send("Error checking login status");
  }
};

module.exports = {
  checkToken,
  login,
  logout,
  isLoggedIn,
};
