import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, SafeAreaView, StatusBar, TouchableOpacity } from 'react-native';
import { initDatabase, fetchCategories, fetchProducts, Category, Product, User } from './database';

const ProductSqlite = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    initDatabase(() => {
      loadData();
    });
  }, []);

  const loadData = async () => {
    const cats = await fetchCategories();
    const prods = await fetchProducts();
    // const usrs = await fetchUsers();

    setCategories(cats || []);
    setProducts(prods || []);
    // setUsers(usrs || []);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.title}>DỮ LIỆU TRONG DATABASE</Text>
        <TouchableOpacity style={styles.reloadBtn} onPress={loadData}>
          <Text style={styles.reloadText}>Làm mới</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* BẢNG 1: CATEGORIES */}
        <View style={styles.tableBox}>
          <Text style={styles.tableTitle}>📁 Bảng Categories ({categories.length} dòng)</Text>
          <Text style={styles.rawJson}>{JSON.stringify(categories, null, 2)}</Text>
        </View>

        {/* BẢNG 2: PRODUCTS */}
        <View style={styles.tableBox}>
          <Text style={styles.tableTitle}>📦 Bảng Products ({products.length} dòng)</Text>
          <Text style={styles.rawJson}>{JSON.stringify(products, null, 2)}</Text>
        </View>

        {/* BẢNG 3: USERS */}
        <View style={styles.tableBox}>
          <Text style={styles.tableTitle}>👤 Bảng Users ({users.length} dòng)</Text>
          <Text style={styles.rawJson}>{JSON.stringify(users, null, 2)}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProductSqlite;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
    paddingTop: 35,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  title: {
    color: '#4EC9B0',
    fontSize: 16,
    fontWeight: 'bold',
  },
  reloadBtn: {
    backgroundColor: '#007ACC',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
  },
  reloadText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  tableBox: {
    backgroundColor: '#252526',
    borderRadius: 6,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#3C3C3C',
  },
  tableTitle: {
    color: '#CE9178',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  rawJson: {
    color: '#D4D4D4',
    fontFamily: 'monospace',
    fontSize: 12,
    lineHeight: 18,
  },
});
// import { StyleSheet, Text, View } from 'react-native'
// import React, {useEffect,useState} from 'react'
// import {initDatabase,fetchProducts,fetchCategories} from './database'

// const ProductSqlite = () => {
// const [categories, setCategories] = useState<any[]>([]);
// const [products, setProducts] = useState<any[]>([]);

//   useEffect(() => {
//     initDatabase(() => {
//       loadData();
//     });
//   }, []);
//   const loadData = async () => {
//     const cats= await fetchCategories();
//     const props= await fetchProducts();
//     setCategories(cats);
//     setProducts(props.reverse()); // Đảo ngược danh sách sản phẩm để hiển thị sản phẩm mới nhất lên đầu
//   };
//   return (

//     <View>
//       <Text>ProductSqlite</Text>
//     </View>
//   )
// }

// export default ProductSqlite

// const styles = StyleSheet.create({})