import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { Order, OrderStatus, updateOrderStatus } from '../../database/db';

interface Props {
  orders: Order[];
  currentUser: any;
  onRefreshOrders?: () => void;
}

const statusConfig: Record<OrderStatus, { label: string; color: string; bg: string }> = {
  pending: { label: 'Chờ duyệt', color: '#E65100', bg: '#FFF3E0' },
  approved: { label: 'Đã duyệt', color: '#2E7D32', bg: '#E8F5E9' },
  rejected: { label: 'Đã hủy / Từ chối', color: '#C62828', bg: '#FFEBEE' },
};

export default function HistoryTab({ orders, currentUser, onRefreshOrders }: Props) {
  if (!currentUser) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>Vui lòng đăng nhập để xem lịch sử mua hàng.</Text>
      </View>
    );
  }

  const handleCancelOrder = (order: Order) => {
    // Chặn tuyệt đối nếu đơn không còn ở trạng thái chờ duyệt
    if (order.status && order.status !== 'pending') {
      const msg = 'Đơn hàng đã được xử lý, không thể hủy!';
      if (Platform.OS === 'web') window.alert(msg);
      else Alert.alert('Thông báo', msg);
      return;
    }

    const executeCancel = async () => {
      const ok = await updateOrderStatus(Number(order.id), 'rejected');
      if (ok) {
        if (onRefreshOrders) onRefreshOrders();
        const successMsg = 'Đã hủy đơn hàng thành công!';
        if (Platform.OS === 'web') window.alert(successMsg);
        else Alert.alert('Thành công', successMsg);
      }
    };

    const confirmText = `Bạn có chắc chắn muốn hủy đơn hàng #${String(order.id).slice(-6)} không?`;
    if (Platform.OS === 'web') {
      if (window.confirm(confirmText)) executeCancel();
    } else {
      Alert.alert('Xác nhận hủy đơn', confirmText, [
        { text: 'Không', style: 'cancel' },
        { text: 'Hủy đơn', style: 'destructive', onPress: executeCancel },
      ]);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={styles.emptyText}>Bạn chưa có đơn hàng nào.</Text>
          </View>
        }
        renderItem={({ item }) => {
          const currentStatus: OrderStatus = item.status || 'pending';
          const cfg = statusConfig[currentStatus] || statusConfig.pending;
          const isPending = currentStatus === 'pending';

          return (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.orderId}>Mã ĐH: #{String(item.id).slice(-6)}</Text>
                <Text style={[styles.badge, { color: cfg.color, backgroundColor: cfg.bg }]}>
                  ● {cfg.label}
                </Text>
              </View>

              <Text style={styles.dateText}>🕒 Đặt lúc: {item.createdAt}</Text>

              {/* Thông tin nhận hàng */}
              <View style={styles.infoBox}>
                <Text style={styles.infoText}>
                  👤 Người nhận: <Text style={styles.bold}>{item.customerName || currentUser.username}</Text>
                </Text>
                <Text style={styles.infoText}>
                  📞 SĐT: <Text style={styles.bold}>{item.phone || 'Chưa cập nhật'}</Text>
                </Text>
                <Text style={styles.infoText}>
                  📍 Nơi nhận: <Text style={styles.bold}>{item.address || 'Chưa cập nhật'}</Text>
                </Text>
              </View>

              <View style={styles.divider} />

              {/* Danh sách món kèm hình ảnh */}
              {item.items?.map((it, idx) => (
                <View key={idx} style={styles.itemRow}>
                  <Image
                    source={{ uri: it.img || 'https://picsum.photos/100' }}
                    style={styles.itemImg}
                    resizeMode="cover"
                  />

                  <View style={styles.itemInfo}>
                    <Text style={styles.itemName} numberOfLines={1}>
                      {it.productName}
                    </Text>
                    <Text style={styles.itemSub}>
                      {Number(it.price).toLocaleString('vi-VN')} đ × {it.quantity}
                    </Text>
                  </View>

                  <Text style={styles.itemPrice}>
                    {(Number(it.price) * Number(it.quantity)).toLocaleString('vi-VN')} đ
                  </Text>
                </View>
              ))}

              <View style={styles.divider} />

              <View style={styles.cardFooter}>
                <Text style={{ fontWeight: '600' }}>Tổng thanh toán:</Text>
                <Text style={styles.totalPrice}>{Number(item.total).toLocaleString('vi-VN')} đ</Text>
              </View>

              {/* Chỉ hiện nút Hủy khi đơn đang Chờ duyệt (pending) */}
              {isPending && (
                <TouchableOpacity
                  style={styles.btnCancel}
                  onPress={() => handleCancelOrder(item)}
                >
                  <Text style={styles.btnCancelText}>Hủy đơn hàng</Text>
                </TouchableOpacity>
              )}
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12, backgroundColor: '#F8F9FA' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  emptyText: { color: '#888', fontSize: 14 },
  card: { backgroundColor: '#FFF', borderRadius: 8, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: '#EEE' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  orderId: { fontSize: 14, fontWeight: 'bold', color: '#007ACC' },
  badge: { fontSize: 11, fontWeight: 'bold', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  dateText: { fontSize: 12, color: '#777', marginBottom: 8 },
  infoBox: { backgroundColor: '#FAFAFA', padding: 8, borderRadius: 6, marginBottom: 6 },
  infoText: { fontSize: 12, color: '#444', marginBottom: 2 },
  bold: { fontWeight: 'bold', color: '#222' },
  divider: { height: 1, backgroundColor: '#EEE', marginVertical: 6 },

  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemImg: {
    width: 44,
    height: 44,
    borderRadius: 6,
    backgroundColor: '#F0F0F0',
    marginRight: 10,
  },
  itemInfo: {
    flex: 1,
    paddingRight: 8,
  },
  itemName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#222',
  },
  itemSub: {
    fontSize: 11,
    color: '#777',
    marginTop: 2,
  },
  itemPrice: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#333',
  },

  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  totalPrice: { fontSize: 15, fontWeight: 'bold', color: '#D32F2F' },

  btnCancel: {
    marginTop: 10,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#D32F2F',
    backgroundColor: '#FFF5F5',
    alignItems: 'center',
  },
  btnCancelText: {
    color: '#D32F2F',
    fontSize: 13,
    fontWeight: 'bold',
  },
});