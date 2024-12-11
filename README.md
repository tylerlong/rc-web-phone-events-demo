# RingCentral Web Phone Events Demo

```
yarn install
```

Create `.env` with the following content.
Specify your own credentials.

```
RINGCENTRAL_SERVER_URL=https://platform.ringcentral.com
RINGCENTRAL_CLIENT_ID=
RINGCENTRAL_CLIENT_SECRET=
RINGCENTRAL_JWT_TOKEN=
RINGCENTRAL_CALLEE=
```

Install [bun](https://bun.sh/) if you haven't done so.
We use bun for development only, it will not become dependency of production.

```
bun packle
bun serve public
```

Go to http://localhost:3000 to test.

Make a inbound call to then Web Phone and hang it up.

Make an outbound call and hang it up.

Watch the browser console.
