import { useRef, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import { BMIForm } from "./CalculatorChild";

type BmiResult = {
  status: string;
  color: string;
};

export default function Calculator() {
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [bmi, setBmi] = useState("0");
  const [resultInfo, setResultInfo] = useState<BmiResult | null>(null);
  const [idealWeightRange, setIdealWeightRange] = useState("");

  const inputRef = useRef<TextInput>(null);

  // Thuật toán tính toán BMI và phân loại theo tiêu chuẩn WHO
  const calculateBMI = () => {
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);

    if (isNaN(weightNum) || isNaN(heightNum)) {
      alert("Vui lòng nhập đầy đủ cân nặng và chiều cao!");
      return;
    }
    if (heightNum <= 0) {
      alert("Chiều cao phải lớn hơn 0!");
      return;
    }
    if (weightNum <= 0) {
      alert("Cân nặng phải lớn hơn 0!");
      return;
    }

    // Tính chỉ số BMI (đổi cm sang m)
    const heightInMeters = heightNum / 100;
    const bmiValue = weightNum / (heightInMeters * heightInMeters);

    // Tính khoảng cân nặng lý tưởng
    const minIdeal = (18.5 * heightInMeters * heightInMeters).toFixed(1);
    const maxIdeal = (24.9 * heightInMeters * heightInMeters).toFixed(1);
    setIdealWeightRange(`${minIdeal} kg - ${maxIdeal} kg`);

    if (isNaN(bmiValue) || !isFinite(bmiValue)) {
      alert("Kết quả không hợp lệ. Vui lòng kiểm tra lại dữ liệu nhập!");
      return;
    }

    // Phân loại BMI & gán màu sắc
    let info: BmiResult;
    if (bmiValue < 18.5) {
      info = { status: "Gầy (Underweight)", color: "#fbc02d" };
    } else if (bmiValue <= 24.9) {
      info = { status: "Bình thường (Normal)", color: "#4caf50" };
    } else if (bmiValue <= 29.9) {
      info = { status: "Thừa cân (Overweight)", color: "#ff9800" };
    } else {
      info = { status: "Béo phì (Obese)", color: "#f44336" };
    }

    setBmi(bmiValue.toFixed(2));
    setResultInfo(info);
  };

  const handleClear = () => {
    setWeight("");
    setHeight("");
    setBmi("0");
    setResultInfo(null);
    setIdealWeightRange("");
    inputRef.current?.focus();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>
          Tính Chỉ Số BMI của Nguyễn Thị Ngọc Anh
        </Text>

        {/* Gọi Component Con và truyền Props & Callback */}
        <BMIForm
          weight={weight}
          height={height}
          onChangeWeight={setWeight}
          onChangeHeight={setHeight}
          onCalculate={calculateBMI}
          onClear={handleClear}
          inputRef={inputRef}
        />

        {/* Khối hiển thị kết quả do Component Cha quản lý */}
        {bmi !== "0" && resultInfo && (
          <View style={[styles.resultCard, { borderColor: resultInfo.color }]}>
            <Text style={styles.resultText}>Chỉ số BMI: {bmi}</Text>
            <View style={[styles.badge, { backgroundColor: resultInfo.color }]}>
              <Text style={styles.badgeText}>{resultInfo.status}</Text>
            </View>
            <Text style={styles.idealWeightText}>
              Khoảng cân nặng lý tưởng: {idealWeightRange}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f5f5f5" },
  container: { flexGrow: 1, padding: 20 },
  title: {
    marginBottom: 24,
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  resultCard: {
    marginTop: 24,
    padding: 16,
    borderWidth: 2,
    borderRadius: 12,
    backgroundColor: "#ffffff",
  },
  resultText: { marginBottom: 12, fontSize: 20, fontWeight: "bold" },
  badge: {
    alignSelf: "flex-start",
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  badgeText: { color: "#ffffff", fontWeight: "bold" },
  idealWeightText: { fontSize: 16 },
});
