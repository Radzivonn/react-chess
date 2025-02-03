/**
 * @param targetEnum Non-const enum to check if it contains "value"
 * @param value Value to check if it is in targetEnum
 * @returns True if the value is contained in enum and false if not.
 * Type guard indicates that after a successful check the value will be of the type of the given enum
 */
const isEnumValue = <T extends Record<string, unknown>>(
  targetEnum: T,
  value: unknown,
): value is T[keyof T] => {
  return Object.values(targetEnum).includes(value);
};

export default isEnumValue;
