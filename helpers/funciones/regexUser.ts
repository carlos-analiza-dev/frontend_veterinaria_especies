export const ID_REGEX = {
  HN: {
    regex: /^\d{4}-\d{4}-\d{5}$/,
    message: "Formato inválido. Use: xxxx-xxxx-xxxxx",
    example: "Ejemplo: 0801-1999-01234",
  },
  SV: {
    regex: /^\d{8}-\d{1}$/,
    message: "Formato inválido. Use: xxxxxxxx-x",
    example: "Ejemplo: 04210000-5",
  },
  GT: {
    regex: /^\d{4}-\d{5}-\d{4}$/,
    message: "Formato inválido. Use: xxxx-xxxxx-xxxx",
    example: "Ejemplo: 1234-56789-0123",
  },
  PASSPORT: {
    regex: /^[A-Za-z0-9]{6,20}$/,
    message: "Formato inválido. Use 6-20 caracteres alfanuméricos",
    example: "Ejemplo: AB123456",
  },
};
