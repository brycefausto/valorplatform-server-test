import admin from 'firebase-admin';
import { getMessaging } from 'firebase-admin/messaging';
import serviceAccount from './service-account';

const app =
  global.fbApp ||
  admin.initializeApp(
    {
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    },
    'valor-platform',
  );

if (!global.fbApp) {
  global.fbApp = app;
}

export const fbMessaging = getMessaging(app);
