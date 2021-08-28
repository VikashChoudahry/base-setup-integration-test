/*
  * @TODO: A server base setup yet to be done.
  * The primary objective of this git repo is to provide an skeleton of base setup for "Integration Test"
  * Soon this repo will be updated with e2e execution.
*/

// Actual base setup code goes here.
const app = express();

// init app will be responsible to initialize the pre-requisites for app to function
const initApp = async () => {
  // db connection setup
  // secret env variables fetch from ssm
}

/*
  To ensure that other modules aren't started first,
  so when mocha initialises it finds this port to listen.
*/
if (!module.parent) {
  app.listen(port, () => console.log('App booted'));
}

module.exports = { app, initApp };
