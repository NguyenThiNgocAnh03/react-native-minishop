import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Category, Product, addProduct, deleteProduct, updateProduct } from '../../database/db';

const FALLBACK_IMAGE = 'https://picsum.photos/200';

interface Props {
  products: Product[];
  categories: Category[];
  targetCatId: number | null;
  onRefresh: () => void;
  onViewDetail: (prod: Product) => void;
}

export default function AdminProdTab({
  products,
  categories,
  targetCatId,
  onRefresh,
  onViewDetail,
}: Props) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [img, setImg] = useState('');
  const [catId, setCatId] = useState<number | null>(targetCatId || (categories[0]?.id ?? null));
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    if (targetCatId) setCatId(targetCatId);
    else if (!catId && categories.length > 0) setCatId(categories[0].id);
  }, [targetCatId, categories]);

  const handlePickImage = async () => {
    Keyboard.dismiss();
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Thông báo', 'Vui lòng cấp quyền truy cập thư viện ảnh!');
      return;
    }

    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.3,
      base64: true,
    });

    if (!res.canceled && res.assets?.[0]) {
      const asset = res.assets[0];
      if (asset.base64) {
        setImg(`data:${asset.mimeType || 'image/jpeg'};base64,${asset.base64}`);
      } else if (asset.uri) {
        setImg(asset.uri);
      }
    }
  };

  const handleSave = async () => {
    Keyboard.dismiss();
    if (!name.trim() || !price.trim() || !catId) {
      return Alert.alert('Lỗi', 'Vui lòng nhập tên, giá và chọn loại sản phẩm!');
    }

    const finalImg = img.trim() || FALLBACK_IMAGE;

    if (editId !== null) {
      await updateProduct({
        id: editId,
        name: name.trim(),
        price: parseFloat(price),
        img: finalImg,
        categoryId: catId,
      });
      setEditId(null);
    } else {
      await addProduct({
        name: name.trim(),
        price: parseFloat(price),
        img: finalImg,
        categoryId: catId,
      });
    }

    setName('');
    setPrice('');
    setImg('');
    onRefresh();
  };

  const handleDelete = (id: number) => {
    Keyboard.dismiss();
    Alert.alert('Xác nhận', 'Xóa sản phẩm này?', [
      { text: 'Hủy' },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: async () => {
          await deleteProduct(id);
          onRefresh();
        },
      },
    ]);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={{ paddingBottom: 40 }}
        ListHeaderComponent={
          <View style={styles.inputBox}>
            <TextInput
              placeholder="Tên sản phẩm..."
              value={name}
              onChangeText={setName}
              returnKeyType="next"
              style={styles.input}
            />
            <TextInput
              placeholder="Giá tiền..."
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
              returnKeyType="done"
              onSubmitEditing={Keyboard.dismiss}
              style={styles.input}
            />

            <TouchableOpacity style={styles.pickImgBtn} onPress={handlePickImage}>
              <Text style={styles.pickImgText}>
                {img ? '📷 Đã chọn ảnh (Bấm để đổi)' : '📷 Chọn ảnh từ thư viện'}
              </Text>
            </TouchableOpacity>

            {img ? (
              <Image source={{ uri: img }} style={styles.previewImg} resizeMode="cover" />
            ) : null}

            <Text style={styles.label}>Chọn loại sản phẩm:</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              style={{ marginBottom: 8 }}
            >
              {categories.map((c) => (
                <TouchableOpacity
                  key={c.id}
                  style={[styles.badge, catId === c.id && styles.badgeActive]}
                  onPress={() => {
                    Keyboard.dismiss();
                    setCatId(c.id);
                  }}
                >
                  <Text style={{ color: catId === c.id ? '#FFF' : '#333', fontSize: 12 }}>
                    {c.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity style={styles.btnGreen} onPress={handleSave}>
              <Text style={styles.btnText}>
                {editId !== null ? 'Cập nhật SP' : '+ Thêm sản phẩm'}
              </Text>
            </TouchableOpacity>
          </View>
        }
        ListEmptyComponent={<Text style={styles.empty}>Chưa có sản phẩm nào.</Text>}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <TouchableOpacity
              style={styles.info}
              onPress={() => {
                Keyboard.dismiss();
                onViewDetail(item);
              }}
            >
              <Image source={{ uri: item.img || FALLBACK_IMAGE }} style={styles.thumb} />
              <View style={{ marginLeft: 8, flex: 1 }}>
                <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.price}>{Number(item.price).toLocaleString('vi-VN')} đ</Text>
              </View>
            </TouchableOpacity>
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.btnOrange}
                onPress={() => {
                  Keyboard.dismiss();
                  setName(item.name);
                  setPrice(item.price.toString());
                  setImg(item.img || '');
                  setCatId(item.categoryId);
                  setEditId(item.id);
                }}
              >
                <Text style={styles.btnText}>Sửa</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnRed} onPress={() => handleDelete(item.id)}>
                <Text style={styles.btnText}>Xóa</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  empty: { textAlign: 'center', marginTop: 20, color: '#888' },
  inputBox: { backgroundColor: '#FFF', padding: 10, borderRadius: 8, marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#CCC', borderRadius: 6, padding: 8, marginBottom: 8 },
  pickImgBtn: {
    backgroundColor: '#E8F5E9',
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 8,
  },
  pickImgText: { color: '#2E7D32', fontWeight: 'bold', fontSize: 12 },
  previewImg: {
    width: 70,
    height: 70,
    borderRadius: 8,
    alignSelf: 'center',
    marginBottom: 8,
    backgroundColor: '#EEE',
  },
  label: { fontSize: 12, marginBottom: 4 },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: '#EEE',
    marginRight: 6,
  },
  badgeActive: { backgroundColor: '#007ACC' },
  btnGreen: { backgroundColor: '#2E7D32', paddingVertical: 8, borderRadius: 4, alignItems: 'center' },
  btnOrange: { backgroundColor: '#F57C00', paddingVertical: 6, paddingHorizontal: 8, borderRadius: 4 },
  btnRed: { backgroundColor: '#D32F2F', paddingVertical: 6, paddingHorizontal: 8, borderRadius: 4 },
  btnText: { color: '#FFF', fontSize: 11, fontWeight: 'bold' },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  info: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  thumb: { width: 44, height: 44, borderRadius: 6, backgroundColor: '#EEE' },
  name: { fontSize: 13, fontWeight: 'bold' },
  price: { color: '#E040FB', fontWeight: 'bold', fontSize: 12 },
  actions: { flexDirection: 'row', gap: 6, marginLeft: 8 },
});