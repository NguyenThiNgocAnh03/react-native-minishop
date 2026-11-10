import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Platform, ScrollView } from 'react-native';
import { User, updateUser } from '../../database/db';

interface Props {
  currentUser: User | null;
  onUserUpdated: (updatedUser: User) => void;
}

export default function ProfileTab({ currentUser, onUserUpdated }: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Quản lý ẩn/hiện cho 2 ô mật khẩu
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setUsername(currentUser.username || '');
      setPassword(currentUser.password || '');
      setConfirmPassword(currentUser.password || '');
    }
  }, [currentUser]);

  if (!currentUser) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>Vui lòng đăng nhập để xem và cập nhật thông tin cá nhân.</Text>
      </View>
    );
  }

  const handleSaveProfile = async () => {
    const cleanU = username.trim();
    const cleanP = password.trim();

    if (!cleanU || !cleanP) {
      const msg = 'Tên tài khoản và mật khẩu không được để trống!';
      if (Platform.OS === 'web') window.alert(msg);
      else Alert.alert('Thông báo', msg);
      return;
    }

    if (cleanP !== confirmPassword.trim()) {
      const msg = 'Xác nhận mật khẩu không khớp!';
      if (Platform.OS === 'web') window.alert(msg);
      else Alert.alert('Thông báo', msg);
      return;
    }

    const updatedUserObj: User = {
      ...currentUser,
      username: cleanU,
      password: cleanP,
    };

    const success = await updateUser(updatedUserObj);

    if (success) {
      onUserUpdated(updatedUserObj);
      const msg = 'Cập nhật thông tin người dùng thành công!';
      if (Platform.OS === 'web') window.alert(msg);
      else Alert.alert('Thành công', msg);
    } else {
      const err = 'Không thể cập nhật thông tin, vui lòng thử lại!';
      if (Platform.OS === 'web') window.alert(err);
      else Alert.alert('Lỗi', err);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      {/* Thẻ Header */}
      <View style={styles.cardHeader}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarLetter}>{currentUser.username?.charAt(0).toUpperCase() || 'U'}</Text>
        </View>
        <Text style={styles.headerName}>{currentUser.username}</Text>
        <Text style={styles.headerRole}>Vai trò: <Text style={styles.roleHighlight}>{currentUser.role}</Text></Text>
      </View>

      {/* Biểu mẫu chỉnh sửa */}
      <View style={styles.cardForm}>
        <Text style={styles.formTitle}>CHỈNH SỬA THÔNG TIN CÁ NHÂN</Text>

        <Text style={styles.label}>Tên tài khoản / Đăng nhập:</Text>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          placeholder="Nhập tên tài khoản..."
          autoCapitalize="none"
        />

        <Text style={styles.label}>Mật khẩu mới:</Text>
        <View style={styles.passWrapper}>
          <TextInput
            style={styles.passInput}
            value={password}
            onChangeText={setPassword}
            placeholder="Nhập mật khẩu..."
            secureTextEntry={!showPass}
          />
          <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowPass(!showPass)}>
            <Text style={styles.eyeText}>{showPass ? '👁️' : '🔒'}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Xác nhận lại mật khẩu:</Text>
        <View style={styles.passWrapper}>
          <TextInput
            style={styles.passInput}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Nhập lại mật khẩu..."
            secureTextEntry={!showConfirmPass}
          />
          <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowConfirmPass(!showConfirmPass)}>
            <Text style={styles.eyeText}>{showConfirmPass ? '👁️' : '🔒'}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.btnSave} onPress={handleSaveProfile}>
          <Text style={styles.btnSaveText}>LƯU THAY ĐỔI</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  emptyText: { color: '#888', fontSize: 14, textAlign: 'center' },

  cardHeader: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#007ACC',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarLetter: { color: '#FFF', fontSize: 26, fontWeight: 'bold' },
  headerName: { fontSize: 17, fontWeight: 'bold', color: '#222' },
  headerRole: { fontSize: 13, color: '#666', marginTop: 4 },
  roleHighlight: { fontWeight: 'bold', color: '#007ACC' },

  cardForm: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  formTitle: { fontSize: 14, fontWeight: 'bold', color: '#333', marginBottom: 14, textAlign: 'center' },
  label: { fontSize: 13, fontWeight: '600', color: '#444', marginBottom: 5 },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 6,
    padding: 10,
    marginBottom: 14,
    fontSize: 14,
    backgroundColor: '#FAFAFA',
  },

  passWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 6,
    backgroundColor: '#FAFAFA',
    marginBottom: 14,
  },
  passInput: {
    flex: 1,
    padding: 10,
    fontSize: 14,
  },
  eyeBtn: {
    paddingHorizontal: 12,
  },
  eyeText: {
    fontSize: 16,
  },

  btnSave: {
    backgroundColor: '#007ACC',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 6,
  },
  btnSaveText: { color: '#FFF', fontSize: 14, fontWeight: 'bold' },
});