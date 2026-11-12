import { useEffect, useRef, useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";

export default function App() {
  // Khai báo state lưu hệ số a, b và kết quả
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [result, setResult] = useState("");
  const inputARef = useRef<TextInput>(null);
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     inputARef.current?.focus();
  //   }, 100);
  //   return () => clearTimeout(timer);
  // }, []);


  // Hàm giải phương trình ax + b = 0
  const handleSolve = () => {
    const numA = parseFloat(a);
    const numB = parseFloat(b);

    // Kiểm tra dữ liệu đầu vào
    if (isNaN(numA) || isNaN(numB)) {
      alert("Vui lòng nhập đầy đủ hệ số a và b!");
      return;
    }

    // Biện luận nghiệm
    if (numA === 0) {
      if (numB === 0) {
        setResult("Phương trình vô số nghiệm");
      } else {
        setResult("Phương trình vô nghiệm");
      }
    } else {
      const x = -numB / numA;
      setResult(`Phương trình có nghiệm \n x = ${x.toFixed(2)}`);
    }
  };
  const handleClear = () => {
    setA("");
    setB("");
    setResult("");
    inputARef.current?.focus();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Giải phương trình ax + b = 0</Text>

      {/* Nhập hệ số a */}
      <TextInput
        ref={inputARef}
        style={styles.input}
        placeholder="Nhập hệ số a"
        keyboardType="numbers-and-punctuation"
        value={a}
        onChangeText={(text) => {
          setA(text);
          setResult(""); // Xóa kết quả cũ khi sửa lại a
        }}
      />

      {/* Nhập hệ số b */}
      <TextInput
        style={styles.input}
        placeholder="Nhập hệ số b"
        keyboardType="numbers-and-punctuation"
        value={b}
        onChangeText={(text) => {
          setB(text);
          setResult(""); // Xóa kết quả cũ khi sửa lại b
        }}
      />

      {/* Nút giải phương trình */}
      <View style={styles.buttonContainer}>
        <Button title="GIAI PHƯƠNG TRÌNH" onPress={handleSolve} />
        <Button title="XÓA" onPress={handleClear} />
      </View>

      {/* Hiển thị kết quả */}
      {result !== "" && <Text style={styles.resultText}>{result}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#a63535",
    borderRadius: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#000",
  },
  input: {
    width: "80%",
    height: 45,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 15,
  },
  buttonContainer: {
    width: "80%",
    marginTop: 5,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  resultText: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: "600",
    color: "#007AFF",
  },
});
