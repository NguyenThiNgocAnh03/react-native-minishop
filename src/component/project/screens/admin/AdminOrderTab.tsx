import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { fetchAllOrders, updateOrderStatus, Order, OrderStatus } from '../../database/db';

interface Props {
  onViewDetail?: (order: Order) => void;
}

const statusConfig: Record<OrderStatus, { label: string; color: string; bg: string }> = {
  pending: { label: 'Chờ duyệt', color: '#E65100', bg: '#FFF3E0' },
  approved: { label: 'Đã duyệt', color: '#2E7D32', bg: '#E8F5E9' },
  rejected: { label: 'Từ chối', color: '#C62828', bg: '#FFEBEE' },
};

export default function AdminOrderTab({ onViewDetail }: Props) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadOrders = async () => {
    const list = await fetchAllOrders();
    setOrders(list || []);
  };

  useFocusEffect(useCallback(() => { loadOrders(); }, []));

  const onRefresh = async () => {
    setRefreshing(true);
    await loadOrders();
    setRefreshing(false);
  };

  const handleUpdateStatus = (orderId: number, status: OrderStatus) => {
    const actionText = status === 'approved' ? 'DUYỆT' : 'TỪ CHỐI';

    const execute = async () => {
      await updateOrderStatus(orderId, status);
      await loadOrders();
      const msg = `Đã ${actionText.toLowerCase()} đơn hàng #${orderId}!`;
      if (Platform.OS === 'web') window.alert(msg);
      else Alert.alert('Thành công', msg);
    };

    if (Platform.OS === 'web') {
      if (window.confirm(`Xác nhận ${actionText} đơn hàng #${orderId}?`)) execute();
    } else {
      Alert.alert('Xác nhận tình trạng', `Bạn muốn ${actionText} đơn hàng #${orderId}?`, [
        { text: 'Hủy', style: 'cancel' },
        { text: 'Xác nhận', onPress: execute },
      ]);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={true}>
        <View>
          {/* Header Bảng */}
          <View style={styles.tableHeader}>
            <Text style={[styles.headerCell, styles.colId]}>Mã ĐH</Text>
            <Text style={[styles.headerCell, styles.colCustomer]}>Khách hàng</Text>
            <Text style={[styles.headerCell, styles.colPhone]}>SĐT</Text>
            <Text style={[styles.headerCell, styles.colTotal]}>Tổng tiền</Text>
            <Text style={[styles.headerCell, styles.colStatus]}>Tình trạng</Text>
            <Text style={[styles.headerCell, styles.colAction]}>Duyệt / Từ chối</Text>
          </View>

          {/* Dữ liệu đơn hàng */}
          <FlatList
            data={orders}
            keyExtractor={(item) => item.id.toString()}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            ListEmptyComponent={<Text style={styles.empty}>Chưa có đơn hàng nào.</Text>}
            renderItem={({ item, index }) => {
              const currentStatus: OrderStatus = item.status || 'pending';
              const cfg = statusConfig[currentStatus] || statusConfig.pending;

              return (
                <TouchableOpacity
                  style={[styles.tableRow, index % 2 === 1 && styles.rowAlt]}
                  onPress={() => onViewDetail && onViewDetail(item)}
                  activeOpacity={0.65}
                >
                  <Text style={[styles.cell, styles.colId, styles.boldId]}>
                    #{String(item.id).slice(-6)}
                  </Text>
                  <Text style={[styles.cell, styles.colCustomer]} numberOfLines={1}>
                    {item.customerName || 'Chưa có'}
                  </Text>
                  <Text style={[styles.cell, styles.colPhone]}>
                    {item.phone || 'Chưa có'}
                  </Text>
                  <Text style={[styles.cell, styles.colTotal, styles.priceText]}>
                    {Number(item.total).toLocaleString('vi-VN')} đ
                  </Text>

                  {/* Badge Tình trạng */}
                  <View style={[styles.cell, styles.colStatus]}>
                    <Text style={[styles.badge, { color: cfg.color, backgroundColor: cfg.bg }]}>
                      {cfg.label}
                    </Text>
                  </View>

                  {/* Nút Duyệt / Từ chối */}
                  <View style={[styles.cell, styles.colAction]}>
                    <TouchableOpacity
                      style={[styles.btnApprove, currentStatus === 'approved' && styles.btnDisabled]}
                      onPress={(e) => {
                        e.stopPropagation(); // Không kích hoạt sự kiện bấm vào hàng
                        handleUpdateStatus(item.id, 'approved');
                      }}
                      disabled={currentStatus === 'approved'}
                    >
                      <Text style={styles.btnApproveText}>Duyệt</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.btnReject, currentStatus === 'rejected' && styles.btnDisabled]}
                      onPress={(e) => {
                        e.stopPropagation(); // Không kích hoạt sự kiện bấm vào hàng
                        handleUpdateStatus(item.id, 'rejected');
                      }}
                      disabled={currentStatus === 'rejected'}
                    >
                      <Text style={styles.btnRejectText}>Từ chối</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF', borderRadius: 8, borderWidth: 1, borderColor: '#E0E0E0' },
  tableHeader: { flexDirection: 'row', backgroundColor: '#007ACC', paddingVertical: 10 },
  headerCell: { color: '#FFF', fontWeight: 'bold', fontSize: 12, textAlign: 'center', paddingHorizontal: 6 },
  tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#EEE', alignItems: 'center', paddingVertical: 10, backgroundColor: '#FFF' },
  rowAlt: { backgroundColor: '#F9FBFD' },
  cell: { fontSize: 12, color: '#333', paddingHorizontal: 6 },

  colId: { width: 80, textAlign: 'center' },
  colCustomer: { width: 110, fontWeight: '600' },
  colPhone: { width: 100, textAlign: 'center' },
  colTotal: { width: 110, textAlign: 'right' },
  colStatus: { width: 105, alignItems: 'center' },
  colAction: { width: 145, flexDirection: 'row', justifyContent: 'center', gap: 6 },

  boldId: { fontWeight: 'bold', color: '#007ACC' },
  priceText: { fontWeight: 'bold', color: '#D32F2F' },
  badge: { fontSize: 11, fontWeight: 'bold', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10, textAlign: 'center' },

  btnApprove: { backgroundColor: '#2E7D32', paddingVertical: 5, paddingHorizontal: 9, borderRadius: 4 },
  btnApproveText: { color: '#FFF', fontSize: 11, fontWeight: 'bold' },
  btnReject: { backgroundColor: '#C62828', paddingVertical: 5, paddingHorizontal: 9, borderRadius: 4 },
  btnRejectText: { color: '#FFF', fontSize: 11, fontWeight: 'bold' },
  btnDisabled: { opacity: 0.35 },

  empty: { textAlign: 'center', padding: 24, color: '#888' },
});