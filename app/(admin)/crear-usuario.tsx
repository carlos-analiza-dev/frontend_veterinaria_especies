import { StyleSheet, View } from "react-native";
import FormCreateUser from "./components/FormCreateUser";

const CrearUsuarioScreen = () => {
  return (
    <View style={styles.container}>
      <FormCreateUser />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default CrearUsuarioScreen;
