import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Product } from "../database/db";

interface Props {
  product: Product;
  onPressDetail: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export default function ProductCard({ product, onPressDetail, onAddToCart }: Props) {
  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() => onPressDetail(product)}
    >
      <Image
        source={{ uri: product.img || "https://picsum.photos/200" }}
        style={styles.productImg}
        resizeMode="cover"
      />
      <View style={styles.cardContent}>
        <Text style={styles.productName} numberOfLines={1}>
          {product.name}
        </Text>
        <Text style={styles.productPrice}>
          {Number(product.price).toLocaleString("vi-VN")} đ
        </Text>
        <TouchableOpacity
          style={styles.btnAddToCart}
          onPress={() => onAddToCart(product)}
        >
          <Text style={styles.btnAddToCartText}>+ Thêm vào giỏ</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "48%",
    backgroundColor: "#FFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#EAEAEA",
    marginBottom: 10,
    overflow: "hidden",
  },
  productImg: { width: "100%", height: 130, backgroundColor: "#F0F0F0" },
  cardContent: { padding: 8 },
  productName: { fontSize: 13, fontWeight: "bold", color: "#222", marginBottom: 4 },
  productPrice: { fontSize: 13, color: "#D32F2F", fontWeight: "bold", marginBottom: 8 },
  btnAddToCart: {
    backgroundColor: "#007ACC",
    paddingVertical: 6,
    borderRadius: 4,
    alignItems: "center",
  },
  btnAddToCartText: { color: "#FFF", fontSize: 11, fontWeight: "bold" },
});