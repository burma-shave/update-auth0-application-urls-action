# Update Auth0 Application URIs action

This action updates the following Auth0 application URIs:
* Callback URLs
* Allowed Logout URLs

In order to use this action you will need to have a Machine-to-Machine
client authorised for the Auth0 Management API configured in your tennant.

The client will need the following permissions:
* `read:clients`
* `update:clients`

## Inputs

## `management-client-domain`

**Required** The domain of the management client.

## `management-client-clientId`

**Required** The client id of the management client.

## `management-client-secret`

**Required** The management client secret.

## `application-id`

**Required** The application we are updating.

## `command`

**Required** How to update the list, can be `add` or `remove`.

## `callback-url`

**Required** Allowed callback URL.

## `logout-url`

**Required** Allowed logout URL.

## Example usage

    uses: burma-shave/update-auth0-application-urls-action@v0.1 
    with:
      management-client-domain: your-tenant-name.auth0.com
      management-client-clientId: RHYQEGP0DQxQ9hjdiaY7EX0Y5nIGJexYT
      management-client-secret: ${{ secrets.AUTH0_MANAGEMENT_CLIENT_SECRET }} 
      application-id: rZVq9pOfki9djt7i9piGpRGgcOf
      command: add
      callback-url: https://foo.com/callback
      logout-url: https://foo.com/logout
