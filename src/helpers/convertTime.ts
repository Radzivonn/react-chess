/**
 * @param allTimeInSeconds time to convert in mm:ss format (in seconds)
 * @returns time in mm:ss string format
 */
const convertTime = (allTimeInSeconds: number): string => {
  const minutes = Math.floor(allTimeInSeconds / 60);
  const seconds = allTimeInSeconds % 60;
  return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
};

export default convertTime;
