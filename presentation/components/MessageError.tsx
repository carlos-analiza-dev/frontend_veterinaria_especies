import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "react-native-paper";
import { ThemedText } from "../theme/components/ThemedText";
import { ThemedView } from "../theme/components/ThemedView";

interface Props {
  titulo: string;
  descripcion: string;
}

const MessageError = ({ titulo, descripcion }: Props) => {
  const { colors } = useTheme();
  return (
    <ThemedView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
        backgroundColor: colors.background,
      }}
    >
      <MaterialCommunityIcons
        name="alert-circle-outline"
        size={60}
        color="gray"
      />
      <ThemedText
        type="title"
        style={{ textAlign: "center", marginTop: 10, marginBottom: 5 }}
      >
        {titulo}
      </ThemedText>
      <ThemedText
        type="default"
        style={{ textAlign: "center", marginBottom: 20 }}
      >
        {descripcion}
      </ThemedText>
    </ThemedView>
  );
};

export default MessageError;
