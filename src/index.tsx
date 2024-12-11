// import React, { StrictMode } from 'react';
// import { createRoot } from 'react-dom/client';

// import App from './app';
// import store from './store';

// const root = createRoot(document.getElementById('root')!);
// root.render(
//   <StrictMode>
//     <App store={store} />
//   </StrictMode>,
// );

import RingCentral from '@rc-ex/core';
import WebPhone from 'ringcentral-web-phone';
import { SipInfo } from 'ringcentral-web-phone/types';

const rc = new RingCentral({
  server: process.env.RINGCENTRAL_SERVER_URL,
  clientId: process.env.RINGCENTRAL_CLIENT_ID,
  clientSecret: process.env.RINGCENTRAL_CLIENT_SECRET,
});

const main = async () => {
  await rc.authorize({
    jwt: process.env.RINGCENTRAL_JWT_TOKEN!,
  });
  const r = await rc
    .restapi()
    .clientInfo()
    .sipProvision()
    .post({
      sipInfo: [{ transport: 'WSS' }],
    });
  const sipInfo = r.sipInfo![0] as SipInfo;
  console.log(sipInfo); // this is what we need
  await rc.revoke(); // Web Phone SDK doesn't need a long-living Restful API access token, you MAY logout

  const webPhone = new WebPhone({ sipInfo });
  await webPhone.start();

  webPhone.on('inboundCall', (callSession) => {
    console.log('Inbound call');
    callSession.once('disposed', () => {
      console.log('Call disposed');
    });
  });
};
main();
