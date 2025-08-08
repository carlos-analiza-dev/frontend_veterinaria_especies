import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

export const ObtenerFacturaCita = async (id: string) => {
  try {
    const url = `${process.env.EXPO_PUBLIC_API_URL}/generate-pdf/${id}`;
    const localPath = FileSystem.documentDirectory + `factura-${id}.pdf`;

    const { uri } = await FileSystem.downloadAsync(url, localPath);

    if (!(await Sharing.isAvailableAsync())) {
      alert("Compartir no está disponible en este dispositivo");
      return;
    }

    await Sharing.shareAsync(uri);
  } catch (error) {
    console.error("Error descargando o compartiendo PDF:", error);
  }
};
