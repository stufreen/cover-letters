export const lengthToWords = (length: string) => {
  switch (length) {
    case 'short':
      return 75;
    case 'long':
      return 250;
    default:
      return 150;
  }
};
