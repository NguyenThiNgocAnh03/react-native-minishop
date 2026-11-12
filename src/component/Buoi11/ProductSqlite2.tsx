import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import {
  initDatabase,
  fetchProducts,
  fetchCategories,
  addProduct,
  updateProduct,
  deleteProduct,
  Product,
  Category,
} from './database';

import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';

const FALLBACK_IMAGE = 'https://picsum.photos/150';

interface Props {
  onBack?: () => void;
}

const ProductSqlite2: React.FC<Props> = ({ onBack }) => {
  const navigation = useNavigation<any>();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [idEditing, setIdEditing] = useState<number | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [img, setImg] = useState('');
  const [categoryId, setCategoryId] = useState('1');

  useEffect(() => {
    const start = async () => {
      try {
        await initDatabase();
        await loadData();
      } catch (error) {
        console.log('Lỗi khởi tạo database:', error);
        Alert.alert('Lỗi', 'Không thể mở database.');
      }
    };

    start();
  }, []);

  const loadData = async () => {
    try {
      const [prods, cats] = await Promise.all([
        fetchProducts(),
        fetchCategories(),
      ]);
      setProducts(prods || []);
      setCategories(cats || []);

      if (cats && cats.length > 0 && !categoryId) {
        setCategoryId(String(cats[0].id));
      }
    } catch (error) {
      console.log('Lỗi tải dữ liệu:', error);
    }
  };

  const clearForm = () => {
    setIdEditing(null);
    setName('');
    setPrice('');
    setImg('');
    if (categories.length > 0) {
      setCategoryId(String(categories[0].id));
    }
  };

  const validateForm = () => {
    if (name.trim() === '') {
      Alert.alert('Thông báo', 'Vui lòng nhập tên sản phẩm.');
      return false;
    }

    if (price.trim() === '') {
      Alert.alert('Thông báo', 'Vui lòng nhập giá sản phẩm.');
      return false;
    }

    if (!Number.isFinite(Number(price)) || Number(price) <= 0) {
      Alert.alert('Thông báo', 'Giá sản phẩm phải lớn hơn 0.');
      return false;
    }

    return true;
  };

  const handleAdd = async () => {
    if (!validateForm()) return;

    try {
      await addProduct({
        name: name.trim(),
        price: Number(price),
        img: img.trim() || FALLBACK_IMAGE,
        categoryId: Number(categoryId) || 1,
      });

      await loadData();
      clearForm();
      Keyboard.dismiss();
      Alert.alert('Thành công', 'Đã thêm sản phẩm.');
    } catch (error) {
      console.log('Lỗi thêm sản phẩm:', error);
      Alert.alert('Lỗi', 'Không thể thêm sản phẩm.');
    }
  };

  const handleSelectEdit = (item: Product) => {
    setIdEditing(item.id);
    setName(item.name);
    setPrice(String(item.price));
    setImg(item.img || '');
    setCategoryId(String(item.categoryId));
  };

  const handleUpdate = async () => {
    if (idEditing === null) return;
    if (!validateForm()) return;

    try {
      await updateProduct({
        id: idEditing,
        name: name.trim(),
        price: Number(price),
        img: img.trim() || FALLBACK_IMAGE,
        categoryId: Number(categoryId) || 1,
      });

      await loadData();
      clearForm();
      Keyboard.dismiss();
      Alert.alert('Thành công', 'Đã cập nhật sản phẩm.');
    } catch (error) {
      console.log('Lỗi cập nhật sản phẩm:', error);
      Alert.alert('Lỗi', 'Không thể cập nhật sản phẩm.');
    }
  };

  const handleDelete = (id: number) => {
    Alert.alert('Xác nhận', 'Bạn có chắc chắn muốn xóa sản phẩm này không?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteProduct(id);
            await loadData();
            if (idEditing === id) clearForm();
            Alert.alert('Thành công', 'Đã xóa sản phẩm.');
          } catch (error) {
            console.log('Lỗi xóa sản phẩm:', error);
            Alert.alert('Lỗi', 'Không thể xóa sản phẩm.');
          }
        },
      },
    ]);
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImg(result.assets[0].uri);
        Alert.alert('Thành công', 'Đã chọn ảnh.');
      }
    } catch (error) {
      console.log('Lỗi chọn ảnh:', error);
      Alert.alert('Lỗi', 'Không thể chọn ảnh từ thư viện.');
    }
  };

  const getCategoryName = (catId: number) => {
    const found = categories.find((c) => c.id === catId);
    return found ? found.name : `#${catId}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1 }}>
            {onBack && (
              <TouchableOpacity style={styles.btnBackTop} onPress={onBack}>
                <Text style={styles.btnBackText}>⬅ Quay lại Trang chủ quản trị</Text>
              </TouchableOpacity>
            )}

            <Text style={styles.headerTitle}>QUẢN LÝ SẢN PHẨM (SQLITE)</Text>

            {/* FORM NHẬP SẢN PHẨM */}
            <View style={styles.form}>
              <TextInput
                style={styles.input}
                placeholder="Tên sản phẩm"
                value={name}
                onChangeText={setName}
              />

              <TextInput
                style={styles.input}
                placeholder="Giá (VNĐ)"
                keyboardType="numeric"
                value={price}
                onChangeText={setPrice}
              />

              <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
                <Text style={styles.imageButtonText}>📷 Chọn ảnh từ thư viện</Text>
              </TouchableOpacity>

              {img !== '' && (
                <Image
                  source={{ uri: img }}
                  style={styles.previewImage}
                  resizeMode="cover"
                />
              )}

              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={categoryId}
                  onValueChange={(val) => setCategoryId(String(val))}
                >
                  {categories.map((cat) => (
                    <Picker.Item key={cat.id} label={cat.name} value={String(cat.id)} />
                  ))}
                </Picker>
              </View>

              {idEditing === null ? (
                <TouchableOpacity style={styles.btnSave} onPress={handleAdd}>
                  <Text style={styles.btnText}>+ Thêm sản phẩm</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.rowButtons}>
                  <TouchableOpacity style={styles.btnUpdate} onPress={handleUpdate}>
                    <Text style={styles.btnText}>Lưu cập nhật</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.btnCancel} onPress={clearForm}>
                    <Text style={styles.btnText}>Hủy sửa</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <Text style={styles.listTitle}>
              Danh sách sản phẩm ({products.length})
            </Text>

            {/* DANH SÁCH SẢN PHẨM */}
            <FlatList
              data={products}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.listContent}
              keyboardShouldPersistTaps="handled"
              ListEmptyComponent={
                <Text style={styles.emptyText}>
                  Chưa có sản phẩm. Hãy thêm sản phẩm mới nhé!
                </Text>
              }
              renderItem={({ item }) => (
                <View style={styles.itemBox}>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('ProductDetail', { product: item })
                    }
                  >
                    <Image
                      source={{ uri: item.img || FALLBACK_IMAGE }}
                      style={styles.productImage}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>

                  <View style={styles.itemDetails}>
                    <Text style={styles.itemName} numberOfLines={2}>
                      {item.name}
                    </Text>
                    <Text style={styles.itemPrice}>
                      {Number(item.price).toLocaleString('vi-VN')} đ
                    </Text>
                    <Text style={styles.itemMeta}>
                      Danh mục: {getCategoryName(item.categoryId)}
                    </Text>
                  </View>

                  <View style={styles.itemActions}>
                    <TouchableOpacity
                      style={styles.btnEdit}
                      onPress={() => handleSelectEdit(item)}
                    >
                      <Text style={styles.btnActionText}>Sửa</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.btnDelete}
                      onPress={() => handleDelete(item.id)}
                    >
                      <Text style={styles.btnActionText}>Xóa</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            />
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ProductSqlite2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F6F8',
  },
  btnBackTop: {
    marginBottom: 8,
    paddingVertical: 4,
  },
  btnBackText: {
    color: '#007ACC',
    fontWeight: 'bold',
    fontSize: 14,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
    color: '#222',
  },
  form: {
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 8,
    backgroundColor: '#FAFAFA',
    fontSize: 14,
    color: '#222',
  },
  rowButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  btnSave: {
    backgroundColor: '#007ACC',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  btnUpdate: {
    flex: 1,
    backgroundColor: '#28A745',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  btnCancel: {
    flex: 1,
    backgroundColor: '#6C757D',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  btnText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  listContent: {
    paddingBottom: 30,
  },
  emptyText: {
    textAlign: 'center',
    color: '#777',
    marginTop: 20,
  },
  itemBox: {
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  productImage: {
    width: 65,
    height: 65,
    borderRadius: 6,
    backgroundColor: '#EEE',
    marginRight: 10,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#E040FB',
    marginTop: 3,
  },
  itemMeta: {
    fontSize: 12,
    color: '#777',
    marginTop: 3,
  },
  itemActions: {
    gap: 6,
    marginLeft: 8,
  },
  btnEdit: {
    backgroundColor: '#FFC107',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  btnDelete: {
    backgroundColor: '#DC3545',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  btnActionText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 6,
    marginBottom: 8,
    backgroundColor: '#FAFAFA',
    overflow: 'hidden',
  },
  imageButton: {
    backgroundColor: '#E8F5E9',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#A5D6A7',
  },
  imageButtonText: {
    color: '#2E7D32',
    fontWeight: 'bold',
  },
  previewImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
    alignSelf: 'center',
    marginBottom: 10,
    backgroundColor: '#EEE',
  },
});