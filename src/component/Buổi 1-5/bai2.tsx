import {
  Alert,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Khai báo kiểu dữ liệu cho props đúng chuẩn TypeScript
interface GreetingProps {
  name: string;
  age: string | number;
}

// Component con nhận props name và age
function Greeting({ name, age }: GreetingProps) {
  const handlePress = () => {
    const message = `Hello ${name}\nand ${age} years old`;

    // Kiểm tra môi trường để hiển thị Alert mượt nhất
    if (Platform.OS === "web") {
      alert(message);
    } else {
      Alert.alert("Thông báo", message);
    }
  };

  return (
    <View style={styles.container}>
      {/* Hiển thị Hello tên chính giữa màn hình */}
      <Text style={styles.text}>Hello {name}</Text>

      {/* Nút bấm tự tùy chỉnh giao diện (Custom Button) */}
      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.7}
        onPress={handlePress}
      >
        <Text style={styles.buttonText}>Press me!</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function Bai2() {
  return <Greeting name="Nguyễn Thị Ngọc Anh" age="20" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Phủ toàn bộ màn hình
    justifyContent: "center", // Căn giữa theo chiều dọc
    alignItems: "center", // Căn giữa theo chiều ngang
    backgroundColor: "white",
  },
  text: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "red",
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "blue",
    backgroundColor: "blue",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
  },
});
