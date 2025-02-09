/**
 * @param option time controls option from timeOptions array
 * @returns time in seconds if the substring before the space is a number of minutes
 * when cast to number, null - if we get NaN
 */
export const getTimeFromOption = (option: string): number | null => {
  const minutes = Number(option.slice(0, option.indexOf(' ')));
  if (isNaN(minutes)) return null;
  return minutes * 60;
};
