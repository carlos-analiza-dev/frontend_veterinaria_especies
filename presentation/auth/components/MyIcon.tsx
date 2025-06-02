import { Ionicons } from "@expo/vector-icons";
import { TextStyle } from "react-native";

interface Props {
  name: keyof typeof Ionicons.glyphMap;
  color: string;
  size: number;
  style?: TextStyle;
}

const MyIcon = ({ name, color, size, style }: Props) => {
  return <Ionicons style={style} name={name} color={color} size={size} />;
};

export default MyIcon;
