/* eslint-disable @typescript-eslint/no-explicit-any */
export const checkMissingParams = (body: any, params: any): void => {
  const missingParams = params.filter((param: any) => !body[param]);
  if (missingParams.length > 0) {
    throw new Error(`Missing parameters: ${missingParams.join(', ')}`);
  }
};
