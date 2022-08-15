const core = require("@actions/core");
const github = require("@actions/github");
const ManagementClient = require("auth0").ManagementClient;

const ADD_CMD = "add";
const REMOVE_CMD = "remove";

const command = core.getInput("command");
const managementClientDomain = core.getInput("management-client-domain");
const managementClientId = core.getInput("management-client-clientId");
const managementClientSecret = core.getInput("management-client-secret");

const callbackUrl = core.getInput("callback-url");
const logoutUrl = core.getInput("logout-url");

const managementClient = new ManagementClient({
  domain: managementClientDomain,
  clientId: managementClientId,
  clientSecret: managementClientSecret,
  scope: "read:clients update:clients",
});

const apiParams = {
  client_id: core.getInput("applicaton-id"),
};

managementClient
  .getClient(apiParams)
  .then((application) => {
    updateApplication(command, application);
  })
  .catch((err) => core.setFailed(err.message));

const updateApplication = (command, application) => {
  console.log(application);
  const callbackUrlIndex = application.callbacks.indexOf(callbackUrl);
  const logoutUrlIndex = application.allowed_logout_urls.indexOf(logoutUrl);

  switch (command) {
    case ADD_CMD:
      if (callbackUrlIndex < 0) {
        console.log(`Adding ${callbackUrl} to ${application.name} callbacks`);
        application.callbacks.push(callbackUrl);
      } else {
        console.log(
          `${callbackUrl} already exists in ${application.name} callbacks. No change needed.`
        );
      }
      if (logoutUrlIndex < 0) {
        console.log(`Adding ${logoutUrl} to ${application.name} logout urls`);
        application.allowed_logout_urls.push(logoutUrl);
      } else {
        console.log(
          `${logoutUrl} already exists in ${application.name} logout urls. No change needed.`
        );
      }
      break;
    case REMOVE_CMD:
      if (callbackUrlIndex < 0) {
        console.log(`Removing ${callbackUrl} to ${application.name} callbacks`);
        application.callbacks.splice(callbackUrl, 1);
      } else {
        console.log(
          `${callbackUrl} already exists in ${application.name} callbacks. No change needed.`
        );
      }
      if (logoutUrlIndex < 0) {
        console.log(`Removing ${logoutUrl} to ${application.name} logout urls`);
        application.allowed_logout_urls.splice(logoutUrl, 1);
      } else {
        console.log(
          `${logoutUrl} already exists in ${application.name} logout urls. No change needed.`
        );
      }
      break;
    default:
      throw `value of command must be ${ADD_CMD} or ${REMOVE_CMD}`;
  }
};
