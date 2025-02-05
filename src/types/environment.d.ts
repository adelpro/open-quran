declare namespace NodeJS {
  // eslint-disable-next-line unicorn/prevent-abbreviations
  interface ProcessEnv {
    //Public env
    NEXT_PUBLIC_APP_NAME: string;
    NEXT_PUBLIC_APP_URL: string;

    //Secret env
    EXPRESSTURN_USERNAME: string;
    EXPRESSTURN_CREDENTIAL: string;

    METERED_USERNAME: string;
    METERED_CREDENTIAL: string;

    PORT: number;

    FEED_BACK_EMAIL: string;
    FEED_BACK_PASSWORD: string;
    FEED_BACK_SERVICE: string;
    FEED_BACK_HOST: string;
    FEED_BACK_PORT: number;
  }
}
