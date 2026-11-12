import { StyleSheet, Text, View } from "react-native";

export default function Bai1() {
  const name = "Nguyễn Thị Ngọc Anh";

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hello {name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center", // Căn giữa theo chiều dọc
    alignItems: "center", // Căn giữa theo chiều ngang
    backgroundColor: "white",
  },
  text: {
    color: "red",
    fontSize: 24,
    fontWeight: "bold",
  },
});
