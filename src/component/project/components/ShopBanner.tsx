import React from "react";
import { Dimensions, Image, ScrollView, StyleSheet, Text, View } from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

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

export default function ShopBanner() {
  return (
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
  );
}

const styles = StyleSheet.create({
  bannerContainer: {
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 10,
    backgroundColor: "#EEE",
  },
  bannerScroll: { width: "100%", height: 130 },
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
});