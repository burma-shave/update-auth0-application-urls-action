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
  client_id: core.getInput("application-id"),
};

managementClient
  .getClient(apiParams)
  .then((application) => updateApplication(command, application))
  .then((updates) => managementClient.updateClient(apiParams, updates))
  .catch((err) => core.setFailed(err.message));

const updateApplication = (command, application) => {
  console.log("before:");
  console.log(application);

  const newCallbacks = application.callbacks ? [...application.callbacks] : [];
  const newLogoutUrls = application.allowed_logout_urls
    ? [...application.allowed_logout_urls]
    : [];

  const callbackUrlIndex = newCallbacks.indexOf(callbackUrl);
  const logoutUrlIndex = newLogoutUrls.indexOf(logoutUrl);

  switch (command) {
    case ADD_CMD:
      if (callbackUrlIndex < 0) {
        console.log(`Adding ${callbackUrl} to ${application.name} callbacks`);
        newCallbacks.push(callbackUrl);
      } else {
        console.log(
          `${callbackUrl} already exists in ${application.name} callbacks. No change needed.`
        );
      }
      if (logoutUrlIndex < 0) {
        console.log(`Adding ${logoutUrl} to ${application.name} logout urls`);
        newLogoutUrls.push(logoutUrl);
      } else {
        console.log(
          `${logoutUrl} already exists in ${application.name} logout urls. No change needed.`
        );
      }
      break;
    case REMOVE_CMD:
      if (callbackUrlIndex < 0) {
        console.log(
          `${callbackUrl} does note exist in ${application.name} callbacks. No change needed.`
        );
      } else {
        console.log(`Removing ${callbackUrl} to ${application.name} callbacks`);
        newCallbacks.splice(callbackUrlIndex, 1);
      }
      if (logoutUrlIndex < 0) {
        console.log(
          `${logoutUrl} does not exist in ${application.name} logout urls. No change needed.`
        );
      } else {
        console.log(`Removing ${logoutUrl} to ${application.name} logout urls`);
        newLogoutUrls.splice(logoutUrlIndex, 1);
      }
      break;
    default:
      throw `value of command must be ${ADD_CMD} or ${REMOVE_CMD}`;
  }


  const updates = {
    callbacks: newCallbacks,
    allowed_logout_urls: newLogoutUrls,
  };
  
  console.log("After:");
  console.log({...application, ...updates});

  return updates;
};
