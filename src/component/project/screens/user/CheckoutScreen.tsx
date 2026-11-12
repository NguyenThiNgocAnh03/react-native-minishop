import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import { checkoutOrder, CartItem, User } from '../../database/db';

export default function CheckoutScreen({ route, navigation }: any) {
  const { cart, total, currentUser, onOrderSuccess } = route.params as {
    cart: CartItem[];
    total: number;
    currentUser: User;
    onOrderSuccess?: () => void;
  };

  const [customerName, setCustomerName] = useState(currentUser?.username || '');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const handleConfirmOrder = async () => {
    if (!customerName.trim() || !phone.trim() || !address.trim()) {
      const msg = 'Vui lòng điền đầy đủ họ tên, số điện thoại và địa chỉ nhận hàng!';
      if (Platform.OS === 'web') window.alert(msg);
      else Alert.alert('Thông báo', msg);
      return;
    }

    const success = await checkoutOrder(Number(currentUser.id), total, cart, {
      customerName: customerName.trim(),
      phone: phone.trim(),
      address: address.trim(),
    });

    if (success) {
      const msg = 'Đặt hàng thành công! Đơn hàng đang chờ quản trị viên xét duyệt.';
      if (Platform.OS === 'web') window.alert(msg);
      else Alert.alert('Thành công', msg);

      if (onOrderSuccess) onOrderSuccess();
      navigation.goBack();
    } else {
      if (Platform.OS === 'web') window.alert('Lỗi đặt hàng, vui lòng thử lại!');
      else Alert.alert('Lỗi', 'Không thể hoàn tất đơn hàng!');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <Text style={styles.title}>THÔNG TIN GIAO HÀNG</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Tên người nhận:</Text>
        <TextInput
          style={styles.input}
          value={customerName}
          onChangeText={setCustomerName}
          placeholder="Nhập tên người nhận..."
        />

        <Text style={styles.label}>Số điện thoại:</Text>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          placeholder="Ví dụ: 0799169436"
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Địa chỉ giao hàng:</Text>
        <TextInput
          style={[styles.input, { height: 70, textAlignVertical: 'top' }]}
          value={address}
          onChangeText={setAddress}
          placeholder="Số nhà, tên đường, phường/xã, quận/huyện..."
          multiline
        />
      </View>

      <View style={styles.summaryCard}>
        <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 10 }}>
          Tóm tắt đơn hàng
        </Text>

        {cart.map((item, idx) => (
          <View key={idx} style={styles.itemRow}>
            <Image
              source={{ uri: item.img || 'https://picsum.photos/100' }}
              style={styles.itemImg}
              resizeMode="cover"
            />

            <View style={styles.itemInfo}>
              <Text style={styles.itemName} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={styles.itemSub}>
                {Number(item.price).toLocaleString('vi-VN')} đ × {item.quantity}
              </Text>
            </View>

            <Text style={styles.itemPrice}>
              {(Number(item.price) * Number(item.quantity)).toLocaleString('vi-VN')} đ
            </Text>
          </View>
        ))}

        <View style={styles.divider} />

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontSize: 14, fontWeight: 'bold' }}>Tổng thanh toán:</Text>
          <Text style={styles.totalPrice}>{total.toLocaleString('vi-VN')} đ</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.btnConfirm} onPress={handleConfirmOrder}>
        <Text style={styles.btnText}>XÁC NHẬN ĐẶT HÀNG</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  title: { fontSize: 18, fontWeight: 'bold', color: '#007ACC', textAlign: 'center', marginBottom: 16 },
  card: { backgroundColor: '#FFF', padding: 14, borderRadius: 8, borderWidth: 1, borderColor: '#EEE', marginBottom: 14 },
  label: { fontSize: 13, fontWeight: '600', color: '#333', marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#DDD', borderRadius: 6, padding: 10, marginBottom: 12, fontSize: 14, backgroundColor: '#FAFAFA' },
  summaryCard: { backgroundColor: '#FFF', padding: 14, borderRadius: 8, borderWidth: 1, borderColor: '#EEE', marginBottom: 18 },

  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  itemImg: {
    width: 46,
    height: 46,
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
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  itemPrice: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#333',
  },

  divider: { height: 1, backgroundColor: '#EEE', marginVertical: 8 },
  totalPrice: { fontSize: 16, fontWeight: 'bold', color: '#D32F2F' },
  btnConfirm: { backgroundColor: '#2E7D32', paddingVertical: 14, borderRadius: 8, alignItems: 'center' },
  btnText: { color: '#FFF', fontSize: 15, fontWeight: 'bold' },
});