import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: 'http://localhost:8080/',
  realm: 'max-live-test',
  clientId: 'max-live-web'
});

export default keycloak;