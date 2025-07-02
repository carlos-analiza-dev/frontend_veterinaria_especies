type AllowedIcons = "cow" | "horse" | "pig" | "bird" | "sheep" | "paw";

export const getSpeciesIcon = (especie: string): AllowedIcons => {
  switch (especie.toLowerCase()) {
    case "bovina":
      return "cow";
    case "equina":
      return "horse";
    case "porcina":
      return "pig";
    case "aves":
      return "bird";
    case "caprinos":
      return "sheep";
    default:
      return "paw";
  }
};
