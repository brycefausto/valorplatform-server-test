const serviceAccount = {
  type: 'service_account',
  project_id: 'automotive-tool-room',
  private_key_id: '885ea4b968f9c6ef63675f1d3463530a6b738c36',
  private_key: process.env.SERVICE_ACCOUNT_PRIVATE_KEY || '',
  client_email:
    'firebase-adminsdk-1rzav@automotive-tool-room.iam.gserviceaccount.com',
  client_id: '114602999368091928210',
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url:
    'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-1rzav%40automotive-tool-room.iam.gserviceaccount.com',
  universe_domain: 'googleapis.com',
};

export default serviceAccount;
