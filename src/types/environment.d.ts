declare namespace NodeJS {
  // eslint-disable-next-line unicorn/prevent-abbreviations
  interface ProcessEnv {
    NEXT_PUBLIC_APP_NAME: string;
    NEXT_PUBLIC_APP_URL: string;

    //Secret env
    EXPRESSTURN_USERNAME: string;
    EXPRESSTURN_CREDENTIAL: string;

    METERED_USERNAME: string;
    METERED_CREDENTIAL: string;
  }
}
