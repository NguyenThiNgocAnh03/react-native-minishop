import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, StatusBar } from 'react-native';
import { User } from '../Buoi11/database';

interface HeaderProps {
  currentUser: User | null;
  onLogout?: () => void;
  navigation?: any;
}

export default function Header({ currentUser, onLogout, navigation }: HeaderProps) {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.infoCol}>
        <Text style={styles.brandTitle}>🛍️ MINI SHOP</Text>
        <Text style={styles.welcomeText}>
          {currentUser
            ? `Xin chào, ${currentUser.username} (${currentUser.role})`
            : 'Chào mừng bạn đến với cửa hàng!'}
        </Text>
      </View>

      <View style={styles.actionCol}>
        {currentUser ? (
          <TouchableOpacity style={styles.btnLogout} onPress={onLogout}>
            <Text style={styles.btnText}>Đăng xuất</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.authGroup}>
            <TouchableOpacity
              style={styles.btnLogin}
              onPress={() => navigation?.navigate('Login')}
            >
              <Text style={styles.btnText}>Đăng nhập</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnSignup}
              onPress={() => navigation?.navigate('Signup')}
            >
              <Text style={styles.btnText}>Đăng ký</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 20) + 8 : 10,
    paddingBottom: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  infoCol: {
    flex: 1,
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007ACC',
  },
  welcomeText: {
    fontSize: 12,
    color: '#666666',
    marginTop: 2,
  },
  actionCol: {
    marginLeft: 10,
  },
  btnLogout: {
    backgroundColor: '#FF3B30',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  authGroup: {
    flexDirection: 'row',
    gap: 6,
  },
  btnLogin: {
    backgroundColor: '#007ACC',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  btnSignup: {
    backgroundColor: '#2E7D32',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  btnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
});