import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { getUserByCredentials } from '../Buoi11/database';

export default function LoginSqlite(props: any) {
  const { navigation, onLoginSuccess } = props;

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const u = username.trim();
    const p = password.trim();

    if (!u || !p) {
      Alert.alert('Thông báo', 'Vui lòng nhập tên đăng nhập và mật khẩu!');
      return;
    }

    const user = await getUserByCredentials(u, p);

    if (user) {
      setUsername('');
      setPassword('');
      // Gán user -> index.tsx tự động chuyển sang Trang chủ hoặc Quản trị Admin
      if (onLoginSuccess) {
        onLoginSuccess(user);
      }
    } else {
      Alert.alert('Thất bại', 'Sai tên đăng nhập hoặc mật khẩu! (Admin: admin / 123456, User: user1 / 123)');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ĐĂNG NHẬP</Text>

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

      <TouchableOpacity style={styles.btn} onPress={handleLogin}>
        <Text style={styles.btnText}>Đăng Nhập</Text>
      </TouchableOpacity>

      {/* Sửa đúng tên màn hình thành 'Signup' */}
      <TouchableOpacity 
        style={styles.switchBtn} 
        onPress={() => navigation.navigate('Signup')}
      >
        <Text style={styles.switchText}>Chưa có tài khoản? Đăng ký ngay</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 20, color: '#007ACC' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 14, fontSize: 14 },
  btn: { backgroundColor: '#007ACC', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 4 },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  switchBtn: { marginTop: 20, alignItems: 'center' },
  switchText: { color: '#2e7d32', fontSize: 15, fontWeight: '600', textDecorationLine: 'underline' },
});