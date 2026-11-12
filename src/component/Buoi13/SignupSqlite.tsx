import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import { addUser } from '../Buoi11/database';

export default function SignupSqlite(props: any) {
  const { navigation } = props;

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async () => {
    const u = username.trim();
    const p = password.trim();

    if (!u || !p) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu!');
      return;
    }

    const ok = await addUser(u, p, 'user');
    if (ok) {
      setUsername('');
      setPassword('');

      if (Platform.OS === 'web') {
        window.alert('Đăng ký tài khoản thành công! Nhấn OK để chuyển sang trang Đăng nhập.');
        navigation.navigate('Login');
      } else {
        Alert.alert('Thành công', 'Đăng ký tài khoản thành công!', [
          {
            text: 'Đăng nhập ngay',
            onPress: () => navigation.navigate('Login'),
          },
        ]);
        // Tự động chuyển trang phòng trường hợp người dùng bấm ra ngoài popup
        navigation.navigate('Login');
      }
    } else {
      Alert.alert('Lỗi', 'Tên đăng nhập đã tồn tại! Vui lòng chọn tên khác.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ĐĂNG KÝ TÀI KHOẢN</Text>

      <TextInput
        placeholder="Tên đăng nhập"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        style={styles.input}
      />
      <TextInput
        placeholder="Mật khẩu"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <TouchableOpacity style={styles.btn} onPress={handleSignup}>
        <Text style={styles.btnText}>Đăng Ký</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.switchBtn} 
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.switchText}>Đã có tài khoản? Đăng nhập ngay</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 20, color: '#2e7d32' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 14, fontSize: 14 },
  btn: { backgroundColor: '#2e7d32', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 4 },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  switchBtn: { marginTop: 20, alignItems: 'center' },
  switchText: { color: '#007ACC', fontSize: 15, fontWeight: '600', textDecorationLine: 'underline' },
});