# SSO with Keycloak

This guide will walk you through the steps to configure Keycloak with PostgreSQL as the database and set up Single Sign-On (SSO) with Google and Facebook.

## Prerequisites

- PostgreSQL installed and running
- Keycloak downloaded and extracted from ZIP file
- Google and Facebook developer accounts

## Step 1: Set Up PostgreSQL

```sh
sudo -i -u postgres
psql
CREATE DATABASE keycloaktest;
CREATE USER developer WITH ENCRYPTED PASSWORD 'developer';
GRANT ALL PRIVILEGES ON DATABASE keycloaktest TO developer;
\q
```

## Step 2: Configure Keycloak

1. Start Keycloak with the following command:

    ```bash
    bin/kc.sh start-dev --db postgres --db-url jdbc:postgresql://localhost:5432/keycloaktest --db-username developer --db-password developer
    ```

2. Access Keycloak at http://localhost:8080 and log in with the admin credentials.

3. Create a new realm or use the default master realm.

4. Create a new client for your application.

## Step 3: Set Up Google Identity Provider

1. Go to the Google Developer Console and create a new project from this uri : https://console.cloud.google.com/apis/dashboard.
2. Navigate to the OAuth consent screen and configure it with ridirect uri : http://localhost:8080/realms/{realm-name}/broker/google/endpoint
![alt text](assets/Screenshot_২০২৪০৭২৭_০২৪৪২০.png)
3. Create OAuth 2.0 credentials and note the Client ID and Client Secret.
![alt text](assets/Screenshot_২০২৪০৭২৭_০২৪৭৫১.png)

## Step 4: Set Up Facebook Identity Provider

1. Go to the Facebook Developer Console and create a new project from this uri : https://developers.facebook.com/apps.
2. Navigate to permissions and add email permissions.
![alt text](assets/Screenshot_২০২৪০৭২৮_২০০৭১৫.png)
3. Go to app settings and note the Client ID and Client Secret.
![alt text](assets/Screenshot_২০২৪০৭২৮_২০১৬২৫.png)

## Keycloak Google Identity Provider Configuration

1. In Keycloak, go to the Identity Providers tab and select Google.
2. Enter the Client ID and Client Secret from Google.
3. Set the Redirect URI to http://localhost:8080/realms/{realm-name}/broker/google/endpoint.
4. Client ID: Your Google Client ID
5. Client Secret: Your Google Client Secret
![alt text](assets/Screenshot_২০২৪০৭২৭_০২৫৯০৩.png)

## Keycloak Facebook Identity Provider Configuration

1. In Keycloak, go to the Identity Providers tab and select Facebook.
2. Enter the Client ID and Client Secret from Facebook.
3. Set the Redirect URI to http://localhost:8080/realms/{realm-name}/broker/facebook/endpoint.
4. Client ID: Your Facebook Client ID
5. Client Secret: Your Facebook Client Secret
![alt text](assets/Screenshot_২০২৪০৭২৮_২০২৯৪২.png)

## Access your Keycloak account

http://localhost:8080/realms/{realm-name}/account/

## Simple React SPA with Keycloak Authentication

## Prerequisites

- Node.js (>= 12.x)
- npm (>= 6.x)
- Keycloak server (>= 10.x)

## Keycloak Setup

1. **Create a Client**:
   - In the newly created realm, navigate to the `Clients` section.
   - Click on `Create` and fill in the following details:
     - Client ID: `max-live-web`
     - Client Protocol: `openid-connect`
     - Root URL: `http://localhost:3000`
   - Save the client.

2. **Configure Client Settings**:
   - Set `Access Type` to `public`.
   - Set `Valid Redirect URIs` to `http://localhost:3000/*`.
   ![alt text](assets/Screenshot_২০২৪০৭২৮_০৩৫৩৩৭.png)
   - Set `Web Origins` to `*`.
   - Set `client authentication` to `off`.
   ![alt text](assets/Screenshot_২০২৪০৭২৮_০৩৫৪১৮.png)

## React Setup

1. cd Simple-React-SPA
2. Install Dependencies

    ```sh
    npm install
    ```

3. Configure keycloak.js:

    ```javascript
    import Keycloak from 'keycloak-js';

    const keycloak = new Keycloak({
    url: 'http://localhost:8080/',
    realm: 'max-live-test',
    clientId: 'max-live-web'
    });

    export default keycloak;
    ```

4. Run the Application:

    ```sh
    npm start
    ```

5. Access the Application:
* Open your browser and navigate to http://localhost:3000

## Keycloak Integration in React

In your App.js file, initialize Keycloak and handle authentication:

```javascript
import React, { useState, useEffect } from 'react';
import Keycloak from 'keycloak-js';
import './App.css';

const keycloak = Keycloak('/keycloak.json');

function App() {
  const [keycloakInitialized, setKeycloakInitialized] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    keycloak.init({ onLoad: 'login-required' }).then(authenticated => {
      setAuthenticated(authenticated);
      if (authenticated) {
        keycloak.updateToken(5).then(refreshed => {
          if (refreshed) {
            console.log('Token refreshed');
          } else {
            console.warn('Token not refreshed, valid for ' +
              Math.round(keycloak.tokenParsed.exp + keycloak.timeSkew - new Date().getTime() / 1000) + ' seconds');
          }
        }).catch(() => {
          console.error('Failed to refresh token');
          keycloak.logout();
        });
      } else {
        setAuthenticated(false);
      }
      setKeycloakInitialized(true);
    }).catch(() => {
      console.log('Failed to initialize Keycloak');
      setKeycloakInitialized(true); // Even if it fails, we set this to true to avoid infinite loading
    });
  }, []);

  const handleLogout = () => {
    keycloak.logout();
  };

  if (!keycloakInitialized) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      {authenticated ? (
        <div>
          <h1>Welcome to the App</h1>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <div>Unable to authenticate!</div>
      )}
    </div>
  );
}

export default App;
```

Add a LogoutButton.js

```javascript
import React from 'react';
import keycloak from '../keycloak';

const LogoutButton = () => {
  const handleLogout = () => {
    keycloak.logout();
  };

  return (
    <button onClick={handleLogout}>Logout</button>
  );
};

export default LogoutButton;
```

## Create User with Keycloak Admin REST API

This guide will walk you through the steps to create a user in Keycloak using the Admin REST API.

### Prerequisites

- `admin-cli` client under the targeted realms configured with:
  - Client authentication enabled
  - Direct access grants enabled
  - Service accounts roles enabled
  ![alt text](./assets/Screenshot_২০২৪০৭২৯_০৩০৭৪৭.png)
  - `manage-users` role assigned to the service account roles
  ![alt text](./assets/Screenshot_২০২৪০৭২৯_০৩১৮৫১.png)

### Steps

#### 1. Obtain an Access Token

First, you need to obtain an access token using the `admin-cli` client.

```sh
curl --location 'http://localhost:8080/realms/max-live-test/protocol/openid-connect/token' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'grant_type=client_credentials' \
--data-urlencode 'client_id=admin-cli' \
--data-urlencode 'client_secret=<client_secret>'
```

Replace <client_secret> with the secret copied from the admin-cli client configuration.

#### 2. Create a User

Use the obtained access token to create a new user.

```bash
curl --location 'http://localhost:8080/admin/realms/max-live-test/users' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer <access_token>' \
--data-raw '{
    "username": "newuser",
    "enabled": true,
    "firstName": "First",
    "lastName": "Last",
    "email": "newuser@example.com",
    "credentials": [
        {
            "type": "password",
            "value": "new_password",
            "temporary": false
        }
    ]
}'
```

Replace <access_token> with the token obtained in the previous step.

### Notes

* Ensure that the admin-cli client is properly configured under the max-live-test realm.
* The client_secret should be securely stored and not exposed in public repositories.
* The manage-users role must be assigned to the service account of the admin-cli client to allow user creation.

## Run keycloak with custom port and host

```bash
nohup bin/kc.sh start-dev --db postgres --db-url jdbc:postgresql://localhost:5432/keycloak --db-username developer --db-password developer --http-port=9999 --hostname https://domain.com --http-enabled true  &
```

## PKCE with Keycloak

This guide demonstrates how to use Proof Key for Code Exchange (PKCE) with Keycloak for secure authentication.

### Prerequisites

- Keycloak server running at `http://localhost:8080`
- A Keycloak realm named `max-live-test`
- A Keycloak client named `max-live-web` with PKCE enabled
- A web application running at `http://localhost:3000`

### Steps

### 1. Initiate Authorization Request

Open the following URL in your browser to initiate the authorization request:

```url
http://localhost:8080/realms/max-live-test/protocol/openid-connect/auth?client_id=max-live-web&response_type=code&redirect_uri=http://localhost:3000/&code_challenge=nQDk-cypszC9_2vzo6PLZ8tER1y1_CKx61sw7OU8xcg&code_challenge_method=S256
```


### 2. Handle Redirect

After successful authentication, you will be redirected to:

  ```url
  http://localhost:3000/?session_state=f4860643-2eaa-4aaf-b646-6c6a40729bc6&iss=http%3A%2F%2Flocalhost%3A8080%2Frealms%2Fmax-live-test&code=04be86a6-9151-4694-886f-b8baf80ef157.f4860643-2eaa-4aaf-b646-6c6a40729bc6.1d18ae8d-5fa9-4f40-8c6e-8d1163bab88f
  ```


### 2. Handle Redirect

After successful authentication, you will be redirected to:

  ```url
  http://localhost:3000/?session_state=f4860643-2eaa-4aaf-b646-6c6a40729bc6&iss=http%3A%2F%2Flocalhost%3A8080%2Frealms%2Fmax-live-test&code=04be86a6-9151-4694-886f-b8baf80ef157.f4860643-2eaa-4aaf-b646-6c6a40729bc6.1d18ae8d-5fa9-4f40-8c6e-8d1163bab88f
  ```

### 3. Exchange Authorization Code for Tokens

Use the following `curl` command to exchange the authorization code for tokens:

  ```sh
  curl --location 'http://localhost:8080/realms/max-live-test/protocol/openid-connect/token' \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --data-urlencode 'grant_type=authorization_code' \
  --data-urlencode 'client_id=max-live-web' \
  --data-urlencode 'code=04be86a6-9151-4694-886f-b8baf80ef157.f4860643-2eaa-4aaf-b646-6c6a40729bc6.1d18ae8d-5fa9-4f40-8c6e-8d1163bab88f' \
  --data-urlencode 'redirect_uri=http://localhost:3000/' \
  --data-urlencode 'code_verifier=A379jc08Iowoj29RoEzmqwJYt2AJueokhMdCBAELhPzTLGof68-YAgfzjR0hh3NjdsKcMatPn6XaZrhCWkIh2w'
  ```

4. Receive Access Token

  ```json
    {
    "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJpMHhMcHpJcUw3T1FRb2xmZVVkZDRaZC0zY0dwelFWa28zd2dLdHBqWlhNIn0.eyJleHAiOjE3MjIzNzAyOTYsImlhdCI6MTcyMjM2OTk5NiwiYXV0aF90aW1lIjoxNzIyMzY5OTYwLCJqdGkiOiJiNmExMzE2OC0zZjRiLTQzNWYtODk1Zi04MWQ3Njk5YzQzMmUiLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwODAvcmVhbG1zL21heC1saXZlLXRlc3QiLCJhdWQiOiJhY2NvdW50Iiwic3ViIjoiZDA3MDIxZTktMWFkNC00NmVlLWE0ZmMtMGM1YzAwODQ0Yzk0IiwidHlwIjoiQmVhcmVyIiwiYXpwIjoibWF4LWxpdmUtd2ViIiwic2lkIjoiZjQ4NjA2NDMtMmVhYS00YWFmLWI2NDYtNmM2YTQwNzI5YmM2IiwiYWNyIjoiMSIsImFsbG93ZWQtb3JpZ2lucyI6WyJodHRwOi8vbG9jYWxob3N0OjMwMDAiXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbIm9mZmxpbmVfYWNjZXNzIiwidW1hX2F1dGhvcml6YXRpb24iLCJkZWZhdWx0LXJvbGVzLW1heC1saXZlLXRlc3QiXX0sInJlc291cmNlX2FjY2VzcyI6eyJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6ImVtYWlsIHByb2ZpbGUiLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsIm5hbWUiOiJGaXJzdCBMYXN0IiwicHJlZmVycmVkX3VzZXJuYW1lIjoibmV3dXNlciIsImdpdmVuX25hbWUiOiJGaXJzdCIsImZhbWlseV9uYW1lIjoiTGFzdCIsImVtYWlsIjoibmV3dXNlckBleGFtcGxlLmNvbSJ9.RuQQMUDPh34zbdIao_65DsghGhiCcS9xMDmO9edSQvQVnqVvnQBb_n02CwWoG7W7nquNxavyWV_1CVAW1FjF7EY0EfJFo7f8BJSYjHeRHYFF6M9iqj4mvTZWL2XlFWUyOqLMjjra7CD3cb-k1DPGvxzWm5a-2o5ZF5PDlRgYVb-nlb9JBbwv1gtnYFWRAcZbieb2N6tsVpk-UL6gZTbpeLpzk9A3oOfuPAXpReyA3uBFSs7mGvvRyqywG3bP-s2LHh5YDsVUuUha2fz7RL-RbXzuo5_PuLJQhZkPmeo5IR6HpgKiKeY2OJTKxCJJYavYIdPTtI4JhLwvxsU7zjQwfg",
    "expires_in": 300,
    "refresh_expires_in": 1800,
    "refresh_token": "eyJhbGciOiJIUzUxMiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICIwY2NmMzhjMi04OWNhLTQ2MmUtYTBlMy0wMDI4M2Q5NTNiMmQifQ.eyJleHAiOjE3MjIzNzE3OTYsImlhdCI6MTcyMjM2OTk5NiwianRpIjoiZDI1OTJmMjEtYjQ5Zi00YWI0LWI1MDAtM2MxYjNjMzJhODY0IiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo4MDgwL3JlYWxtcy9tYXgtbGl2ZS10ZXN0IiwiYXVkIjoiaHR0cDovL2xvY2FsaG9zdDo4MDgwL3JlYWxtcy9tYXgtbGl2ZS10ZXN0Iiwic3ViIjoiZDA3MDIxZTktMWFkNC00NmVlLWE0ZmMtMGM1YzAwODQ0Yzk0IiwidHlwIjoiUmVmcmVzaCIsImF6cCI6Im1heC1saXZlLXdlYiIsInNpZCI6ImY0ODYwNjQzLTJlYWEtNGFhZi1iNjQ2LTZjNmE0MDcyOWJjNiIsInNjb3BlIjoicm9sZXMgZW1haWwgYmFzaWMgcHJvZmlsZSBhY3Igd2ViLW9yaWdpbnMifQ.hBjTE0fCvdLLWNc8dRMDsiAPp7JZyqegnyyO5AdO6ByZcDC0RLB9lcntEaLKNpiSCfdmnvOTanOooJ7zhRPFxw",
    "token_type": "Bearer",
    "not-before-policy": 0,
    "session_state": "f4860643-2eaa-4aaf-b646-6c6a40729bc6",
    "scope": "email profile"
  }
  ```
You can now use the access_token to authenticate API requests.

## Keycloak Login via cURL

This guide explains how to log in to Keycloak using cURL commands. The process involves multiple steps including obtaining an authorization code, authenticating the user, and finally retrieving the access token.

## Steps

### 1. Get the AUthentication web page

First, initiate the authorization request to get the authorization code.

```bash
curl --location 'https://sso-dev.themaxlive.com/realms/max-live/protocol/openid-connect/auth?client_id=max-live-web&response_type=code&scope=openid&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fabcd&code_challenge_method=S256&code_challenge=m6kDn1BQX2MoNYdojvsOq0UWi4eK3qJ70FkYKRxNxiU'
```

### 2. Authenticate User

Extract the form action URL from the response HTML and use it to authenticate the user.

The url will be found in a div `<div id="kc-form-wrapper">` and then a form `<form id="kc-form-login"` and then in the `action` tag.

![alt text](assets/image.png)

Please note that You must add in the request header `Cookie` and in this `Cookie` there must be `AUTH_SESSION_ID`, `KEYCLOAK_IDENTITY`, `KEYCLOAK_IDENTITY_LEGACY`, and `KEYCLOAK_SESSION` which are added in one string via `;`. The values will be found from the first API response header under the keys `Set-Cookie`.
It is true for every API in this process.

![alt text](assets/image-1.png)

```bash
curl --location 'https://sso-dev.themaxlive.com/realms/max-live/login-actions/authenticate?session_code=zZiny5ag_f3TipdjS6QpkUARTyg8evq0HZ-pBGDJdFk&amp%3Bexecution=bd5b8ec8-9f92-487d-85fa-e0bef933fe8c&amp%3Bclient_id=max-live-web&amp%3Btab_id=LzgLK3DL_M0&amp%3Bclient_data=eyJydSI6Imh0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9hYmNkIiwicnQiOiJjb2RlIn0' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--header 'Cookie: AUTH_SESSION_ID=12fea1b2-5b34-44fb-b0dc-ad55b104695d; AUTH_SESSION_ID_LEGACY=12fea1b2-5b34-44fb-b0dc-ad55b104695d; KC_RESTART=eyJhbGciOiJkaXIiLCJlbmMiOiJBMTI4Q0JDLUhTMjU2In0..klx5Ff2ZdrLUAl6YBtogtA.Dk7mVeFNkPJlDQv0uGKm0ivQ3UFyHXvPsePc0ObXGQi1W28uDakydiS_kjXPK7wOFQoGwZGF8SlQ3i6FF15TPauK0NB5HRinnkl9cRNW5JI_aOiwbCf-K5s7s83JDnOfNg32o6xR-ZkhvzXb0huJgTOmmugbPkrNPqkrmqcNfnfON5P_JAf3R1HVXlv1Nv__K1wVbDj9Yozh9T-haZtN6FeROF2d2F7-GLN08bce9E1gWsn8Dgg0oOjowLKLYJp0htYwDer4fTz5riusDmySMJF8M5sowbFff3XPGo_5OzAZl5qxLMkwSWS54BX_Z8DJoAVz5amVD-a8x3AnL2HHcANfhR-mVA_JquMsiysWfj2bNwbBUm8I9coRdsMbmtcUL-T6obPgEvh_du_pJZxecV8TMCu2gAHxmObLuru0Keh9FEP3-Qu9d-T4KoHo3EGjo93oDcOIY7vBHeADJFrW84o312OA6FIHJ3-qvpVRRi1PJo6-5JxfncrbqtY5IvDUgdBqFWa1wW9OOVRS-pkCQoLlUtJMkGZR51T5fVYVenBcijHGgXfeXZZi2NH3VazXb_hnIY50O4H_MaBuQWmwETwu1wl4LXBga59ODZWh9-4xFs5v13APjazFNMTmu825vjXlQ-u8j03cfYeudrTDRWHZHXCHAf6x15MW6zO3GT7i6E1xu_buORmqO9-zi2v8VhWmz1Hd9tt-ALmyuLuwuyidjFFQ6egWULkOOuPzWbUH6vgJuHFb7uAfsDF3NCkOp2-_I2UIBlPoyB2E2GpGQyMVVMKUL4s74M-spTkGnBLE2RSOMEi7OOZ-foAg8xeNH0rbSjIHlDd1Y_6GmIHgbp7ibUopAABthnU2KAbcNXY.vQdZYWUpnr-G8Of8-7p8Qw' \
--data-urlencode 'username=tanviruser' \
--data-urlencode 'password=asdf1234'
```

### 3. Retrieve Authorization Code from Redirect

In the response, you will get a 302 Found status with a `Location` header containing the authorization code.

![alt text](assets/image-2.png)

Please note that the auto riderection must be off. You can do it from request setting in postman or in curl add `-L`

![alt text](assets/riderctoff.png)

### 4. Exchange Authorization Code for Tokens
Use the authorization code to request tokens.

```bash
curl --location 'https://sso-dev.themaxlive.com/realms/max-live/protocol/openid-connect/token' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--header 'Cookie: AUTH_SESSION_ID=12fea1b2-5b34-44fb-b0dc-ad55b104695d; AUTH_SESSION_ID_LEGACY=12fea1b2-5b34-44fb-b0dc-ad55b104695d; KEYCLOAK_IDENTITY=eyJhbGciOiJIUzUxMiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICI5MWY5ZjlkMi1iZjA0LTQ3ZjUtOGY4Mi01NWY0ZGEwMmE4MzEifQ.eyJleHAiOjE3MjQwMzM0MTAsImlhdCI6MTcyMzk5NzQxMCwianRpIjoiOTBhZmY4ZTUtNTYxOS00ODU0LWJiNDMtZTk2NmViMGQzYzc4IiwiaXNzIjoiaHR0cHM6Ly9zc28tZGV2LnRoZW1heGxpdmUuY29tL3JlYWxtcy9tYXgtbGl2ZSIsInN1YiI6IjQyOGRkMjA5LTI5ZGUtNDM0Ny1hMWRlLTcwNjQ5OTE2N2Q4MiIsInR5cCI6IlNlcmlhbGl6ZWQtSUQiLCJzaWQiOiIxMmZlYTFiMi01YjM0LTQ0ZmItYjBkYy1hZDU1YjEwNDY5NWQiLCJzdGF0ZV9jaGVja2VyIjoicUg1RlNHTTQtWWQ3LUx6N2RsWGtwNVdObldPQmdvM1gzYlVLczNMVV9WRSJ9.TgA4vN1nupmUTM2ON-iop49TLqZLJjKYY2v4G9xkbgb7rcYi082zYytkqylrJSsJkt2LXZ9C92fW7ynzgESLaw; KEYCLOAK_IDENTITY_LEGACY=eyJhbGciOiJIUzUxMiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICI5MWY5ZjlkMi1iZjA0LTQ3ZjUtOGY4Mi01NWY0ZGEwMmE4MzEifQ.eyJleHAiOjE3MjQwMzM0MTAsImlhdCI6MTcyMzk5NzQxMCwianRpIjoiOTBhZmY4ZTUtNTYxOS00ODU0LWJiNDMtZTk2NmViMGQzYzc4IiwiaXNzIjoiaHR0cHM6Ly9zc28tZGV2LnRoZW1heGxpdmUuY29tL3JlYWxtcy9tYXgtbGl2ZSIsInN1YiI6IjQyOGRkMjA5LTI5ZGUtNDM0Ny1hMWRlLTcwNjQ5OTE2N2Q4MiIsInR5cCI6IlNlcmlhbGl6ZWQtSUQiLCJzaWQiOiIxMmZlYTFiMi01YjM0LTQ0ZmItYjBkYy1hZDU1YjEwNDY5NWQiLCJzdGF0ZV9jaGVja2VyIjoicUg1RlNHTTQtWWQ3LUx6N2RsWGtwNVdObldPQmdvM1gzYlVLczNMVV9WRSJ9.TgA4vN1nupmUTM2ON-iop49TLqZLJjKYY2v4G9xkbgb7rcYi082zYytkqylrJSsJkt2LXZ9C92fW7ynzgESLaw; KEYCLOAK_SESSION="max-live/428dd209-29de-4347-a1de-706499167d82/12fea1b2-5b34-44fb-b0dc-ad55b104695d"; KEYCLOAK_SESSION_LEGACY="max-live/428dd209-29de-4347-a1de-706499167d82/12fea1b2-5b34-44fb-b0dc-ad55b104695d"' \
--data-urlencode 'grant_type=authorization_code' \
--data-urlencode 'client_id=max-live-web' \
--data-urlencode 'redirect_uri=http://localhost:3000/abcd' \
--data-urlencode 'code=ab00fb51-9df5-4bcc-91ce-8462e2089012.12fea1b2-5b34-44fb-b0dc-ad55b104695d.f20509ef-c117-4f59-a906-760ec40d83cd' \
--data-urlencode 'code_verifier=OG3Ty56oiX9102cmlXiV8Zz8HgoNj2YAbK7ylMepkflTdFag05E5NbI3nh2fQAkp8Cj6z0TiTrJY3IUaNdkriJTpL2T6_JI02SjWQL-EXa_oXHWQpivl03SqB0QhwSGz'
```

Explanation of the cURL Command

* **-X POST:** Specifies the request method as POST.

* **-H "Content-Type: application/x-www-form-urlencoded":** Sets the content 
type of the request to application/x-www-form-urlencoded.

* **-d "grant_type=authorization_code":** Specifies the grant type as authorization_code.

* **-d "client_id=your_client_id":** Specifies the client ID.

* **-d "client_secret=your_client_secret":** Specifies the client secret (if applicable).

* **-d "code=your_authorization_code":** Specifies the authorization code received from the authorization server.
* -d "redirect_uri=http://localhost:3000": Specifies the redirect URI that was used in the authorization request.

### 5. Refresh Access Token

Use the refresh token to obtain a new access token.

```bash
curl --location 'https://sso-dev.themaxlive.com/realms/max-live/protocol/openid-connect/token' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--header 'Cookie: AUTH_SESSION_ID=12fea1b2-5b34-44fb-b0dc-ad55b104695d; AUTH_SESSION_ID_LEGACY=12fea1b2-5b34-44fb-b0dc-ad55b104695d; KEYCLOAK_IDENTITY=eyJhbGciOiJIUzUxMiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICI5MWY5ZjlkMi1iZjA0LTQ3ZjUtOGY4Mi01NWY0ZGEwMmE4MzEifQ.eyJleHAiOjE3MjQwMzM0MTAsImlhdCI6MTcyMzk5NzQxMCwianRpIjoiOTBhZmY4ZTUtNTYxOS00ODU0LWJiNDMtZTk2NmViMGQzYzc4IiwiaXNzIjoiaHR0cHM6Ly9zc28tZGV2LnRoZW1heGxpdmUuY29tL3JlYWxtcy9tYXgtbGl2ZSIsInN1YiI6IjQyOGRkMjA5LTI5ZGUtNDM0Ny1hMWRlLTcwNjQ5OTE2N2Q4MiIsInR5cCI6IlNlcmlhbGl6ZWQtSUQiLCJzaWQiOiIxMmZlYTFiMi01YjM0LTQ0ZmItYjBkYy1hZDU1YjEwNDY5NWQiLCJzdGF0ZV9jaGVja2VyIjoicUg1RlNHTTQtWWQ3LUx6N2RsWGtwNVdObldPQmdvM1gzYlVLczNMVV9WRSJ9.TgA4vN1nupmUTM2ON-iop49TLqZLJjKYY2v4G9xkbgb7rcYi082zYytkqylrJSsJkt2LXZ9C92fW7ynzgESLaw; KEYCLOAK_IDENTITY_LEGACY=eyJhbGciOiJIUzUxMiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICI5MWY5ZjlkMi1iZjA0LTQ3ZjUtOGY4Mi01NWY0ZGEwMmE4MzEifQ.eyJleHAiOjE3MjQwMzM0MTAsImlhdCI6MTcyMzk5NzQxMCwianRpIjoiOTBhZmY4ZTUtNTYxOS00ODU0LWJiNDMtZTk2NmViMGQzYzc4IiwiaXNzIjoiaHR0cHM6Ly9zc28tZGV2LnRoZW1heGxpdmUuY29tL3JlYWxtcy9tYXgtbGl2ZSIsInN1YiI6IjQyOGRkMjA5LTI5ZGUtNDM0Ny1hMWRlLTcwNjQ5OTE2N2Q4MiIsInR5cCI6IlNlcmlhbGl6ZWQtSUQiLCJzaWQiOiIxMmZlYTFiMi01YjM0LTQ0ZmItYjBkYy1hZDU1YjEwNDY5NWQiLCJzdGF0ZV9jaGVja2VyIjoicUg1RlNHTTQtWWQ3LUx6N2RsWGtwNVdObldPQmdvM1gzYlVLczNMVV9WRSJ9.TgA4vN1nupmUTM2ON-iop49TLqZLJjKYY2v4G9xkbgb7rcYi082zYytkqylrJSsJkt2LXZ9C92fW7ynzgESLaw; KEYCLOAK_SESSION="max-live/428dd209-29de-4347-a1de-706499167d82/12fea1b2-5b34-44fb-b0dc-ad55b104695d"; KEYCLOAK_SESSION_LEGACY="max-live/428dd209-29de-4347-a1de-706499167d82/12fea1b2-5b34-44fb-b0dc-ad55b104695d"' \
--data-urlencode 'grant_type=refresh_token' \
--data-urlencode 'refresh_token=eyJhbGciOiJIUzUxMiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICI5MWY5ZjlkMi1iZjA0LTQ3ZjUtOGY4Mi01NWY0ZGEwMmE4MzEifQ.eyJleHAiOjE3MjM5OTkyNzMsImlhdCI6MTcyMzk5NzQ3MywianRpIjoiMWVlMTlhYzQtMzVlMS00M2Y0LWIyOGUtNGE0YmVkNDI5MTM4IiwiaXNzIjoiaHR0cHM6Ly9zc28tZGV2LnRoZW1heGxpdmUuY29tL3JlYWxtcy9tYXgtbGl2ZSIsImF1ZCI6Imh0dHBzOi8vc3NvLWRldi50aGVtYXhsaXZlLmNvbS9yZWFsbXMvbWF4LWxpdmUiLCJzdWIiOiI0MjhkZDIwOS0yOWRlLTQzNDctYTFkZS03MDY0OTkxNjdkODIiLCJ0eXAiOiJSZWZyZXNoIiwiYXpwIjoibWF4LWxpdmUtd2ViIiwic2lkIjoiMTJmZWExYjItNWIzNC00NGZiLWIwZGMtYWQ1NWIxMDQ2OTVkIiwic2NvcGUiOiJvcGVuaWQgd2ViLW9yaWdpbnMgZW1haWwgYWNyIHByb2ZpbGUgcm9sZXMgYmFzaWMifQ.787JvDk9yJ6gwkKuyWh6xm_sL6GQ3SbqPYcGgDEBSAn-T90nd6hcpeW2MPJtG4OMRwNo6vQj4bWjCNRQzq0dEw' \
--data-urlencode 'client_id=max-live-web'
```

### 6. Get User Info

Use the access token to obtain user information from Keycloak.

```bash
curl --location 'https://sso-dev.themaxlive.com/realms/max-live/protocol/openid-connect/userinfo' \
--header 'Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICIyS01VWWdBd0p3ZUp6TFpoZ0U3bnRqaHFIUXdHb2NYSVNGUHNCSTBqUzZFIn0.eyJleHAiOjE3MjM5OTg2NzMsImlhdCI6MTcyMzk5NzQ3MywiYXV0aF90aW1lIjoxNzIzOTk3NDEwLCJqdGkiOiJiN2ZmZjZhZS0zYmVlLTRiZjMtYjllMS1kZjE3MDRiYjE0YzgiLCJpc3MiOiJodHRwczovL3Nzby1kZXYudGhlbWF4bGl2ZS5jb20vcmVhbG1zL21heC1saXZlIiwiYXVkIjoiYWNjb3VudCIsInN1YiI6IjQyOGRkMjA5LTI5ZGUtNDM0Ny1hMWRlLTcwNjQ5OTE2N2Q4MiIsInR5cCI6IkJlYXJlciIsImF6cCI6Im1heC1saXZlLXdlYiIsInNpZCI6IjEyZmVhMWIyLTViMzQtNDRmYi1iMGRjLWFkNTViMTA0Njk1ZCIsImFjciI6IjEiLCJhbGxvd2VkLW9yaWdpbnMiOlsiKiJdLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsiZGVmYXVsdC1yb2xlcy1tYXgtbGl2ZSIsIm9mZmxpbmVfYWNjZXNzIiwidW1hX2F1dGhvcml6YXRpb24iXX0sInJlc291cmNlX2FjY2VzcyI6eyJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6Im9wZW5pZCBlbWFpbCBwcm9maWxlIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJuYW1lIjoidGFudmlyIGNzZSIsInByZWZlcnJlZF91c2VybmFtZSI6InRhbnZpcnVzZXIiLCJnaXZlbl9uYW1lIjoidGFudmlyIiwiZmFtaWx5X25hbWUiOiJjc2UiLCJlbWFpbCI6InRhbnZpQGdtYWlsLmNvbSJ9.GJqtnFFbjCh4y59VjMwcZWDu8yZTEm9Mc2AZyk4BzjxFgtKa61Mq85e30oImCRpZgkHsl3KPhlTBuTd1jRf34AYMdoZ_LNmWbSeojJ7Zt3gSdDMmBNBdDU3Ze3BdB2rVm6IpMkw1E_8IZq7b2zX_7I3c8V2HrEWpXItj1ERmdts6a6Qmrz8X7M17jQFQXI18cv5hGuvGpkGwEYz27gqUutyAg-GB87nEgsEjO4SfhDFKoaqI0T6Hf-He2NHdhw2o96zjlYvvHrVcVEdH49LqPhqPTFxQ0QpmJbmpOB1X2PoXDE6Vk90Q_-6466FAH8K20xhCavxxzx1tfvXzcpktbg' \
--header 'Cookie: AUTH_SESSION_ID=12fea1b2-5b34-44fb-b0dc-ad55b104695d; AUTH_SESSION_ID_LEGACY=12fea1b2-5b34-44fb-b0dc-ad55b104695d; KEYCLOAK_IDENTITY=eyJhbGciOiJIUzUxMiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICI5MWY5ZjlkMi1iZjA0LTQ3ZjUtOGY4Mi01NWY0ZGEwMmE4MzEifQ.eyJleHAiOjE3MjQwMzM0MTAsImlhdCI6MTcyMzk5NzQxMCwianRpIjoiOTBhZmY4ZTUtNTYxOS00ODU0LWJiNDMtZTk2NmViMGQzYzc4IiwiaXNzIjoiaHR0cHM6Ly9zc28tZGV2LnRoZW1heGxpdmUuY29tL3JlYWxtcy9tYXgtbGl2ZSIsInN1YiI6IjQyOGRkMjA5LTI5ZGUtNDM0Ny1hMWRlLTcwNjQ5OTE2N2Q4MiIsInR5cCI6IlNlcmlhbGl6ZWQtSUQiLCJzaWQiOiIxMmZlYTFiMi01YjM0LTQ0ZmItYjBkYy1hZDU1YjEwNDY5NWQiLCJzdGF0ZV9jaGVja2VyIjoicUg1RlNHTTQtWWQ3LUx6N2RsWGtwNVdObldPQmdvM1gzYlVLczNMVV9WRSJ9.TgA4vN1nupmUTM2ON-iop49TLqZLJjKYY2v4G9xkbgb7rcYi082zYytkqylrJSsJkt2LXZ9C92fW7ynzgESLaw; KEYCLOAK_IDENTITY_LEGACY=eyJhbGciOiJIUzUxMiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICI5MWY5ZjlkMi1iZjA0LTQ3ZjUtOGY4Mi01NWY0ZGEwMmE4MzEifQ.eyJleHAiOjE3MjQwMzM0MTAsImlhdCI6MTcyMzk5NzQxMCwianRpIjoiOTBhZmY4ZTUtNTYxOS00ODU0LWJiNDMtZTk2NmViMGQzYzc4IiwiaXNzIjoiaHR0cHM6Ly9zc28tZGV2LnRoZW1heGxpdmUuY29tL3JlYWxtcy9tYXgtbGl2ZSIsInN1YiI6IjQyOGRkMjA5LTI5ZGUtNDM0Ny1hMWRlLTcwNjQ5OTE2N2Q4MiIsInR5cCI6IlNlcmlhbGl6ZWQtSUQiLCJzaWQiOiIxMmZlYTFiMi01YjM0LTQ0ZmItYjBkYy1hZDU1YjEwNDY5NWQiLCJzdGF0ZV9jaGVja2VyIjoicUg1RlNHTTQtWWQ3LUx6N2RsWGtwNVdObldPQmdvM1gzYlVLczNMVV9WRSJ9.TgA4vN1nupmUTM2ON-iop49TLqZLJjKYY2v4G9xkbgb7rcYi082zYytkqylrJSsJkt2LXZ9C92fW7ynzgESLaw; KEYCLOAK_SESSION="max-live/428dd209-29de-4347-a1de-706499167d82/12fea1b2-5b34-44fb-b0dc-ad55b104695d"; KEYCLOAK_SESSION_LEGACY="max-live/428dd209-29de-4347-a1de-706499167d82/12fea1b2-5b34-44fb-b0dc-ad55b104695d"'
```