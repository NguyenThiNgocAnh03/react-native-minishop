import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Category, addCategory, updateCategory, deleteCategory } from '../../database/db';

interface Props {
  categories: Category[];
  onRefresh: () => void;
  onAddProductForCat: (catId: number) => void;
}

export default function AdminCatTab({ categories, onRefresh, onAddProductForCat }: Props) {
  const [catName, setCatName] = useState('');
  const [editId, setEditId] = useState<number | null>(null);

  const handleSave = async () => {
    if (!catName.trim()) return Alert.alert('Lỗi', 'Vui lòng nhập tên loại sản phẩm!');
    if (editId !== null) {
      await updateCategory(editId, catName.trim());
      setEditId(null);
    } else {
      await addCategory(catName.trim());
    }
    setCatName('');
    onRefresh();
  };

  const handleDelete = (id: number) => {
    Alert.alert('Xác nhận', 'Xóa loại sản phẩm này?', [
      { text: 'Hủy' },
      { text: 'Xóa', style: 'destructive', onPress: async () => { await deleteCategory(id); onRefresh(); } },
    ]);
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.inputBox}>
        <TextInput placeholder="Tên loại sản phẩm..." value={catName} onChangeText={setCatName} style={styles.input} />
        <TouchableOpacity style={styles.btnGreen} onPress={handleSave}>
          <Text style={styles.btnText}>{editId !== null ? 'Cập nhật loại' : '+ Thêm loại mới'}</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={categories}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<Text style={styles.empty}>Chưa có danh mục nào.</Text>}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.catName}>{item.name}</Text>
            <View style={styles.actions}>
              <TouchableOpacity style={styles.btnCyan} onPress={() => onAddProductForCat(item.id)}>
                <Text style={styles.btnText}>+ Thêm SP</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnOrange} onPress={() => { setCatName(item.name); setEditId(item.id); }}>
                <Text style={styles.btnText}>Sửa</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnRed} onPress={() => handleDelete(item.id)}>
                <Text style={styles.btnText}>Xóa</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  empty: { textAlign: 'center', marginTop: 20, color: '#888' },
  inputBox: { backgroundColor: '#FFF', padding: 10, borderRadius: 8, marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#CCC', borderRadius: 6, padding: 8, marginBottom: 8 },
  btnGreen: { backgroundColor: '#2E7D32', paddingVertical: 8, borderRadius: 4, alignItems: 'center' },
  btnCyan: { backgroundColor: '#0288D1', paddingVertical: 6, paddingHorizontal: 8, borderRadius: 4 },
  btnOrange: { backgroundColor: '#F57C00', paddingVertical: 6, paddingHorizontal: 8, borderRadius: 4 },
  btnRed: { backgroundColor: '#D32F2F', paddingVertical: 6, paddingHorizontal: 8, borderRadius: 4 },
  btnText: { color: '#FFF', fontSize: 11, fontWeight: 'bold' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFF', padding: 10, borderRadius: 8, marginBottom: 8 },
  catName: { fontSize: 14, fontWeight: 'bold' },
  actions: { flexDirection: 'row', gap: 6 },
});