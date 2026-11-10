import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert, Platform } from 'react-native';
import { Order, OrderStatus, updateOrderStatus } from '../../database/db';

const FALLBACK_IMAGE = 'https://picsum.photos/150';

const statusConfig: Record<OrderStatus, { label: string; color: string; bg: string }> = {
  pending: { label: 'Chờ duyệt', color: '#E65100', bg: '#FFF3E0' },
  approved: { label: 'Đã duyệt', color: '#2E7D32', bg: '#E8F5E9' },
  rejected: { label: 'Từ chối', color: '#C62828', bg: '#FFEBEE' },
};

export default function OrderDetailScreen({ route, navigation }: any) {
  const { order } = route.params as { order: Order };
  const [status, setStatus] = useState<OrderStatus>(order.status || 'pending');

  const handleUpdate = async (newStatus: OrderStatus) => {
    const actionText = newStatus === 'approved' ? 'DUYỆT' : 'TỪ CHỐI';
    const ok = await updateOrderStatus(Number(order.id), newStatus);
    if (ok) {
      setStatus(newStatus);
      const msg = `Đã ${actionText.toLowerCase()} đơn hàng #${order.id}!`;
      if (Platform.OS === 'web') window.alert(msg);
      else Alert.alert('Thành công', msg);
    }
  };

  const currentCfg = statusConfig[status] || statusConfig.pending;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <View style={styles.card}>
        <View style={styles.rowBetween}>
          <Text style={styles.orderId}>Mã ĐH: #{order.id}</Text>
          <Text style={[styles.badge, { color: currentCfg.color, backgroundColor: currentCfg.bg }]}>
            ● {currentCfg.label}
          </Text>
        </View>
        <Text style={styles.dateText}>🕒 Thời gian: {order.createdAt}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>⚙️ XỬ LÝ ĐƠN HÀNG (ADMIN)</Text>
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.btnAction, { backgroundColor: '#2E7D32' }, status === 'approved' && styles.disabled]}
            onPress={() => handleUpdate('approved')}
            disabled={status === 'approved'}
          >
            <Text style={styles.btnActionText}>✓ DUYỆT ĐƠN HÀNG</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btnAction, { backgroundColor: '#C62828' }, status === 'rejected' && styles.disabled]}
            onPress={() => handleUpdate('rejected')}
            disabled={status === 'rejected'}
          >
            <Text style={styles.btnActionText}>✕ TỪ CHỐI ĐƠN HÀNG</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>📦 THÔNG TIN GIAO HÀNG</Text>
        <View style={styles.divider} />
        <Text style={styles.infoLine}>👤 Người nhận: <Text style={styles.bold}>{order.customerName || 'Chưa cập nhật'}</Text></Text>
        <Text style={styles.infoLine}>📞 Số điện thoại: <Text style={styles.bold}>{order.phone || 'Chưa cập nhật'}</Text></Text>
        <Text style={styles.infoLine}>📍 Địa chỉ: <Text style={styles.bold}>{order.address || 'Chưa cập nhật'}</Text></Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>🛍️ SẢN PHẨM ĐÃ MUA ({order.items?.length || 0})</Text>
        <View style={styles.divider} />
        {order.items && order.items.length > 0 ? (
          order.items.map((it, idx) => (
            <View key={idx} style={styles.itemRow}>
              <Image source={{ uri: it.img || FALLBACK_IMAGE }} style={styles.itemImage} resizeMode="cover" />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.itemName} numberOfLines={2}>{it.productName}</Text>
                <Text style={styles.itemPrice}>{Number(it.price).toLocaleString('vi-VN')} đ</Text>
                <Text style={styles.itemQty}>Số lượng: x{it.quantity}</Text>
              </View>
              <Text style={styles.itemSubtotal}>
                {(Number(it.price) * Number(it.quantity)).toLocaleString('vi-VN')} đ
              </Text>
            </View>
          ))
        ) : (
          <Text style={{ color: '#888', fontStyle: 'italic' }}>Không có dữ liệu chi tiết sản phẩm.</Text>
        )}
      </View>

      <View style={styles.card}>
        <View style={styles.rowBetween}>
          <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Tổng tiền thanh toán:</Text>
          <Text style={styles.totalPrice}>{Number(order.total).toLocaleString('vi-VN')} đ</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Text style={styles.backBtnText}>QUAY LẠI BẢNG ĐƠN HÀNG</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F6F9' },
  card: { backgroundColor: '#FFF', borderRadius: 10, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: '#E8E8E8' },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  orderId: { fontSize: 16, fontWeight: 'bold', color: '#007ACC' },
  dateText: { fontSize: 13, color: '#777', marginTop: 6 },
  badge: { fontSize: 12, fontWeight: 'bold', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  cardTitle: { fontSize: 14, fontWeight: 'bold', color: '#333' },
  divider: { height: 1, backgroundColor: '#EEE', marginVertical: 10 },
  infoLine: { fontSize: 14, color: '#444', marginBottom: 6 },
  bold: { fontWeight: 'bold', color: '#111' },

  actionRow: { flexDirection: 'row', gap: 10, marginTop: 10 },
  btnAction: { flex: 1, paddingVertical: 10, borderRadius: 6, alignItems: 'center' },
  btnActionText: { color: '#FFF', fontWeight: 'bold', fontSize: 12 },
  disabled: { opacity: 0.35 },

  itemRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  itemImage: { width: 55, height: 55, borderRadius: 8, backgroundColor: '#EEE' },
  itemName: { fontSize: 14, fontWeight: '600', color: '#222' },
  itemPrice: { fontSize: 13, color: '#D32F2F', fontWeight: 'bold', marginTop: 2 },
  itemQty: { fontSize: 12, color: '#666', marginTop: 2 },
  itemSubtotal: { fontSize: 14, fontWeight: 'bold', color: '#333' },
  totalPrice: { fontSize: 18, fontWeight: 'bold', color: '#D32F2F' },
  backBtn: { backgroundColor: '#007ACC', paddingVertical: 12, borderRadius: 8, alignItems: 'center', marginVertical: 10 },
  backBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 15 },
});