import { Cita } from "@/core/citas/interfaces/response-citas-user.interface";

export const getStatusColor = (item: Cita) => {
  switch (item.estado.toLowerCase()) {
    case "pendiente":
      return "#FFA500";
    case "cancelada":
      return "#FF0000";
    case "completada":
      return "#4CAF50";
    default:
      return "#A0A0A0";
  }
};
