export const getErrorMessage = (
  error: unknown,
  customMessage?: string
): string => {
  if (error instanceof Error) {
    return error.message;
  } else if (typeof error === 'string') {
    return error;
  } else {
    return customMessage || 'An unknown error occurred';
  }
};
