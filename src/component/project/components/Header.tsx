import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, StatusBar } from 'react-native';
import { User } from '../database/db'; // Hoặc đường dẫn database tương ứng

interface Props {
  currentUser: User | null;
  onLogout?: () => void;
  navigation?: any;
}

export default function Header({ currentUser, onLogout }: Props) {
  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>🛍️ MINI SHOP</Text>
        <Text style={styles.sub}>
          {currentUser 
            ? `Xin chào, ${currentUser.username} (${currentUser.role === 'admin' ? 'Quản trị viên' : 'Thành viên'})` 
            : 'Chào mừng bạn đến với cửa hàng!'}
        </Text>
      </View>

      {/* Chỉ hiển thị nút Đăng xuất khi đã đăng nhập thành công */}
      {currentUser && onLogout && (
        <TouchableOpacity style={styles.btnLogout} onPress={onLogout}>
          <Text style={styles.btnText}>Đăng xuất</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 20) + 8 : 12,
    paddingBottom: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#F0F0F0',
  },
  title: { fontSize: 20, fontWeight: 'bold', color: '#007ACC' },
  sub: { fontSize: 13, color: '#777', marginTop: 3 },
  btnLogout: { 
    backgroundColor: '#FF3B30', 
    paddingVertical: 6, 
    paddingHorizontal: 14, 
    borderRadius: 6 
  },
  btnText: { color: '#FFF', fontWeight: 'bold', fontSize: 12 },
});