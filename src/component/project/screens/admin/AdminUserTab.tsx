import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Platform } from 'react-native';
import { User, updateUserRole, deleteUser } from '../../database/db';

interface Props {
  users: User[];
  onRefresh: () => void;
}

export default function AdminUserTab({ users, onRefresh }: Props) {
  const handleToggleRole = (user: User) => {
    if (user.username === 'admin') {
      const msg = 'Không thể đổi vai trò của Admin gốc!';
      if (Platform.OS === 'web') window.alert(msg);
      else Alert.alert('Thông báo', msg);
      return;
    }

    const nextRole = user.role === 'admin' ? 'user' : 'admin';
    const execute = async () => {
      await updateUserRole(Number(user.id), user.role);
      onRefresh();
    };

    if (Platform.OS === 'web') {
      if (window.confirm(`Đổi vai trò "${user.username}" sang ${nextRole}?`)) execute();
    } else {
      Alert.alert('Đổi vai trò', `Đổi "${user.username}" sang ${nextRole}?`, [
        { text: 'Hủy', style: 'cancel' },
        { text: 'Đồng ý', onPress: execute },
      ]);
    }
  };

  const handleDeleteUser = (user: User) => {
    if (user.username === 'admin') {
      const msg = 'Không thể xóa tài khoản Admin mặc định!';
      if (Platform.OS === 'web') window.alert(msg);
      else Alert.alert('Cảnh báo', msg);
      return;
    }

    const execute = async () => {
      await deleteUser(Number(user.id));
      onRefresh();
    };

    if (Platform.OS === 'web') {
      if (window.confirm(`Xóa người dùng "${user.username}"?`)) execute();
    } else {
      Alert.alert('Xóa User', `Bạn có chắc muốn xóa "${user.username}"?`, [
        { text: 'Hủy', style: 'cancel' },
        { text: 'Xóa', style: 'destructive', onPress: execute },
      ]);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header Bảng vừa khít màn hình */}
      <View style={styles.tableHeader}>
        <Text style={[styles.headerCell, { flex: 0.8 }]}>ID</Text>
        <Text style={[styles.headerCell, { flex: 1.5, textAlign: 'left', paddingLeft: 6 }]}>Tài khoản</Text>
        <Text style={[styles.headerCell, { flex: 1 }]}>Vai trò</Text>
        <Text style={[styles.headerCell, { flex: 1.6 }]}>Đổi quyền</Text>
        <Text style={[styles.headerCell, { flex: 0.9 }]}>Xóa</Text>
      </View>

      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<Text style={styles.empty}>Chưa có user nào.</Text>}
        renderItem={({ item, index }) => {
          const isAdmin = item.role === 'admin';
          const isRoot = item.username === 'admin';

          return (
            <View style={[styles.tableRow, index % 2 === 1 && styles.rowAlt]}>
              <Text style={[styles.cell, { flex: 0.8, textAlign: 'center', fontSize: 11 }]}>
                #{String(item.id).slice(-4)}
              </Text>
              
              <Text style={[styles.cell, { flex: 1.5, fontWeight: 'bold', paddingLeft: 6 }]} numberOfLines={1}>
                {item.username}
              </Text>

              <View style={[styles.cell, { flex: 1, alignItems: 'center' }]}>
                <Text style={[styles.badgeRole, isAdmin ? styles.badgeAdmin : styles.badgeUser]}>
                  {item.role}
                </Text>
              </View>

              <View style={[styles.cell, { flex: 1.6, alignItems: 'center' }]}>
                {!isRoot ? (
                  <TouchableOpacity style={styles.btnRole} onPress={() => handleToggleRole(item)}>
                    <Text style={styles.btnRoleText}>➔ {isAdmin ? 'user' : 'admin'}</Text>
                  </TouchableOpacity>
                ) : (
                  <Text style={styles.lockText}>Gốc</Text>
                )}
              </View>

              <View style={[styles.cell, { flex: 0.9, alignItems: 'center' }]}>
                {!isRoot ? (
                  <TouchableOpacity style={styles.btnDelete} onPress={() => handleDeleteUser(item)}>
                    <Text style={styles.btnDeleteText}>Xóa</Text>
                  </TouchableOpacity>
                ) : (
                  <Text style={styles.lockText}>Khóa</Text>
                )}
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF', borderRadius: 8, borderWidth: 1, borderColor: '#E0E0E0', overflow: 'hidden' },
  tableHeader: { flexDirection: 'row', backgroundColor: '#007ACC', paddingVertical: 10, alignItems: 'center' },
  headerCell: { color: '#FFF', fontWeight: 'bold', fontSize: 12, textAlign: 'center' },
  tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#EEE', alignItems: 'center', paddingVertical: 10 },
  rowAlt: { backgroundColor: '#F9FBFD' },
  cell: { justifyContent: 'center' },
  badgeRole: { fontSize: 11, fontWeight: 'bold', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  badgeAdmin: { backgroundColor: '#FFF3E0', color: '#E65100' },
  badgeUser: { backgroundColor: '#E3F2FD', color: '#1565C0' },
  btnRole: { backgroundColor: '#E1F5FE', borderWidth: 1, borderColor: '#81D4FA', paddingVertical: 4, paddingHorizontal: 6, borderRadius: 4 },
  btnRoleText: { fontSize: 11, fontWeight: 'bold', color: '#0277BD' },
  btnDelete: { backgroundColor: '#FFEBEE', borderWidth: 1, borderColor: '#FFCDD2', paddingVertical: 4, paddingHorizontal: 8, borderRadius: 4 },
  btnDeleteText: { fontSize: 11, fontWeight: 'bold', color: '#C62828' },
  lockText: { color: '#AAA', fontSize: 11, fontStyle: 'italic' },
  empty: { textAlign: 'center', padding: 24, color: '#888' },
});