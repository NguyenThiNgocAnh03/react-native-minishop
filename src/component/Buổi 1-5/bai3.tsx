import { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";

export default function App() {
  const [name, setName] = useState("Ngọc Anh");
  const [age, setAge] = useState("20"); 

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hello {name}!</Text>

      {/* Ô nhập Tên */}
      <TextInput
        style={styles.input}
        placeholder="Nhập tên..."
        value={name}
        onChangeText={(text) => setName(text)}
      />

      {/* Ô nhập Tuổi */}
      <TextInput
        style={styles.input}
        placeholder="Nhập tuổi..."
        value={age}
        onChangeText={(text) => setAge(text)}
        keyboardType="numeric" // Hiển thị bàn phím số
      />

      <Button
        title="Xem thông tin"
        onPress={() => alert(`Hello ${name}, ${age} tuổi!`)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    padding: 20,
  },
  text: {
    fontSize: 20,
    marginBottom: 15,
  },
  input: {
    width: "80%",
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
});