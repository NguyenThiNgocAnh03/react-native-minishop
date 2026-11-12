import React, { useState } from 'react';
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import ChildComponent from './Buổi 1-5/ChildPT';

export default function Parent() {
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [result, setResult] = useState('');

  const [aChild, setAChild] = useState('');
  const [bChild, setBChild] = useState('');

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

  // Cha -> Con
  const sendToChild = () => {
    setAChild(a);
    setBChild(b);
  };

  // Con -> Cha
  const receiveFromChild = (newA: string, newB: string) => {
    setA(newA);
    setB(newB);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>COMPONENT CHA</Text>

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
        onPress={sendToChild}>
        <Text style={styles.buttonText}>
          Truyền xuống Con
        </Text>
      </TouchableOpacity>

      <ChildComponent
        aProp={aChild}
        bProp={bChild}
        onSendToParent={receiveFromChild}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#fff',
    paddingTop: 90,
  },

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