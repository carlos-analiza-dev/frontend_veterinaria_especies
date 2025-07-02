type AllowedIcons =
  | "cow"
  | "food-drumstick"
  | "cow-off"
  | "horse-human"
  | "school"
  | "paw";

export const getTipoExplotacionIcon = (explotacion: string): AllowedIcons => {
  switch (explotacion.toLowerCase()) {
    case "leche":
      return "cow";
    case "carne":
      return "food-drumstick";
    case "doble proposito":
      return "cow-off";
    case "turismo o recreacion":
      return "horse-human";
    case "educacional o deportiva":
      return "school";
    default:
      return "paw";
  }
};
