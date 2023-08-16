export const lengthToWords = (length: string) => {
  switch (length) {
    case 'short':
      return 100;
    case 'long':
      return 200;
    default:
      return 150;
  }
};
