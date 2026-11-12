import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  TextInput,
  Alert,
  ScrollView,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';

import {
  fetchUsers,
  updateUser,
  deleteUser,
  User,
  fetchCategories,
  addCategory,
  updateCategory,
  deleteCategory,
  Category,
  fetchProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  Product,
} from '../Buoi11/database';

const FALLBACK_IMAGE = 'https://picsum.photos/150';

export default function AdminHome() {
  const navigation = useNavigation<any>();

  const [tab, setTab] = useState<'user' | 'category' | 'product'>('user');

  const [users, setUsers] = useState<User[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  // State Quản lý Loại SP
  const [catName, setCatName] = useState('');
  const [editCatId, setEditCatId] = useState<number | null>(null);

  // State Quản lý Sản phẩm
  const [prodName, setProdName] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodImg, setProdImg] = useState('');
  const [prodCatId, setProdCatId] = useState<number | null>(null);
  const [editProdId, setEditProdId] = useState<number | null>(null);

  const loadData = async () => {
    try {
      const listU = await fetchUsers();
      const listC = await fetchCategories();
      const listP = await fetchProducts();
      setUsers(listU || []);
      setCategories(listC || []);
      setProducts(listP || []);
    } catch (e) {
      console.log('Lỗi tải dữ liệu admin:', e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Hàm mở thư viện ảnh từ thiết bị
  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setProdImg(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể mở thư viện ảnh');
    }
  };

  // 1. Quản lý Người dùng
  const handleToggleRole = async (item: User) => {
    const newRole = item.role === 'admin' ? 'user' : 'admin';
    await updateUser({ ...item, role: newRole });
    loadData();
  };

  const handleDeleteUser = async (id: number) => {
    Alert.alert('Xác nhận', 'Bạn có chắc muốn xóa tài khoản này không?', [
      { text: 'Hủy' },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: async () => {
          await deleteUser(id);
          loadData();
        },
      },
    ]);
  };

  // 2. Quản lý Loại sản phẩm
  const handleSaveCategory = async () => {
    if (!catName.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên loại sản phẩm');
      return;
    }
    if (editCatId !== null) {
      await updateCategory(editCatId, catName.trim());
      setEditCatId(null);
    } else {
      await addCategory(catName.trim());
    }
    setCatName('');
    loadData();
  };

  const handleDeleteCategory = async (id: number) => {
    Alert.alert('Xác nhận', 'Xóa loại sản phẩm này?', [
      { text: 'Hủy' },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: async () => {
          await deleteCategory(id);
          loadData();
        },
      },
    ]);
  };

  const handleAddProductForCat = (categoryId: number) => {
    setProdCatId(categoryId);
    setTab('product');
  };

  // 3. Quản lý Sản phẩm
  const handleSaveProduct = async () => {
    if (!prodName.trim() || !prodPrice.trim() || prodCatId === null) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên, giá và chọn loại sản phẩm');
      return;
    }
    const finalImg = prodImg.trim() || FALLBACK_IMAGE;

    if (editProdId !== null) {
      await updateProduct({
        id: editProdId,
        name: prodName.trim(),
        price: parseFloat(prodPrice),
        img: finalImg,
        categoryId: prodCatId,
      });
      setEditProdId(null);
    } else {
      await addProduct({
        name: prodName.trim(),
        price: parseFloat(prodPrice),
        img: finalImg,
        categoryId: prodCatId,
      });
    }

    setProdName('');
    setProdPrice('');
    setProdImg('');
    loadData();
  };

  const handleDeleteProduct = async (id: number) => {
    Alert.alert('Xác nhận', 'Bạn muốn xóa sản phẩm này?', [
      { text: 'Hủy' },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: async () => {
          await deleteProduct(id);
          loadData();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <Text style={styles.mainTitle}>TRANG QUẢN TRỊ ADMIN</Text>

      {/* 3 nút chuyển tab quản lý */}
      <View style={styles.topTabs}>
        <TouchableOpacity 
          style={[styles.topTabBtn, tab === 'user' && styles.topTabActive]} 
          onPress={() => setTab('user')}
        >
          <Text style={[styles.topTabText, tab === 'user' && styles.topTabTextActive]}>Quản lý User</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.topTabBtn, tab === 'category' && styles.topTabActive]} 
          onPress={() => setTab('category')}
        >
          <Text style={[styles.topTabText, tab === 'category' && styles.topTabTextActive]}>Quản lý Loại SP</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.topTabBtn, tab === 'product' && styles.topTabActive]} 
          onPress={() => setTab('product')}
        >
          <Text style={[styles.topTabText, tab === 'product' && styles.topTabTextActive]}>Quản lý SP</Text>
        </TouchableOpacity>
      </View>

      {/* VIEW USER */}
      {tab === 'user' && (
        <View style={{ flex: 1 }}>
          <FlatList
            data={users}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.itemRow}>
                <View>
                  <Text style={styles.nameBold}>{item.username}</Text>
                  <Text>
                    Vai trò: <Text style={{ color: item.role === 'admin' ? '#d32f2f' : '#2e7d32', fontWeight: 'bold' }}>{item.role}</Text>
                  </Text>
                </View>
                <View style={styles.actionBtns}>
                  <TouchableOpacity style={styles.btnBlue} onPress={() => handleToggleRole(item)}>
                    <Text style={styles.btnText}>Đổi vai trò</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.btnRed} onPress={() => handleDeleteUser(item.id)}>
                    <Text style={styles.btnText}>Xóa</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        </View>
      )}

      {/* VIEW LOẠI SP */}
      {tab === 'category' && (
        <View style={{ flex: 1 }}>
          <View style={styles.inputBox}>
            <TextInput
              placeholder="Tên loại sản phẩm..."
              value={catName}
              onChangeText={setCatName}
              style={styles.input}
            />
            <TouchableOpacity style={styles.btnGreen} onPress={handleSaveCategory}>
              <Text style={styles.btnText}>{editCatId !== null ? 'Cập nhật loại' : '+ Thêm loại mới'}</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={categories}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.itemRow}>
                <Text style={styles.nameBold}>{item.name}</Text>
                <View style={styles.actionBtns}>
                  <TouchableOpacity style={styles.btnCyan} onPress={() => handleAddProductForCat(item.id)}>
                    <Text style={styles.btnText}>+ Thêm SP</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.btnOrange} 
                    onPress={() => {
                      setCatName(item.name);
                      setEditCatId(item.id);
                    }}
                  >
                    <Text style={styles.btnText}>Sửa</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.btnRed} onPress={() => handleDeleteCategory(item.id)}>
                    <Text style={styles.btnText}>Xóa</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        </View>
      )}

      {/* VIEW SẢN PHẨM: TẢI ẢNH TỪ THIẾT BỊ */}
      {tab === 'product' && (
        <View style={{ flex: 1 }}>
          <View style={styles.inputBox}>
            <TextInput
              placeholder="Tên sản phẩm..."
              value={prodName}
              onChangeText={setProdName}
              style={styles.input}
            />
            <TextInput
              placeholder="Giá tiền (VNĐ)..."
              value={prodPrice}
              onChangeText={setProdPrice}
              keyboardType="numeric"
              style={styles.input}
            />

            {/* Nút chọn ảnh từ thư viện máy */}
            <TouchableOpacity style={styles.pickImageBtn} onPress={handlePickImage}>
              <Text style={styles.pickImageText}>
                {prodImg ? '📷 Đổi ảnh khác từ máy' : '📷 Chọn ảnh từ thiết bị'}
              </Text>
            </TouchableOpacity>

            {/* Xem trước ảnh vừa chọn */}
            {prodImg !== '' && (
              <View style={styles.previewBox}>
                <Image source={{ uri: prodImg }} style={styles.previewImage} resizeMode="cover" />
                <TouchableOpacity onPress={() => setProdImg('')}>
                  <Text style={styles.removeImageText}>Xóa ảnh này</Text>
                </TouchableOpacity>
              </View>
            )}

            <Text style={{ fontSize: 12, marginBottom: 4, color: '#555' }}>Chọn loại cho sản phẩm:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 8 }}>
              {categories.map((c) => (
                <TouchableOpacity
                  key={c.id}
                  style={[styles.badge, prodCatId === c.id && styles.badgeActive]}
                  onPress={() => setProdCatId(c.id)}
                >
                  <Text style={{ color: prodCatId === c.id ? '#fff' : '#333', fontSize: 12 }}>{c.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity style={styles.btnGreen} onPress={handleSaveProduct}>
              <Text style={styles.btnText}>{editProdId !== null ? 'Cập nhật SP' : '+ Thêm sản phẩm'}</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={products}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.itemRow}>
                <TouchableOpacity 
                  style={styles.productInfoRow}
                  onPress={() => navigation.navigate('ProductDetail', { product: item })}
                >
                  <Image 
                    source={{ uri: item.img || FALLBACK_IMAGE }} 
                    style={styles.thumbImage} 
                    resizeMode="cover"
                  />
                  <View style={{ marginLeft: 10, flex: 1 }}>
                    <Text style={styles.nameBold} numberOfLines={1}>{item.name}</Text>
                    <Text style={{ color: '#E040FB', fontWeight: 'bold' }}>
                      {Number(item.price).toLocaleString('vi-VN')} đ
                    </Text>
                    <Text style={{ fontSize: 11, color: '#777' }}>
                      Loại: {categories.find((c) => c.id === item.categoryId)?.name || 'Chưa chọn'}
                    </Text>
                  </View>
                </TouchableOpacity>

                <View style={styles.actionBtns}>
                  <TouchableOpacity 
                    style={styles.btnOrange} 
                    onPress={() => {
                      setProdName(item.name);
                      setProdPrice(item.price.toString());
                      setProdImg(item.img || '');
                      setProdCatId(item.categoryId);
                      setEditProdId(item.id);
                    }}
                  >
                    <Text style={styles.btnText}>Sửa</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.btnRed} onPress={() => handleDeleteProduct(item.id)}>
                    <Text style={styles.btnText}>Xóa</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f5f5f5', padding: 12 },
  mainTitle: { fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginVertical: 8, color: '#007ACC' },
  topTabs: { flexDirection: 'row', marginBottom: 12 },
  topTabBtn: { flex: 1, paddingVertical: 8, alignItems: 'center', backgroundColor: '#ddd', marginHorizontal: 3, borderRadius: 6 },
  topTabActive: { backgroundColor: '#007ACC' },
  topTabText: { fontSize: 12, color: '#333', fontWeight: '500' },
  topTabTextActive: { color: '#fff', fontWeight: 'bold' },
  inputBox: { backgroundColor: '#fff', padding: 10, borderRadius: 8, marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 8, marginBottom: 8, backgroundColor: '#FAFAFA' },
  pickImageBtn: {
    backgroundColor: '#E8F5E9',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#A5D6A7',
  },
  pickImageText: { color: '#2E7D32', fontWeight: 'bold', fontSize: 13 },
  previewBox: { alignItems: 'center', marginBottom: 8 },
  previewImage: { width: 70, height: 70, borderRadius: 6, backgroundColor: '#eee', marginBottom: 4 },
  removeImageText: { color: '#d32f2f', fontSize: 11, textDecorationLine: 'underline' },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: 10, borderRadius: 8, marginBottom: 8 },
  productInfoRow: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  thumbImage: { width: 50, height: 50, borderRadius: 6, backgroundColor: '#eee' },
  nameBold: { fontSize: 14, fontWeight: 'bold', color: '#222' },
  actionBtns: { flexDirection: 'row', gap: 6, marginLeft: 8 },
  btnText: { color: '#fff', fontSize: 11, fontWeight: 'bold' },
  btnBlue: { backgroundColor: '#1976d2', paddingVertical: 6, paddingHorizontal: 8, borderRadius: 4 },
  btnGreen: { backgroundColor: '#2e7d32', paddingVertical: 8, borderRadius: 4, alignItems: 'center' },
  btnOrange: { backgroundColor: '#f57c00', paddingVertical: 6, paddingHorizontal: 8, borderRadius: 4 },
  btnRed: { backgroundColor: '#d32f2f', paddingVertical: 6, paddingHorizontal: 8, borderRadius: 4 },
  btnCyan: { backgroundColor: '#0288d1', paddingVertical: 6, paddingHorizontal: 8, borderRadius: 4 },
  badge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12, backgroundColor: '#eee', marginRight: 6 },
  badgeActive: { backgroundColor: '#007ACC' },
});