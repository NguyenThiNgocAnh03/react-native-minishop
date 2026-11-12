import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import {
  fetchProducts,
  fetchCategories,
  fetchCart,
  addToCart,
  updateCartQuantity,
  checkoutOrder,
  fetchOrderHistory,
  updateUser,
  Product,
  Category,
  CartItem,
  Order,
} from '../Buoi11/database';
import CategorySelector from './CategorySelector';
import Header from '../Buoi13/Header';

const FALLBACK_IMAGE = 'https://picsum.photos/150';

export default function UserHome(props: any) {
  const { currentUser, onUserUpdated, onLogout, navigation, initialTab } = props;
  const [subTab, setSubTab] = useState<'shop' | 'cart' | 'history' | 'profile'>(initialTab || 'shop');

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCatId, setSelectedCatId] = useState<number | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  const [username, setUsername] = useState(currentUser?.username || '');
  const [password, setPassword] = useState(currentUser?.password || '');

  const loadData = async () => {
    try {
      const prods = await fetchProducts();
      const cats = await fetchCategories();
      setProducts(prods || []);
      setCategories(cats || []);

      if (currentUser && currentUser.id) {
        const c = await fetchCart(Number(currentUser.id));
        const o = await fetchOrderHistory(Number(currentUser.id));
        setCart(c || []);
        setOrders(o || []);
        setUsername(currentUser.username);
        setPassword(currentUser.password);
      } else {
        setCart([]);
        setOrders([]);
      }
    } catch (e) {
      console.log('Lỗi tải dữ liệu người dùng:', e);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [currentUser])
  );

  // Thêm vào giỏ hàng
  const handleAddToCart = async (product: Product) => {
    if (!currentUser || !currentUser.id) {
      if (Platform.OS === 'web') {
        window.alert('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!');
        navigation.navigate('Login');
      } else {
        Alert.alert('Nhắc nhở', 'Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!', [
          { text: 'Hủy' },
          { text: 'Đăng nhập ngay', onPress: () => navigation.navigate('Login') },
        ]);
      }
      return;
    }

    try {
      const uId = Number(currentUser.id);
      const pId = Number(product.id);
      const ok = await addToCart(uId, pId);

      if (ok) {
        const updated = await fetchCart(uId);
        setCart(updated || []);

        if (Platform.OS === 'web') {
          window.alert(`Đã thêm "${product.name}" vào giỏ hàng!`);
        } else {
          Alert.alert('Thành công', `Đã thêm "${product.name}" vào giỏ hàng!`);
        }
      }
    } catch (error) {
      console.log('Lỗi handleAddToCart:', error);
    }
  };

  // Checkout và Đặt hàng
  const handleCheckout = async () => {
    if (!currentUser) return;
    if (cart.length === 0) {
      if (Platform.OS === 'web') window.alert('Giỏ hàng đang trống!');
      else Alert.alert('Thông báo', 'Giỏ hàng đang trống!');
      return;
    }

    const total = cart.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0);
    const ok = await checkoutOrder(Number(currentUser.id), total, cart);

    if (ok) {
      if (Platform.OS === 'web') window.alert('Đặt hàng thành công!');
      else Alert.alert('Thành công', 'Đặt hàng thành công!');
      await loadData();
      setSubTab('history');
    }
  };

  // Cập nhật thông tin cá nhân
  const handleUpdateProfile = async () => {
    if (!currentUser) return;
    if (!username.trim() || !password.trim()) {
      if (Platform.OS === 'web') window.alert('Không được để trống tên và mật khẩu!');
      else Alert.alert('Lỗi', 'Không được để trống tên và mật khẩu!');
      return;
    }

    const updated = { ...currentUser, username: username.trim(), password: password.trim() };
    await updateUser(updated);
    if (onUserUpdated) onUserUpdated(updated);

    if (Platform.OS === 'web') window.alert('Đã cập nhật thông tin thành công!');
    else Alert.alert('Thành công', 'Đã cập nhật thông tin thành công!');
  };

  const displayedProducts = selectedCatId
    ? products.filter((p) => Number(p.categoryId) === Number(selectedCatId))
    : products;

  const totalCart = cart.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0);

  return (
    <SafeAreaView style={styles.container}>
      {/* 1. HEADER: TÁCH RIÊNG THEO YÊU CẦU ĐỀ BÀI (HIỆN USERNAME, ROLE & ĐĂNG XUẤT) */}
      <Header
        currentUser={currentUser}
        onLogout={onLogout}
        navigation={navigation}
      />

      {/* 2. THANH SUB-NAV 4 CHỨC NĂNG NGƯỜI DÙNG */}
      <View style={styles.navRow}>
        <TouchableOpacity
          style={[styles.navBtn, subTab === 'shop' && styles.navBtnActive]}
          onPress={() => setSubTab('shop')}
        >
          <Text style={[styles.navText, subTab === 'shop' && styles.navTextActive]}>Cửa hàng</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.navBtn, subTab === 'cart' && styles.navBtnActive]}
          onPress={() => setSubTab('cart')}
        >
          <Text style={[styles.navText, subTab === 'cart' && styles.navTextActive]}>
            Giỏ hàng ({cart.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.navBtn, subTab === 'history' && styles.navBtnActive]}
          onPress={() => setSubTab('history')}
        >
          <Text style={[styles.navText, subTab === 'history' && styles.navTextActive]}>Lịch sử</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.navBtn, subTab === 'profile' && styles.navBtnActive]}
          onPress={() => setSubTab('profile')}
        >
          <Text style={[styles.navText, subTab === 'profile' && styles.navTextActive]}>Tôi</Text>
        </TouchableOpacity>
      </View>

      {/* 3. MÀN HÌNH CỬA HÀNG */}
      {subTab === 'shop' && (
        <View style={{ flex: 1 }}>
          <View style={styles.filterBar}>
            <TouchableOpacity
              style={[styles.allBtn, selectedCatId === null && styles.allBtnActive]}
              onPress={() => setSelectedCatId(null)}
            >
              <Text style={[styles.allBtnText, selectedCatId === null && styles.allBtnTextActive]}>Tất cả</Text>
            </TouchableOpacity>
            <CategorySelector categories={categories} selectedId={selectedCatId} onSelect={setSelectedCatId} />
          </View>

          <FlatList
            data={displayedProducts}
            numColumns={2}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ padding: 8 }}
            columnWrapperStyle={{ justifyContent: 'space-between' }}
            ListEmptyComponent={<Text style={styles.empty}>Chưa có sản phẩm nào.</Text>}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <TouchableOpacity onPress={() => navigation.navigate('ProductDetail', { product: item })}>
                  <Image source={{ uri: item.img || FALLBACK_IMAGE }} style={styles.cardImg} resizeMode="cover" />
                </TouchableOpacity>
                <View style={{ padding: 8 }}>
                  <Text style={styles.cardName} numberOfLines={2}>{item.name}</Text>
                  <Text style={styles.cardPrice}>{Number(item.price).toLocaleString('vi-VN')} đ</Text>
                  <TouchableOpacity style={styles.buyBtn} onPress={() => handleAddToCart(item)}>
                    <Text style={styles.buyBtnText}>+ Thêm vào giỏ</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        </View>
      )}

      {/* 4. MÀN HÌNH GIỎ HÀNG */}
      {subTab === 'cart' && (
        <View style={{ flex: 1, padding: 12 }}>
          {cart.length === 0 ? (
            <View style={styles.centerBox}>
              <Text style={styles.empty}>🛒 Giỏ hàng của bạn đang trống!</Text>
              {!currentUser ? (
                <TouchableOpacity style={[styles.checkoutBtn, { marginTop: 14 }]} onPress={() => navigation.navigate('Login')}>
                  <Text style={styles.checkoutBtnText}>Đăng nhập để xem giỏ hàng</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={[styles.checkoutBtn, { marginTop: 14 }]} onPress={() => setSubTab('shop')}>
                  <Text style={styles.checkoutBtnText}>Mua sắm ngay</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <View style={{ flex: 1 }}>
              <FlatList
                data={cart}
                keyExtractor={(item) => (item.id ? item.id.toString() : Math.random().toString())}
                contentContainerStyle={{ paddingBottom: 16 }}
                renderItem={({ item }) => (
                  <View style={styles.cartCard}>
                    <Image source={{ uri: item.img || FALLBACK_IMAGE }} style={styles.cartItemImg} resizeMode="cover" />
                    <View style={styles.cartItemInfo}>
                      <Text style={styles.cartItemName} numberOfLines={2}>{item.name}</Text>
                      <Text style={styles.cartItemPrice}>{Number(item.price).toLocaleString('vi-VN')} đ</Text>
                    </View>
                    <View style={styles.qtyControlBox}>
                      <TouchableOpacity
                        style={styles.qtyBtn}
                        onPress={async () => {
                          await updateCartQuantity(item.id, Number(item.quantity) - 1);
                          loadData();
                        }}
                      >
                        <Text style={styles.qtyBtnText}>-</Text>
                      </TouchableOpacity>
                      <Text style={styles.qtyNumberText}>{item.quantity}</Text>
                      <TouchableOpacity
                        style={styles.qtyBtn}
                        onPress={async () => {
                          await updateCartQuantity(item.id, Number(item.quantity) + 1);
                          loadData();
                        }}
                      >
                        <Text style={styles.qtyBtnText}>+</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              />

              <View style={styles.checkoutFooter}>
                <View>
                  <Text style={{ fontSize: 12, color: '#666' }}>Tổng thanh toán:</Text>
                  <Text style={styles.totalPriceText}>{totalCart.toLocaleString('vi-VN')} đ</Text>
                </View>
                <TouchableOpacity style={styles.checkoutBtn} onPress={handleCheckout}>
                  <Text style={styles.checkoutBtnText}>Checkout & Đặt hàng</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      )}

      {/* 5. MÀN HÌNH LỊCH SỬ ĐƠN HÀNG */}
      {subTab === 'history' && (
        <View style={{ flex: 1, padding: 12 }}>
          {orders.length === 0 ? (
            <Text style={styles.empty}>{currentUser ? 'Chưa có lịch sử đơn hàng nào.' : 'Vui lòng đăng nhập để xem lịch sử.'}</Text>
          ) : (
            <FlatList
              data={orders}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.orderCard}>
                  <Text style={{ fontWeight: 'bold' }}>Mã đơn #{item.id} - {item.createdAt}</Text>
                  <View style={{ marginVertical: 6 }}>
                    {item.items?.map((it, idx) => (
                      <Text key={idx} style={{ color: '#555', fontSize: 12 }}>
                        • {it.productName} (x{it.quantity}): {Number(it.price).toLocaleString('vi-VN')} đ
                      </Text>
                    ))}
                  </View>
                  <Text style={{ fontWeight: 'bold', color: '#D32F2F' }}>Tổng tiền: {Number(item.total).toLocaleString('vi-VN')} đ</Text>
                </View>
              )}
            />
          )}
        </View>
      )}

      {/* 6. MÀN HÌNH TÀI KHOẢN (TAB TÔI) */}
      {subTab === 'profile' && (
        <View style={{ padding: 16 }}>
          {currentUser ? (
            <>
              <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 12 }}>Cập nhật thông tin tài khoản</Text>
              <TextInput placeholder="Tên đăng nhập" value={username} onChangeText={setUsername} autoCapitalize="none" style={styles.inputBox} />
              <TextInput placeholder="Mật khẩu mới" value={password} onChangeText={setPassword} secureTextEntry style={styles.inputBox} />
              <TouchableOpacity style={styles.checkoutBtn} onPress={handleUpdateProfile}>
                <Text style={styles.checkoutBtnText}>Lưu thông tin</Text>
              </TouchableOpacity>
            </>
          ) : (
            <View style={{ alignItems: 'center', marginTop: 40 }}>
              <Text style={{ marginBottom: 12, color: '#666' }}>Vui lòng đăng nhập để quản lý tài khoản</Text>
              <TouchableOpacity style={styles.checkoutBtn} onPress={() => navigation.navigate('Login')}>
                <Text style={styles.checkoutBtnText}>Đăng nhập ngay</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  navRow: { flexDirection: 'row', backgroundColor: '#FFF', borderBottomWidth: 1, borderColor: '#EEE' },
  navBtn: { flex: 1, paddingVertical: 10, alignItems: 'center' },
  navBtnActive: { borderBottomWidth: 2, borderBottomColor: '#007ACC' },
  navText: { fontSize: 12, color: '#666' },
  navTextActive: { color: '#007ACC', fontWeight: 'bold' },
  filterBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#FFF' },
  allBtn: { paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#EEE', borderRadius: 16, marginRight: 6 },
  allBtnActive: { backgroundColor: '#007ACC' },
  allBtnText: { color: '#333', fontSize: 13 },
  allBtnTextActive: { color: '#FFF', fontWeight: 'bold' },
  card: { backgroundColor: '#FFF', width: '48%', borderRadius: 8, marginBottom: 12, overflow: 'hidden', borderWidth: 1, borderColor: '#EEE' },
  cardImg: { width: '100%', height: 130, backgroundColor: '#EEE' },
  cardName: { fontSize: 13, fontWeight: '600', color: '#222', height: 34 },
  cardPrice: { fontSize: 14, fontWeight: 'bold', color: '#E040FB', marginVertical: 4 },
  buyBtn: { backgroundColor: '#007ACC', paddingVertical: 6, borderRadius: 4, alignItems: 'center' },
  buyBtnText: { color: '#FFF', fontSize: 11, fontWeight: 'bold' },
  empty: { textAlign: 'center', marginTop: 30, color: '#888' },
  centerBox: { alignItems: 'center', marginTop: 40 },
  cartCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: 10, borderRadius: 8, marginBottom: 10, borderWidth: 1, borderColor: '#EEE' },
  cartItemImg: { width: 60, height: 60, borderRadius: 6, backgroundColor: '#EEE' },
  cartItemInfo: { flex: 1, marginLeft: 10, marginRight: 6 },
  cartItemName: { fontSize: 13, fontWeight: '600', color: '#222' },
  cartItemPrice: { fontSize: 13, fontWeight: 'bold', color: '#E040FB', marginTop: 3 },
  qtyControlBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0F0F0', borderRadius: 6, padding: 2 },
  qtyBtn: { width: 28, height: 28, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center', borderRadius: 4 },
  qtyBtnText: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  qtyNumberText: { paddingHorizontal: 8, fontSize: 13, fontWeight: 'bold', color: '#111' },
  checkoutFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFF', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#EEE', marginTop: 8 },
  totalPriceText: { fontSize: 16, fontWeight: 'bold', color: '#D32F2F', marginTop: 2 },
  checkoutBtn: { backgroundColor: '#007ACC', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 6, alignItems: 'center' },
  checkoutBtnText: { color: '#FFF', fontSize: 13, fontWeight: 'bold' },
  orderCard: { backgroundColor: '#FFF', padding: 12, borderRadius: 8, marginBottom: 8, borderWidth: 1, borderColor: '#EEE' },
  inputBox: { borderWidth: 1, borderColor: '#CCC', borderRadius: 6, padding: 10, marginBottom: 12, backgroundColor: '#FFF' },
});