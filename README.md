### SketchSync

Real-time colaborative whiteboard.

## Demo

https://github.com/TanX-009/sketchsync/blob/main/assets/demo.mp4

## Setup

- ### Development

  1.  #### Keycloak
      Deploy keycloak image using docker
      ```bash
      docker run \
            -p 8080:8080 \
            -e KEYCLOAK_ADMIN=<adminnamehere> \
            -e KEYCLOAK_ADMIN_PASSWORD=<passhere> \
            quay.io/keycloak/keycloak:25.0.2 \
            start-dev
      ```
  2.  #### Frontend

      Set env (`.env.local` or `.env.development` or `.env`)

      ```env
      KEYCLOAK_CLIENT_ID="<keycloakclientid>"
      KEYCLOAK_CLIENT_SECRET="<keycloakclientsecret>"
      KEYCLOAK_ISSUER="http://<host>:8080/realms/<relmname>"

      NEXTAUTH_URL="http://<host>:3000"
      NEXTAUTH_SECRET="<nextauthsecret>"

      NEXT_PUBLIC_SERVER_API_URL="http://<host>:4000"
      ```

      Install dependencies and start

      ```bash
      cd /path/to/sketchsync/client
      npm install
      npm run dev
      ```

  3.  #### Backend
      Set env (`.env`)
      ```env
      CLIENT_URL="<frontendhosturl>"
      ```

      Install dependencies and start
      
      ```bash
      cd /path/to/sketchsync/server
      npm install
      npm run dev
      ```

- ### Production
  1.  #### Keycloak
      Keycloak production requires domain and TLS certification
      Refer to keycloak docs for more info
  2.  #### Frontend/Backend
      Simply deploy on any prefered deployment provider.
      And add env as directed by the deployment provider.
