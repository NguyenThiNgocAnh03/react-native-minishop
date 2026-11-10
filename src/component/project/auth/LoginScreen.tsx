import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import { getUserByCredentials, User } from '../database/db';

export default function LoginScreen(props: any) {
  const { navigation, onLoginSuccess } = props;
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // State bật/tắt hiển thị mật khẩu
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    const u = username.trim();
    const p = password.trim();
    if (!u || !p) {
      const msg = 'Vui lòng nhập tên đăng nhập và mật khẩu!';
      if (Platform.OS === 'web') window.alert(msg);
      else Alert.alert('Thông báo', msg);
      return;
    }

    let user: User | null = await getUserByCredentials(u, p);
    if (!user && u.toLowerCase() === 'admin' && (p === '123' || p === '123456')) {
      user = { id: 1, username: 'admin', password: p, role: 'admin' };
    }

    if (user) {
      setUsername('');
      setPassword('');

      if (onLoginSuccess) onLoginSuccess(user);

      setTimeout(() => {
        try {
          if (user?.role === 'admin') {
            navigation.navigate('HomeAdminTab');
          } else {
            navigation.navigate('HomeUserTab');
          }
        } catch (e) {
          console.log(e);
        }
      }, 60);

      if (Platform.OS === 'web') {
        window.alert(`Đăng nhập thành công với vai trò ${user.role}!`);
      } else {
        Alert.alert('Thành công', `Chào mừng ${user.username}!`);
      }
    } else {
      const err = 'Sai tên đăng nhập hoặc mật khẩu! (Admin: admin / 123)';
      if (Platform.OS === 'web') window.alert(err);
      else Alert.alert('Thất bại', err);
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

      {/* Ô nhập mật khẩu có nút icon mắt */}
      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Mật khẩu"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          style={styles.passwordInput}
        />
        <TouchableOpacity
          style={styles.eyeBtn}
          onPress={() => setShowPassword(!showPassword)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.eyeIcon}>{showPassword ? '👁️' : '🔒'}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.btn} onPress={handleLogin}>
        <Text style={styles.btnText}>Đăng Nhập</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.switchBtn} onPress={() => navigation.navigate('SignupTab')}>
        <Text style={styles.switchText}>Chưa có tài khoản? Đăng ký ngay</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', backgroundColor: '#FFF' },
  title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 20, color: '#007ACC' },
  input: { borderWidth: 1, borderColor: '#CCC', borderRadius: 8, padding: 12, marginBottom: 14, fontSize: 14 },
  
  // Khung mật khẩu chứa icon mắt
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    marginBottom: 14,
    backgroundColor: '#FFF',
  },
  passwordInput: {
    flex: 1,
    padding: 12,
    fontSize: 14,
  },
  eyeBtn: {
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eyeIcon: {
    fontSize: 16,
  },

  btn: { backgroundColor: '#007ACC', padding: 14, borderRadius: 8, alignItems: 'center' },
  btnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  switchBtn: { marginTop: 20, alignItems: 'center' },
  switchText: { color: '#2E7D32', fontSize: 14, fontWeight: '600', textDecorationLine: 'underline' },
});