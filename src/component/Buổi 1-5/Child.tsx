import React, { useEffect, useState, useRef } from 'react';
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

type Props = {
  nameProp: string;
  ageProp: string;
  countProp: number;
  onSendToParent: (name: string, age: string) => void;
};

// Hàm thông báo dùng chung tương thích Web + Mobile
const showAlert = (title: string, message: string) => {
  Keyboard.dismiss();
  if (Platform.OS === 'web') {
    alert(`${title}: ${message}`);
  } else {
    Alert.alert(title, message);
  }
};

export default function Child({
  nameProp,
  ageProp,
  countProp,
  onSendToParent,
}: Props) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [display, setDisplay] = useState('');

  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    setName(nameProp);
    setAge(ageProp);
  }, [countProp]);

  const sendToParent = () => {
    if (name.trim() === '') {
      showAlert('Lỗi', 'Vui lòng nhập tên');
      return;
    }
    if (age.trim() === '') {
      showAlert('Lỗi', 'Vui lòng nhập tuổi');
      return;
    }
    if (isNaN(Number(age))) {
      showAlert('Lỗi', 'Tuổi phải là số');
      return;
    }
    if (Number(age) <= 0) {
      showAlert('Lỗi', 'Tuổi phải lớn hơn 0');
      return;
    }

    onSendToParent(name, age);
  };

  const onClear = () => {
    setName('');
    setAge('');
    setDisplay('');
    inputRef.current?.focus();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>COMPONENT CON</Text>

      <TextInput
        ref={inputRef}
        style={styles.input}
        placeholder="Tên"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Tuổi"
        keyboardType="numeric"
        value={age}
        onChangeText={setAge}
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.smallButton} onPress={sendToParent}>
          <Text style={styles.buttonText}>Truyền lên Cha</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.smallButton} onPress={onClear}>
          <Text style={styles.buttonText}>Xóa</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.smallButton}
          onPress={() => setDisplay(`Con: ${name} - ${age} tuổi`)}
        >
          <Text style={styles.buttonText}>Hiển thị</Text>
        </TouchableOpacity>
      </View>

      {display !== '' && <Text style={styles.info}>{display}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    borderWidth: 1,
    padding: 15,
    borderRadius: 5,
    borderColor: '#ccc',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
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
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
});