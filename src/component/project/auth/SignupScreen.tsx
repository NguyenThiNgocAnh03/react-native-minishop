import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import { addUser } from '../database/db';

export default function SignupScreen(props: any) {
  const { navigation } = props;
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async () => {
    const u = username.trim();
    const p = password.trim();
    if (!u || !p) return Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu!');

    const ok = await addUser(u, p, 'user');
    if (ok) {
      setUsername('');
      setPassword('');
      if (Platform.OS === 'web') {
        window.alert('Đăng ký thành công! Chuyển sang Đăng nhập.');
        navigation.navigate('LoginTab');
      } else {
        Alert.alert('Thành công', 'Đăng ký tài khoản thành công!');
        navigation.navigate('LoginTab');
      }
    } else {
      Alert.alert('Lỗi', 'Tên đăng nhập đã tồn tại!');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ĐĂNG KÝ TÀI KHOẢN</Text>
      <TextInput placeholder="Tên đăng nhập" value={username} onChangeText={setUsername} autoCapitalize="none" style={styles.input} />
      <TextInput placeholder="Mật khẩu" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
      <TouchableOpacity style={styles.btn} onPress={handleSignup}>
        <Text style={styles.btnText}>Đăng Ký</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.switchBtn} onPress={() => navigation.navigate('LoginTab')}>
        <Text style={styles.switchText}>Đã có tài khoản? Đăng nhập ngay</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', backgroundColor: '#FFF' },
  title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 20, color: '#2E7D32' },
  input: { borderWidth: 1, borderColor: '#CCC', borderRadius: 8, padding: 12, marginBottom: 14 },
  btn: { backgroundColor: '#2E7D32', padding: 14, borderRadius: 8, alignItems: 'center' },
  btnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  switchBtn: { marginTop: 20, alignItems: 'center' },
  switchText: { color: '#007ACC', fontSize: 14, fontWeight: '600', textDecorationLine: 'underline' },
});