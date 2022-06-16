let initMobile = 13000000000;
export const genMobile = (): string => {
  initMobile += 1;
  return initMobile.toString();
};
