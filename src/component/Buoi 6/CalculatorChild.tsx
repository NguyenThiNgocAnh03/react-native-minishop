import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';

// Định nghĩa kiểu dữ liệu cho props của Component Con
interface BMIFormProps {
  weight: string;
  height: string;
  onChangeWeight: (text: string) => void;
  onChangeHeight: (text: string) => void;
  onCalculate: () => void;
  onClear: () => void;
  inputRef: React.RefObject<TextInput | null>;
}

export const BMIForm: React.FC<BMIFormProps> = ({
  weight,
  height,
  onChangeWeight,
  onChangeHeight,
  onCalculate,
  onClear,
  inputRef,
}) => {
  return (
    <View style={styles.formContainer}>
      {/* Ô nhập cân nặng */}
      <TextInput
        ref={inputRef}
        style={styles.input}
        placeholder="Nhập cân nặng (kg)"
        keyboardType="numeric"
        value={weight}
        onChangeText={onChangeWeight}
      />

      {/* Ô nhập chiều cao */}
      <TextInput
        style={styles.input}
        placeholder="Nhập chiều cao (cm)"
        keyboardType="numeric"
        value={height}
        onChangeText={onChangeHeight}
      />

      {/* Các nút chức năng */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.btn, styles.btnCalc]} onPress={onCalculate}>
          <Text style={styles.btnText}>Calculate</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn, styles.btnReset]} onPress={onClear}>
          <Text style={styles.btnText}>Reset</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    width: '100%',
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
});