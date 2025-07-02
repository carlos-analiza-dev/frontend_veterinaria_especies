export const convertirAHectareas = (valor: string, unidad: string): string => {
  const num = parseFloat(valor);
  if (isNaN(num)) return "0";

  switch (unidad) {
    case "mz":
      return (num * 0.7).toString();
    case "m2":
      return (num * 0.0001).toString();
    case "km2":
      return (num * 100).toString();
    case "ac":
      return (num * 0.4047).toString();
    case "ft2":
      return (num * 0.0000092903).toString();
    case "yd2":
      return (num * 0.0000836127).toString();
    default:
      return valor;
  }
};
