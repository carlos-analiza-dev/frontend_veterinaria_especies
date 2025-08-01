import { Cita } from "@/core/medicos/interfaces/obtener-citas-medicos.interface";

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
