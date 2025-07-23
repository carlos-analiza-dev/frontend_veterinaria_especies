import { veterinariaAPI } from "@/core/api/veterinariaApi";
import { ResponseInterfaceAnalisisSuelo } from "../interface/response-analisis-suelo.interface";

const ObtenerAnalisisSuelo = async (limit: number = 10, offset: number = 0) => {
  const url = `${process.env.EXPO_PUBLIC_API_URL}/analisis-usuario?limit=${limit}&offset=${offset}`;

  const response = await veterinariaAPI.get<ResponseInterfaceAnalisisSuelo>(
    url
  );

  return response;
};

export default ObtenerAnalisisSuelo;
