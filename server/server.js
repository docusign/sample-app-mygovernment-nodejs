require('dotenv').config({ path: `${process.env.PWD}/.env` });
const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const errorText = require('./assets/errorText.json').api;
const AppError = require('./utils/appError');

// Route imports
const authRouter = require('./routes/jwtRouter');
const passportRouter = require('./routes/passportRouter');
const loanRouter = require('./routes/loanRouter');
const trafficRouter = require('./routes/trafficRouter');

// Max session age
const maxSessionAge = 1000 * 60 * 60 * 24 * 1; // One day

// Configure server
const app = express()
  .use(helmet())
  .use(bodyParser.json())
  .use(cookieParser())
  .use(
    cookieSession({
      name: 'MyGovernmentApp',
      maxAge: maxSessionAge,
      secret: process.env.SESSION_SECRET,
      httpOnly: true,
      secure: false, // Set to false when testing on localhost, otherwise to "true"
      sameSite: 'lax',
    })
  );

app.get('/', (req, res) => {
  res.send('Server started');
  res.end();
});

// Routing
app.use('/auth', authRouter);
app.use('/passportApplication', passportRouter);
app.use('/loanApplication', loanRouter);
app.use('/trafficTicket', trafficRouter);

// Error handler
app.use((err, req, res, next) => {
  if (err instanceof AppError) {
    // AppError will contain a specific status code and custom message
    const statusCode = err.statusCode || 500;
    const errorMessage = err.message;

    res.status(statusCode).send({
      title: errorText.docusignApiError,
      description: `<b>Status code: ${statusCode}</b><br></br>${errorMessage}`,
    });
  } else if (err && err.response && err.response.body) {
    // DocuSign API specific error, extract error code and message
    const statusCode = 500;
    const errorBody = err && err.response && err.response.body;
    const errorCode = errorBody && errorBody.errorCode;
    const errorMessage = errorBody && errorBody.message;

    res.status(statusCode).send({
      title: errorText.docusignApiError,
      description: `<b>Status code: ${statusCode}</b><br></br>${errorCode}: ${errorMessage}`,
    });
  } else {
    console.log('Unknown error occurred.');
    console.log(err);

    res.status(500).send({
      title: errorText.docusignApiError,
      description: `<b>Status code: ${statusCode}</b><br></br>${errorText.unknownError}`,
    });
  }
});

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
  console.log('In production');
  app.use('/assets', express.static(path.join(__dirname, 'assets', 'public')));
}

const port = process.env.PORT_NUMBER;
app.listen(port, () => {
  console.log(`Server started and listening on port ${port}`);
});
