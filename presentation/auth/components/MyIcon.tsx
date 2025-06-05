import { Ionicons } from "@expo/vector-icons";
import { TextStyle } from "react-native";

interface Props {
  name: keyof typeof Ionicons.glyphMap;
  color: string;
  size: number;
  style?: TextStyle;
  onPress?: () => void;
}

const MyIcon = ({ name, color, size, style, onPress }: Props) => {
  return (
    <Ionicons
      onPress={onPress}
      style={style}
      name={name}
      color={color}
      size={size}
    />
  );
};

export default MyIcon;
