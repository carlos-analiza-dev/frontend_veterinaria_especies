import { useThemeColor } from "@/presentation/theme/hooks/useThemeColor";
import { View } from "react-native";
import {
  Button,
  HelperText,
  IconButton,
  Modal,
  Portal,
  Text,
  TextInput,
} from "react-native-paper";

interface Props {
  visibleAddDeptoModal: boolean;
  hideAddDeptoModal: () => void;
  newDeptoNombre: string;
  setNewDeptoNombre: React.Dispatch<React.SetStateAction<string>>;
  error: string;
  handleAddDepartamento: () => Promise<void>;
}

const ModalAddDepto = ({
  hideAddDeptoModal,
  error,
  newDeptoNombre,
  setNewDeptoNombre,
  visibleAddDeptoModal,
  handleAddDepartamento,
}: Props) => {
  const primary = useThemeColor({}, "primary");
  return (
    <Portal>
      <Modal
        visible={visibleAddDeptoModal}
        onDismiss={hideAddDeptoModal}
        contentContainerStyle={{
          backgroundColor: "white",
          padding: 20,
          margin: 20,
          borderRadius: 8,
        }}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text variant="titleLarge">Agregar Departamento</Text>
          <IconButton icon="close" onPress={hideAddDeptoModal} />
        </View>

        <TextInput
          label="Nombre del Departamento"
          value={newDeptoNombre}
          onChangeText={setNewDeptoNombre}
          mode="outlined"
          style={{ marginTop: 15 }}
          error={!!error}
        />
        {error && <HelperText type="error">{error}</HelperText>}

        <Button
          mode="contained"
          onPress={handleAddDepartamento}
          style={{ marginTop: 20 }}
          icon="check"
          buttonColor={primary}
        >
          Guardar Departamento
        </Button>
      </Modal>
    </Portal>
  );
};

export default ModalAddDepto;
