import React, { useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import ProductCard from "../../components/ProductCard";
import ShopBanner from "../../components/ShopBanner";
import ShopFilterBar, { PriceFilter } from "../../components/ShopFilterBar";
import { Category, Product, addToCart } from "../../database/db";

interface Props {
  products: Product[];
  categories: Category[];
  currentUser: any;
  onViewProductDetail: (product: Product) => void;
  onRefreshCart?: () => void;
  onAddToCart?: (p: Product) => void;
  onViewDetail?: (p: Product) => void;
}

const FALLBACK_CATEGORIES: Record<number, string> = {
  1: "Thời trang nữ",
  2: "Thời trang nam",
  3: "Phụ kiện nữ",
  4: "Phụ kiện nam",
};

const removeVietnameseTones = (str: string) => {
  if (!str) return "";
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "d")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
};

export default function ShopTab({
  products,
  categories,
  currentUser,
  onViewProductDetail,
  onRefreshCart,
  onViewDetail,
  onAddToCart,
}: Props) {
  const [keyword, setKeyword] = useState("");
  const [activeCatId, setActiveCatId] = useState<number | "all">("all");
  const [selectedPrice, setSelectedPrice] = useState<PriceFilter>("all");

  const handleAddToCart = async (product: Product) => {
    if (onAddToCart) {
      onAddToCart(product);
      return;
    }
    if (!currentUser) {
      const msg = "Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!";
      if (Platform.OS === "web") window.alert(msg);
      else Alert.alert("Thông báo", msg);
      return;
    }
    const ok = await addToCart(Number(currentUser.id), Number(product.id));
    if (ok) {
      if (onRefreshCart) onRefreshCart();
      const msg = `Đã thêm "${product.name}" vào giỏ hàng!`;
      if (Platform.OS === "web") window.alert(msg);
      else Alert.alert("Thành công", msg);
    }
  };

  const handlePressDetail = (product: Product) => {
    if (onViewProductDetail) onViewProductDetail(product);
    else if (onViewDetail) onViewDetail(product);
  };

  const filteredProducts = useMemo(() => {
    const cleanQuery = removeVietnameseTones(keyword);

    return (products || []).filter((p: any) => {
      const pCatId = Number(p.categoryId ?? p.category_id);
      const matchedCatObj = (categories || []).find((c) => Number(c.id) === pCatId);
      const catName = matchedCatObj
        ? matchedCatObj.name
        : FALLBACK_CATEGORIES[pCatId] || "";

      const combinedText = removeVietnameseTones(`${p.name} ${catName}`);
      const matchKeyword =
        !cleanQuery ||
        cleanQuery.split(" ").every((token) => combinedText.includes(token));

      const matchCategory =
        activeCatId === "all" || pCatId === Number(activeCatId);

      const price = Number(p.price);
      let matchPrice = true;
      if (selectedPrice === "under300") matchPrice = price < 300000;
      else if (selectedPrice === "300to1000")
        matchPrice = price >= 300000 && price <= 1000000;
      else if (selectedPrice === "above1000") matchPrice = price > 1000000;

      return matchKeyword && matchCategory && matchPrice;
    });
  }, [products, categories, keyword, activeCatId, selectedPrice]);

  return (
    <View style={styles.container}>
      {/* Thanh tìm kiếm */}
      <View style={styles.searchBox}>
        <TextInput
          style={styles.searchInput}
          placeholder="🔍 Tìm tên sản phẩm hoặc danh mục (VD: phụ kiện nam)..."
          value={keyword}
          onChangeText={setKeyword}
          autoCorrect={false}
        />
        {keyword.length > 0 && (
          <TouchableOpacity onPress={() => setKeyword("")} style={styles.clearBtn}>
            <Text style={{ color: "#888", fontWeight: "bold" }}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Danh sách sản phẩm + Banner & Bộ lọc */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.listContainer}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        ListHeaderComponent={
          <View>
            <ShopBanner />
            <ShopFilterBar
              categories={categories}
              activeCatId={activeCatId}
              onSelectCategory={setActiveCatId}
              selectedPrice={selectedPrice}
              onSelectPrice={setSelectedPrice}
            />
            <Text style={styles.resultTitle}>
              🛍️ Danh sách sản phẩm ({filteredProducts.length})
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>
              Không tìm thấy sản phẩm phù hợp bộ lọc.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPressDetail={handlePressDetail}
            onAddToCart={handleAddToCart}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA", paddingHorizontal: 10 },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    marginTop: 8,
    marginBottom: 8,
    paddingHorizontal: 10,
  },
  searchInput: { flex: 1, height: 40, fontSize: 13, color: "#333" },
  clearBtn: { padding: 4 },
  resultTitle: { fontSize: 13, fontWeight: "bold", color: "#333", marginTop: 8, marginBottom: 8 },
  listContainer: { paddingBottom: 24 },
  emptyBox: { paddingVertical: 40, alignItems: "center" },
  emptyText: { color: "#888", fontSize: 13 },
});