import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { fetchProductsByCategory, Product } from '../Buoi11/database';

const FALLBACK_IMAGE = 'https://picsum.photos/150';

export default function ProductsByCategoryScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { categoryId } = route.params;

  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (categoryId) {
      fetchProductsByCategory(Number(categoryId)).then(setProducts);
    }
  }, [categoryId]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>SẢN PHẨM CÙNG LOẠI</Text>

      <FlatList
        data={products}
        numColumns={2}
        keyExtractor={(item) => item.id.toString()}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<Text style={styles.emptyText}>Chưa có sản phẩm nào thuộc loại này.</Text>}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('ProductDetail', { product: item })}
          >
            <Image
              source={{ uri: item.img || FALLBACK_IMAGE }}
              style={styles.cardImage}
              resizeMode="cover"
            />
            <View style={styles.cardBody}>
              <Text style={styles.cardName} numberOfLines={2}>{item.name}</Text>
              <Text style={styles.cardPrice}>{Number(item.price).toLocaleString('vi-VN')} đ</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA', padding: 12 },
  title: { fontSize: 16, fontWeight: 'bold', color: '#007ACC', marginVertical: 8, textAlign: 'center' },
  listContent: { paddingBottom: 20 },
  columnWrapper: { justifyContent: 'space-between' },
  card: { backgroundColor: '#FFF', width: '48%', borderRadius: 8, marginBottom: 12, overflow: 'hidden', borderWidth: 1, borderColor: '#EEE' },
  cardImage: { width: '100%', height: 130, backgroundColor: '#EEE' },
  cardBody: { padding: 8 },
  cardName: { fontSize: 13, fontWeight: '600', color: '#222', height: 34 },
  cardPrice: { fontSize: 14, fontWeight: 'bold', color: '#E040FB', marginTop: 4 },
  emptyText: { textAlign: 'center', marginTop: 40, color: '#888' },
});