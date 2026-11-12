import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';

// Định nghĩa kiểu dữ liệu cho phân loại
interface BmiResult {
  status: string;
  color: string;
}

export default function Calculator() {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [bmi, setBmi] = useState('0');
  const [resultInfo, setResultInfo] = useState<BmiResult | null>(null);

  const [idealWeightRange, setIdealWeightRange] = useState('');
  const inputRef = useRef<TextInput>(null);

  const calculateBMI = () => {
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);

    if (isNaN(weightNum) || isNaN(heightNum)) {
      alert('Vui lòng nhập đầy đủ cân nặng và chiều cao!');
      return;
    }
    if (heightNum <= 0) {
      alert('Chiều cao phải lớn hơn 0!');
      return;
    }
    if (weightNum <= 0) {
      alert('Cân nặng phải lớn hơn 0!');
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
      alert('Kết quả không hợp lệ. Vui lòng kiểm tra lại dữ liệu nhập!');
      return;
    }

    // Phân loại BMI & gán màu sắc
    let info: BmiResult;
    if (bmiValue < 18.5) {
      info = { status: 'Gầy (Underweight)', color: '#fbc02d' }; 
    } else if (bmiValue <= 24.9) {
      info = { status: 'Bình thường (Normal)', color: '#4caf50' };
    } else if (bmiValue <= 29.9) { 
      info = { status: 'Thừa cân (Overweight)', color: '#ff9800' };
    } else {
      info = { status: 'Béo phì (Obese)', color: '#f44336' }; 
    }

    setBmi(bmiValue.toFixed(2));
    setResultInfo(info);
  };

  const handleClear = () => {
    setWeight('');
    setHeight('');
    setBmi('0');
    setResultInfo(null);
    inputRef.current?.focus();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Tính Chỉ Số BMI của        Nguyễn Thị Ngọc Anh</Text>

        <TextInput
          ref={inputRef}
          style={styles.input}
          placeholder="Nhập cân nặng (kg)"
          keyboardType="numeric"
          value={weight}
          onChangeText={setWeight}
        />
        <TextInput
          style={styles.input}
          placeholder="Nhập chiều cao (cm)"
          keyboardType="numeric"
          value={height}
          onChangeText={setHeight}
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.btn, styles.btnCalc]} onPress={calculateBMI}>
            <Text style={styles.btnText}>Calculate</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, styles.btnReset]} onPress={handleClear}>
            <Text style={styles.btnText}>Reset</Text>
          </TouchableOpacity>
        </View>

        {/* Khối hiển thị kết quả */}
        {bmi !== '0' && resultInfo && (
          <View style={[styles.resultCard, { borderColor: resultInfo.color }]}>
            <Text style={styles.resultText}>Chỉ số BMI: {bmi}</Text>
            <View style={[styles.badge, { backgroundColor: resultInfo.color }]}>
              <Text style={styles.badgeText}>{resultInfo.status}</Text>
            </View>
            <Text style={styles.idealWeightText}>Khoảng cân nặng lý tưởng: {idealWeightRange}</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 20,
  },
  container: {
    padding: 20,
    alignItems: 'center',
    
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  input: {
    width: '100%',
    height: 48,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  btn: {
    flex: 0.48,
    height: 45,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnCalc: {
    backgroundColor: '#2196F3',
  },
  btnReset: {
    backgroundColor: '#757575',
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  resultCard: {
    width: '100%',
    marginTop: 24,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
    alignItems: 'center',
    borderWidth: 2,
  },
  resultText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  badgeText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  idealWeightText: {
    fontSize: 16,
    marginTop: 8,
    textAlign: 'center',
    color: '#13e7a4',
  },
});