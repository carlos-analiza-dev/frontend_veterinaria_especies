import { ID_REGEX } from "./regexUser";

export const validateIdentification = (value: string, codigoPais: string) => {
  if (!value) return "La identificación es requerida";

  switch (codigoPais) {
    case "HN":
      return ID_REGEX.HN.regex.test(value) || ID_REGEX.HN.message;
    case "SV":
      return ID_REGEX.SV.regex.test(value) || ID_REGEX.SV.message;
    case "GT":
      return ID_REGEX.GT.regex.test(value) || ID_REGEX.GT.message;
    default:
      return true;
  }
};
