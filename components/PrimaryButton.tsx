import { Text, TouchableOpacity, StyleSheet } from "react-native";

type Props = {
  title: string;
  onPress: () => void;
};

export default function PrimaryButton({ title, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#2563eb",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 12,
  },
  text: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
});