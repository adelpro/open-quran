export const clientConfig = {
  APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || 'App',
  APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
};

export const serverConfig = {
  EXPRESSTURN_USERNAME: process.env.EXPRESSTURN_USERNAME,
  EXPRESSTURN_CREDENTIAL: process.env.EXPRESSTURN_CREDENTIAL,
  METERED_USERNAME: process.env.METERED_USERNAME,
  METERED_CREDENTIAL: process.env.METERED_CREDENTIAL,
};
