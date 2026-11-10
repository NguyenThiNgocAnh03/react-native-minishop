import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { fetchUsers, fetchCategories, fetchProducts, User, Category, Product } from '../../database/db';

import AdminUserTab from './AdminUserTab';
import AdminCatTab from './AdminCatTab';
import AdminProdTab from './AdminProdTab';
import AdminOrderTab from './AdminOrderTab';

export default function AdminHome() {
  const navigation = useNavigation<any>();
  const [tab, setTab] = useState<'user' | 'category' | 'product' | 'order'>('user');
  const [users, setUsers] = useState<User[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [targetCatId, setTargetCatId] = useState<number | null>(null);

  const loadData = async () => {
    setUsers((await fetchUsers()) || []);
    setCategories((await fetchCategories()) || []);
    setProducts((await fetchProducts()) || []);
  };

  useFocusEffect(useCallback(() => { loadData(); }, []));

  return (
    <SafeAreaView style={styles.safe}>
      <Text style={styles.title}>TRANG CHỦ QUẢN TRỊ ADMIN</Text>
      <View style={styles.tabs}>
        <TouchableOpacity style={[styles.tab, tab === 'user' && styles.active]} onPress={() => setTab('user')}>
          <Text style={[styles.tabText, tab === 'user' && styles.activeText]}>Users</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, tab === 'category' && styles.active]} onPress={() => setTab('category')}>
          <Text style={[styles.tabText, tab === 'category' && styles.activeText]}>Loại SP</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, tab === 'product' && styles.active]} onPress={() => setTab('product')}>
          <Text style={[styles.tabText, tab === 'product' && styles.activeText]}>Sản phẩm</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, tab === 'order' && styles.active]} onPress={() => setTab('order')}>
          <Text style={[styles.tabText, tab === 'order' && styles.activeText]}>Đơn hàng</Text>
        </TouchableOpacity>
      </View>

      {tab === 'user' && <AdminUserTab users={users} onRefresh={loadData} />}
      {tab === 'category' && (
        <AdminCatTab
          categories={categories}
          onRefresh={loadData}
          onAddProductForCat={(catId) => { setTargetCatId(catId); setTab('product'); }}
        />
      )}
      {tab === 'product' && (
        <AdminProdTab
          products={products}
          categories={categories}
          targetCatId={targetCatId}
          onRefresh={loadData}
          onViewDetail={(prod) => navigation.navigate('ProductDetail', { product: prod })}
        />
      )}
      {tab === 'order' && (
        <AdminOrderTab
          onViewDetail={(order) => navigation.navigate('OrderDetail', { order })}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F5F5F5', padding: 12 },
  title: { fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginVertical: 8, color: '#007ACC' },
  tabs: { flexDirection: 'row', marginBottom: 12 },
  tab: { flex: 1, paddingVertical: 8, alignItems: 'center', backgroundColor: '#DDD', marginHorizontal: 2, borderRadius: 6 },
  active: { backgroundColor: '#007ACC' },
  tabText: { fontSize: 12, color: '#333' },
  activeText: { color: '#FFF', fontWeight: 'bold' },
});