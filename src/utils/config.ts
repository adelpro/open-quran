const getEnvironmentVariable = (
  key: keyof NodeJS.ProcessEnv,
  defaultValue?: string
): string => {
  const value = process.env[key]?.trim();

  console.log('Value', key, value);

  if (!value) {
    console.log('Not found', key);
    if (defaultValue === undefined) {
      console.log('No default value', key);
      throw new Error(`Missing env variable: ${key}`);
    }
    return defaultValue;
  }

  return value;
};

export const config = {
  APP_NAME: getEnvironmentVariable('NEXT_PUBLIC_APP_NAME', 'App'),
  APP_URL: getEnvironmentVariable(
    'NEXT_PUBLIC_APP_URL',
    'http://localhost:3000'
  ),
  EXPRESSTURN_USERNAME: getEnvironmentVariable('EXPRESSTURN_USERNAME'),
  EXPRESSTURN_CREDENTIAL: getEnvironmentVariable('EXPRESSTURN_CREDENTIAL'),
  METERED_USERNAME: getEnvironmentVariable('METERED_USERNAME'),
  METERED_CREDENTIAL: getEnvironmentVariable('METERED_CREDENTIAL'),
};
