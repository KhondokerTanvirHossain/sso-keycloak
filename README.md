Keycloak
========

To get help configuring Keycloak via the CLI, run:

on Linux/Unix:

    $ bin/kc.sh

on Windows:

    $ bin\kc.bat

To try Keycloak out in development mode, run: 

on Linux/Unix:

    $ bin/kc.sh start-dev

on Windows:

    $ bin\kc.bat start-dev

After the server boots, open http://localhost:8080 in your web browser. The welcome page will indicate that the server is running.

To get started, check out the [configuration guides](https://www.keycloak.org/guides#server).

```bash
sudo -i -u postgres
psql
```

```psql
CREATE DATABASE keycloaktest;
CREATE USER developer WITH ENCRYPTED PASSWORD 'developer';
GRANT ALL PRIVILEGES ON DATABASE keycloaktest TO developer;
```

```bash
bin/kc.sh start-dev --db postgres --db-url jdbc:postgresql://localhost:5432/keycloaktest --db-username developer --db-password developer
```
