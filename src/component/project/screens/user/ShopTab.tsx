import React, { useMemo, useState } from "react";
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Category, Product, addToCart } from "../../database/db";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface Props {
  products: Product[];
  categories: Category[];
  currentUser: any;
  onViewProductDetail: (product: Product) => void;
  onRefreshCart?: () => void;
  onAddToCart?: (p: Product) => void;
  onViewDetail?: (p: Product) => void;
}

type PriceFilter = "all" | "under300" | "300to1000" | "above1000";

// Danh sách banner mẫu theo tiêu chuẩn
const BANNER_LIST = [
  {
    id: 1,
    title: "SIÊU SALE MÙA HÈ",
    sub: "Giảm giá lên đến 50% toàn bộ phụ kiện",
    img: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800",
  },
  {
    id: 2,
    title: "BỘ SƯU TẬP MỚI",
    sub: "Thời trang xu hướng 2026",
    img: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800",
  },
  {
    id: 3,
    title: "MIỄN PHÍ VẬN CHUYỂN",
    sub: "Áp dụng cho đơn hàng từ 500k",
    img: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800",
  },
];

const removeVietnameseTones = (str: string) => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "d")
    .toLowerCase()
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
    const cleanKeyword = removeVietnameseTones(keyword);

    return products.filter((p) => {
      const cleanProductName = removeVietnameseTones(p.name);
      const matchKeyword = cleanProductName.includes(cleanKeyword);
      const matchCategory =
        activeCatId === "all" || Number(p.categoryId) === Number(activeCatId);

      const price = Number(p.price);
      let matchPrice = true;
      if (selectedPrice === "under300") {
        matchPrice = price < 300000;
      } else if (selectedPrice === "300to1000") {
        matchPrice = price >= 300000 && price <= 1000000;
      } else if (selectedPrice === "above1000") {
        matchPrice = price > 1000000;
      }

      return matchKeyword && matchCategory && matchPrice;
    });
  }, [products, keyword, activeCatId, selectedPrice]);

  // Header của FlatList chứa: Tìm kiếm, Banner quảng cáo và Menu danh mục + Khoảng giá
  const renderHeader = () => (
    <View>
      {/* 1. THANH TÌM KIẾM */}
      <View style={styles.searchBox}>
        <TextInput
          style={styles.searchInput}
          placeholder="🔍 Tìm kiếm sản phẩm theo tên..."
          value={keyword}
          onChangeText={setKeyword}
        />
        {keyword.length > 0 && (
          <TouchableOpacity
            onPress={() => setKeyword("")}
            style={styles.clearBtn}
          >
            <Text style={{ color: "#888", fontWeight: "bold" }}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* 2. BANNER QUẢNG CÁO (Mục A.2 trong barem) */}
      <View style={styles.bannerContainer}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          style={styles.bannerScroll}
        >
          {BANNER_LIST.map((banner) => (
            <View key={banner.id} style={styles.bannerItem}>
              <Image source={{ uri: banner.img }} style={styles.bannerImg} />
              <View style={styles.bannerOverlay}>
                <Text style={styles.bannerTitle}>{banner.title}</Text>
                <Text style={styles.bannerSub}>{banner.sub}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* 3. MENU ĐIỀU HƯỚNG DANH MỤC: Home (Tất cả) & Danh mục sản phẩm (Mục A.3 trong barem) */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>📂 Danh mục sản phẩm</Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollListContainer}
        style={styles.filterScroll}
      >
        {/* Nút Home / Tất cả sản phẩm */}
        <TouchableOpacity
          style={[
            styles.catChip,
            activeCatId === "all" && styles.catChipActive,
          ]}
          onPress={() => setActiveCatId("all")}
        >
          <Text
            style={[
              styles.catChipText,
              activeCatId === "all" && styles.catChipTextActive,
            ]}
          >
            🏠 Tất cả
          </Text>
        </TouchableOpacity>

        {/* Các danh mục con */}
        {categories.map((cat) => {
          const isSelected = activeCatId === cat.id;
          return (
            <TouchableOpacity
              key={cat.id}
              style={[styles.catChip, isSelected && styles.catChipActive]}
              onPress={() => setActiveCatId(cat.id)}
            >
              <Text
                style={[
                  styles.catChipText,
                  isSelected && styles.catChipTextActive,
                ]}
              >
                {cat.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* 4. BỘ LỌC KHOẢNG GIÁ */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>💵 Khoảng giá</Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollListContainer}
        style={styles.filterScroll}
      >
        <TouchableOpacity
          style={[
            styles.priceChip,
            selectedPrice === "all" && styles.priceChipActive,
          ]}
          onPress={() => setSelectedPrice("all")}
        >
          <Text
            style={[
              styles.priceChipText,
              selectedPrice === "all" && styles.priceChipTextActive,
            ]}
          >
            Mọi mức giá
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.priceChip,
            selectedPrice === "under300" && styles.priceChipActive,
          ]}
          onPress={() => setSelectedPrice("under300")}
        >
          <Text
            style={[
              styles.priceChipText,
              selectedPrice === "under300" && styles.priceChipTextActive,
            ]}
          >
            &lt; 300.000 đ
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.priceChip,
            selectedPrice === "300to1000" && styles.priceChipActive,
          ]}
          onPress={() => setSelectedPrice("300to1000")}
        >
          <Text
            style={[
              styles.priceChipText,
              selectedPrice === "300to1000" && styles.priceChipTextActive,
            ]}
          >
            300k - 1.000.000 đ
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.priceChip,
            selectedPrice === "above1000" && styles.priceChipActive,
          ]}
          onPress={() => setSelectedPrice("above1000")}
        >
          <Text
            style={[
              styles.priceChipText,
              selectedPrice === "above1000" && styles.priceChipTextActive,
            ]}
          >
            &gt; 1.000.000 đ
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={[styles.sectionHeader, { marginTop: 8, marginBottom: 8 }]}>
        <Text style={styles.sectionTitle}>
          🛍️ Danh sách sản phẩm ({filteredProducts.length})
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContainer}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>
              Không tìm thấy sản phẩm phù hợp bộ lọc.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => handlePressDetail(item)}
          >
            <Image
              source={{ uri: item.img || "https://picsum.photos/200" }}
              style={styles.productImg}
              resizeMode="cover"
            />
            <View style={styles.cardContent}>
              <Text style={styles.productName} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={styles.productPrice}>
                {Number(item.price).toLocaleString("vi-VN")} đ
              </Text>
              <TouchableOpacity
                style={styles.btnAddToCart}
                onPress={() => handleAddToCart(item)}
              >
                <Text style={styles.btnAddToCartText}>+ Thêm vào giỏ</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
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

  // Banner Styles
  bannerContainer: {
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 10,
    backgroundColor: "#EEE",
  },
  bannerScroll: {
    width: "100%",
    height: 130,
  },
  bannerItem: {
    width: SCREEN_WIDTH - 20,
    height: 130,
    position: "relative",
    justifyContent: "flex-end",
  },
  bannerImg: {
    ...StyleSheet.absoluteFill,
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  bannerOverlay: {
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    padding: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  bannerTitle: { color: "#FFF", fontSize: 15, fontWeight: "bold" },
  bannerSub: { color: "#EEE", fontSize: 11, marginTop: 2 },

  // Sections Header
  sectionHeader: { marginTop: 4, marginBottom: 2 },
  sectionTitle: { fontSize: 13, fontWeight: "bold", color: "#333" },

  filterScroll: {
    marginBottom: 6,
    flexGrow: 0,
    minHeight: 46,
  },
  scrollListContainer: {
    paddingVertical: 5,
    paddingHorizontal: 2,
    alignItems: "center",
  },

  // Chip Danh mục
  catChip: {
    height: 38,
    minWidth: 70,
    paddingHorizontal: 16,
    borderRadius: 19,
    backgroundColor: "#EAEAEA",
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  catChipActive: {
    backgroundColor: "#007ACC",
  },
  catChipText: {
    fontSize: 13,
    color: "#444",
    lineHeight: 18,
    includeFontPadding: false,
    textAlign: "center",
  },
  catChipTextActive: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },

  // Chip Khoảng giá
  priceChip: {
    height: 36,
    minWidth: 80,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: "#F5F5F7",
    borderWidth: 1,
    borderColor: "#DCDCDC",
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  priceChipActive: {
    backgroundColor: "#E3F2FD",
    borderColor: "#007ACC",
  },
  priceChipText: {
    fontSize: 12,
    color: "#444",
    lineHeight: 16,
    includeFontPadding: false,
    textAlign: "center",
  },
  priceChipTextActive: {
    color: "#007ACC",
    fontWeight: "bold",
  },

  // Card Sản phẩm
  listContainer: { paddingBottom: 24 },
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
  productName: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 13,
    color: "#D32F2F",
    fontWeight: "bold",
    marginBottom: 8,
  },
  btnAddToCart: {
    backgroundColor: "#007ACC",
    paddingVertical: 6,
    borderRadius: 4,
    alignItems: "center",
  },
  btnAddToCartText: { color: "#FFF", fontSize: 11, fontWeight: "bold" },
  emptyBox: { paddingVertical: 40, alignItems: "center" },
  emptyText: { color: "#888", fontSize: 13 },
});
