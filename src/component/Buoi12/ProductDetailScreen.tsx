import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { fetchCategories } from '../Buoi11/database';
import CategorySelector from './CategorySelector';

export default function ProductDetailScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { product } = route.params;

  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    fetchCategories().then(setCategories);
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image 
        source={{ uri: product.img || 'https://picsum.photos/150' }} 
        style={styles.image} 
      />
      <Text style={styles.name}>{product.name}</Text>
      <Text style={styles.price}>{Number(product.price).toLocaleString('vi-VN')} đ</Text>

      <Text style={styles.label}>Xem danh mục liên quan:</Text>
      <CategorySelector
        categories={categories}
        selectedId={product.categoryId}
        onSelect={(catId: number) => {
          navigation.navigate('ProductsByCategory', { categoryId: catId });
        }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#fff', flexGrow: 1 },
  image: { width: '100%', height: 250, resizeMode: 'cover', borderRadius: 8 },
  name: { fontSize: 20, fontWeight: 'bold', marginVertical: 8 },
  price: { fontSize: 18, color: '#e53935', fontWeight: 'bold' },
  label: { marginTop: 20, fontSize: 16, fontWeight: 'bold' },
});