import { Buffer } from 'buffer';

import RingCentral from '@rc-ex/core/src/index';
import WebPhone from 'ringcentral-web-phone/src/index';
import { SipInfo } from 'ringcentral-web-phone/types';

window.Buffer = Buffer; // polyfill for browser

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
  await rc.revoke(); // Web Phone SDK doesn't need a long-living Restful API access token, you MAY logout

  const webPhone = new WebPhone({ sipInfo, debug: false });
  await webPhone.start();

  // inbound call
  webPhone.on('inboundCall', (callSession) => {
    console.log('Inbound call');
    callSession.once('answered', () => {
      console.log('Inbould call answered');
    });
    callSession.once('disposed', () => {
      console.log('Inbould call disposed');
    });
    callSession.answer();
  });

  // outbound call
  const button = document.createElement('button');
  button.textContent = 'Click Me to do outbound call';
  button.addEventListener('click', async () => {
    button.disabled = true;
    try {
      console.log('Making outbound call....');
      const callSession = await webPhone.call(process.env.RINGCENTRAL_CALLEE!);
      callSession.once('disposed', () => {
        console.log('Outbound call disposed');
        button.disabled = false;
      });
    } catch (e) {
      console.log(e);
      button.disabled = false;
    }
  });
  document.body.appendChild(button);
};
main();
