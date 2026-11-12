import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  Keyboard,
} from 'react-native';
import Child from './Buổi 1-5/Child';

// Hàm thông báo dùng chung tương thích Web + Mobile
const showAlert = (title: string, message: string) => {
  Keyboard.dismiss();
  if (Platform.OS === 'web') {
    alert(`${title}: ${message}`);
  } else {
    Alert.alert(title, message);
  }
};

export default function Parent() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [display, setDisplay] = useState('');

  const [nameSubmit, setNameSubmit] = useState('');
  const [ageSubmit, setAgeSubmit] = useState('');
  const [count, setCount] = useState(0);

  const inputRef = useRef<TextInput>(null);

  // Kiểm tra dữ liệu chung
  const validateInput = (inputName: string, inputAge: string): boolean => {
    if (inputName.trim() === '') {
      showAlert('Lỗi', 'Vui lòng nhập tên');
      return false;
    }
    if (inputAge.trim() === '') {
      showAlert('Lỗi', 'Vui lòng nhập tuổi');
      return false;
    }
    if (isNaN(Number(inputAge))) {
      showAlert('Lỗi', 'Tuổi phải là số');
      return false;
    }
    if (Number(inputAge) <= 0) {
      showAlert('Lỗi', 'Tuổi phải lớn hơn 0');
      return false;
    }
    return true;
  };

  // Cha -> Con
  const sendToChild = () => {
    if (!validateInput(name, age)) return;

    setNameSubmit(name);
    setAgeSubmit(age);
    setCount(prev => prev + 1);
  };

  // Con -> Cha
  const receiveFromChild = (childName: string, childAge: string) => {
    setName(childName);
    setAge(childAge);
  };

  const onClear = () => {
    setName('');
    setAge('');
    setDisplay('');
    inputRef.current?.focus();
  };

  const onDisplay = () => {
    if (!validateInput(name, age)) return;
    setDisplay(`Cha: ${name} - ${age} tuổi`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>COMPONENT CHA</Text>

      <TextInput
        ref={inputRef}
        style={styles.input}
        placeholder="Nhập tên"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Nhập tuổi"
        keyboardType="numeric"
        value={age}
        onChangeText={setAge}
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.smallButton} onPress={sendToChild}>
          <Text style={styles.buttonText}>Truyền Con</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.smallButton} onPress={onClear}>
          <Text style={styles.buttonText}>Xóa</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.smallButton} onPress={onDisplay}>
          <Text style={styles.buttonText}>Hiển thị</Text>
        </TouchableOpacity>
      </View>

      {display !== '' && <Text style={styles.info}>{display}</Text>}

      <Child
        nameProp={nameSubmit}
        ageProp={ageSubmit}
        countProp={count}
        onSendToParent={receiveFromChild}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    borderColor: '#ccc',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  smallButton: {
    backgroundColor: '#00daf2',
    width: '31%',
    height: 50,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  info: {
    marginTop: 15,
    fontSize: 18,
    fontWeight: 'bold',
  },
});