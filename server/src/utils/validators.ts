export function isValidText(value: string) {
  return value && value.trim().length > 0;
}

export function isValidNumber(value: number) {
  return typeof value === "number" && !isNaN(value);
}

export function isValidDate(value: Date) {
  const date = new Date(value);
  return value && !isNaN(date.getTime());
}
