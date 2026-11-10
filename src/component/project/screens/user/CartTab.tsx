import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { CartItem, User } from '../../database/db';

const FALLBACK_IMAGE = 'https://picsum.photos/150';

export interface CartTabProps {
  cart: CartItem[];
  currentUser: User | null;
  onUpdateQuantity: (id: number, qty: number) => void;
  onCheckout: () => void;
  onGoToShop: () => void;
  onGoToLogin: () => void;
}

export default function CartTab({
  cart,
  currentUser,
  onUpdateQuantity,
  onCheckout,
  onGoToShop,
  onGoToLogin,
}: CartTabProps) {
  const total = cart.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0);

  if (cart.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={{ color: '#888', fontSize: 15 }}>🛒 Giỏ hàng của bạn đang trống!</Text>
        {!currentUser ? (
          <TouchableOpacity style={styles.btn} onPress={onGoToLogin}>
            <Text style={styles.btnText}>Đăng nhập để xem giỏ hàng</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.btn} onPress={onGoToShop}>
            <Text style={styles.btnText}>Mua sắm ngay</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 12 }}>
      <FlatList
        data={cart}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Image source={{ uri: item.img || FALLBACK_IMAGE }} style={styles.img} resizeMode="cover" />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
              <Text style={styles.price}>{Number(item.price).toLocaleString('vi-VN')} đ</Text>
            </View>
            <View style={styles.qtyBox}>
              <TouchableOpacity style={styles.qtyBtn} onPress={() => onUpdateQuantity(item.id, Number(item.quantity) - 1)}>
                <Text style={styles.qtyBtnText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.qtyNum}>{item.quantity}</Text>
              <TouchableOpacity style={styles.qtyBtn} onPress={() => onUpdateQuantity(item.id, Number(item.quantity) + 1)}>
                <Text style={styles.qtyBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      <View style={styles.footer}>
        <View>
          <Text style={{ fontSize: 12, color: '#666' }}>Tổng cộng:</Text>
          <Text style={styles.total}>{total.toLocaleString('vi-VN')} đ</Text>
        </View>
        <TouchableOpacity style={styles.btnCheckout} onPress={onCheckout}>
          <Text style={styles.btnText}>Checkout & Đặt hàng</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: 'center', marginTop: 50 },
  btn: { backgroundColor: '#007ACC', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 6, marginTop: 14 },
  btnText: { color: '#FFF', fontWeight: 'bold' },
  row: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: 10, borderRadius: 8, marginBottom: 8, borderWidth: 1, borderColor: '#EEE' },
  img: { width: 55, height: 55, borderRadius: 6, backgroundColor: '#EEE' },
  name: { fontSize: 13, fontWeight: '600' },
  price: { fontSize: 13, fontWeight: 'bold', color: '#E040FB', marginTop: 2 },
  qtyBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0F0F0', borderRadius: 4, padding: 2 },
  qtyBtn: { width: 26, height: 26, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center', borderRadius: 4 },
  qtyBtnText: { fontSize: 15, fontWeight: 'bold' },
  qtyNum: { paddingHorizontal: 8, fontSize: 13, fontWeight: 'bold' },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFF', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#EEE', marginTop: 8 },
  total: { fontSize: 16, fontWeight: 'bold', color: '#D32F2F' },
  btnCheckout: { backgroundColor: '#007ACC', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 6 },
});