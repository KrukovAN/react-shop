export const getBeautifulNumber = (
  value: string,
  separator: string = " ",
): string => value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator);
