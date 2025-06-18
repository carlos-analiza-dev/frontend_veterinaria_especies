export const extractNumberFromIdentifier = (identifier: string | undefined) => {
  if (!identifier) return "";
  const match = identifier.match(/-(\d{6})$/);
  return match ? match[1] : "";
};
