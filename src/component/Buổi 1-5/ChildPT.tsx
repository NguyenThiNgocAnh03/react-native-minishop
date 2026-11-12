import React, { useEffect, useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

type Props = {
  aProp: string;
  bProp: string;
  onSendToParent: (a: string, b: string) => void;
};

export default function ChildComponent({
  aProp,
  bProp,
  onSendToParent,
}: Props) {
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [result, setResult] = useState('');

  useEffect(() => {
    setA(aProp);
    setB(bProp);
  }, [aProp, bProp]);

  const onGiai = () => {
    const numA = parseFloat(a);
    const numB = parseFloat(b);

    if (isNaN(numA) || isNaN(numB)) {
      Alert.alert('Lỗi', 'Vui lòng nhập số hợp lệ');
      return;
    }

    if (numA === 0) {
      if (numB === 0) {
        setResult('Phương trình vô số nghiệm');
      } else {
        setResult('Phương trình vô nghiệm');
      }
    } else {
      const x = -numB / numA;
      setResult(`x = ${x.toFixed(2)}`);
    }
  };

  const onClear = () => {
    setA('');
    setB('');
    setResult('');
  };

  const sendToParent = () => {
    onSendToParent(a, b);
  };

  return (
    <View style={{ marginTop: 30 }}>
      <Text style={styles.title}>COMPONENT CON</Text>

      <TextInput
        style={styles.input}
        placeholder="Nhập hệ số A"
        value={a}
        onChangeText={setA}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Nhập hệ số B"
        value={b}
        onChangeText={setB}
        keyboardType="numeric"
      />

      <View style={styles.row}>
        <TouchableOpacity
          style={styles.button}
          onPress={onGiai}>
          <Text style={styles.buttonText}>Giải PT</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={onClear}>
          <Text style={styles.buttonText}>Xóa</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.result}>{result}</Text>

      <TouchableOpacity
        style={styles.bigButton}
        onPress={sendToParent}>
        <Text style={styles.buttonText}>
          Truyền lên Cha
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },

  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
    fontSize: 20,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },

  button: {
    backgroundColor: '#16cbe3',
    padding: 12,
    marginHorizontal: 5,
    borderRadius: 5,
  },

  bigButton: {
    backgroundColor: '#16cbe3',
    padding: 12,
    marginTop: 10,
    borderRadius: 5,
  },

  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },

  result: {
    textAlign: 'center',
    fontSize: 20,
    marginTop: 10,
    fontWeight: 'bold',
  },
});