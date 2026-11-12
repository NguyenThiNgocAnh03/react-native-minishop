import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import {
  Alert,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  CartItem,
  Category,
  fetchCart,
  fetchCategories,
  fetchOrderHistory,
  fetchProducts,
  Order,
  Product,
  updateCartQuantity,
  updateUser,
  User,
} from "../../database/db";

import Header from "../../components/Header";
import CartTab from "./CartTab";
import HistoryTab from "./HistoryTab";
import ProfileTab from "./ProfileTab";
import ShopTab from "./ShopTab";

export default function UserHome(props: any) {
  const { currentUser, onUserUpdated, onLogout, navigation } = props;
  const [subTab, setSubTab] = useState<"shop" | "cart" | "history" | "profile">(
    "shop",
  );

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  const loadData = async () => {
    setProducts((await fetchProducts()) || []);
    setCategories((await fetchCategories()) || []);
    if (currentUser?.id) {
      setCart((await fetchCart(Number(currentUser.id))) || []);
      setOrders((await fetchOrderHistory(Number(currentUser.id))) || []);
    } else {
      setCart([]);
      setOrders([]);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [currentUser]),
  );

  const handleCheckout = () => {
    if (!currentUser) {
      navigation.navigate("LoginTab");
      return;
    }
    if (cart.length === 0) {
      if (Platform.OS === "web") window.alert("Giỏ hàng đang trống!");
      else Alert.alert("Thông báo", "Giỏ hàng đang trống!");
      return;
    }

    const total = cart.reduce(
      (sum, item) => sum + Number(item.price) * Number(item.quantity),
      0,
    );

    navigation.navigate("Checkout", {
      cart,
      total,
      currentUser,
      onOrderSuccess: async () => {
        await loadData();
        setSubTab("history");
      },
    });
  };

  // Xử lý lưu thông tin User (hỗ trợ cả 2 tham số (u, p) hoặc truyền thẳng User object)
  const handleSaveProfile = async (uOrUser: string | User, p?: string) => {
    if (!currentUser) return;

    let updated: User;
    if (typeof uOrUser === "string") {
      const u = uOrUser.trim();
      const pass = (p || "").trim();
      if (!u || !pass) {
        if (Platform.OS === "web")
          window.alert("Tên đăng nhập và mật khẩu không được để trống!");
        else Alert.alert("Lỗi", "Không để trống!");
        return;
      }
      updated = { ...currentUser, username: u, password: pass };
    } else {
      updated = { ...uOrUser };
    }

    const ok = await updateUser(updated);
    if (ok) {
      if (onUserUpdated) onUserUpdated(updated);
      await loadData();
      if (Platform.OS === "web") window.alert("Cập nhật thông tin thành công!");
      else Alert.alert("Thành công", "Đã lưu thông tin người dùng!");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8F9FA" }}>
      <Header
        currentUser={currentUser}
        onLogout={onLogout}
        navigation={navigation}
      />

      {/* Menu SubTab */}
      <View style={styles.navRow}>
        <TouchableOpacity
          style={[styles.navBtn, subTab === "shop" && styles.navBtnActive]}
          onPress={() => setSubTab("shop")}
        >
          <Text
            style={[styles.navText, subTab === "shop" && styles.navTextActive]}
          >
            Cửa hàng
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.navBtn, subTab === "cart" && styles.navBtnActive]}
          onPress={() => setSubTab("cart")}
        >
          <Text
            style={[styles.navText, subTab === "cart" && styles.navTextActive]}
          >
            Giỏ hàng ({cart.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.navBtn, subTab === "history" && styles.navBtnActive]}
          onPress={() => setSubTab("history")}
        >
          <Text
            style={[
              styles.navText,
              subTab === "history" && styles.navTextActive,
            ]}
          >
            Lịch sử
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.navBtn, subTab === "profile" && styles.navBtnActive]}
          onPress={() => setSubTab("profile")}
        >
          <Text
            style={[
              styles.navText,
              subTab === "profile" && styles.navTextActive,
            ]}
          >
            Tôi
          </Text>
        </TouchableOpacity>
      </View>

      {/* 1. Tab Cửa hàng */}
      {subTab === "shop" && (
        <ShopTab
          products={products}
          categories={categories}
          currentUser={currentUser}
          onRefreshCart={loadData}
          onViewProductDetail={(p: Product) =>
            navigation.navigate("ProductDetail", { product: p })
          }
        />
      )}

      {/* 2. Tab Giỏ hàng */}
      {subTab === "cart" && (
        <CartTab
          cart={cart}
          currentUser={currentUser}
          onUpdateQuantity={async (id: number, qty: number) => {
            await updateCartQuantity(id, qty);
            loadData();
          }}
          onCheckout={handleCheckout}
          onGoToShop={() => setSubTab("shop")}
          onGoToLogin={() => navigation.navigate("LoginTab")}
        />
      )}

      {/* 3. Tab Lịch sử đơn hàng */}
      {subTab === "history" && (
        <HistoryTab
          orders={orders}
          currentUser={currentUser}
          onRefreshOrders={loadData}
        />
      )}

      {/* 4. Tab Thông tin cá nhân */}
      {subTab === "profile" && (
        <ProfileTab
          currentUser={currentUser}
          onUserUpdated={handleSaveProfile}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  navRow: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderColor: "#EEE",
  },
  navBtn: { flex: 1, paddingVertical: 10, alignItems: "center" },
  navBtnActive: { borderBottomWidth: 2, borderBottomColor: "#007ACC" },
  navText: { fontSize: 12, color: "#666" },
  navTextActive: { color: "#007ACC", fontWeight: "bold" },
});
