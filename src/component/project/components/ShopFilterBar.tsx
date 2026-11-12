import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Category } from "../database/db";

export type PriceFilter = "all" | "under300" | "300to1000" | "above1000";

interface Props {
  categories: Category[];
  activeCatId: number | "all";
  onSelectCategory: (id: number | "all") => void;
  selectedPrice: PriceFilter;
  onSelectPrice: (price: PriceFilter) => void;
}

const PRICE_OPTIONS: { key: PriceFilter; label: string }[] = [
  { key: "all", label: "Mọi mức giá" },
  { key: "under300", label: "< 300.000 đ" },
  { key: "300to1000", label: "300k - 1.000.000 đ" },
  { key: "above1000", label: "> 1.000.000 đ" },
];

export default function ShopFilterBar({
  categories,
  activeCatId,
  onSelectCategory,
  selectedPrice,
  onSelectPrice,
}: Props) {
  return (
    <View>
      {/* Danh mục sản phẩm */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>📂 Danh mục sản phẩm</Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollListContainer}
        style={styles.filterScroll}
      >
        <TouchableOpacity
          style={[styles.catChip, activeCatId === "all" && styles.catChipActive]}
          onPress={() => onSelectCategory("all")}
        >
          <Text
            style={[
              styles.catChipText,
              activeCatId === "all" && styles.catChipTextActive,
            ]}
          >
            
            Tất cả
          </Text>
        </TouchableOpacity>

        {categories.map((cat) => {
          const isSelected = Number(activeCatId) === Number(cat.id);
          return (
            <TouchableOpacity
              key={cat.id}
              style={[styles.catChip, isSelected && styles.catChipActive]}
              onPress={() => onSelectCategory(cat.id)}
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

      {/* Bộ lọc khoảng giá */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>💵 Khoảng giá</Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollListContainer}
        style={styles.filterScroll}
      >
        {PRICE_OPTIONS.map((opt) => {
          const isSelected = selectedPrice === opt.key;
          return (
            <TouchableOpacity
              key={opt.key}
              style={[styles.priceChip, isSelected && styles.priceChipActive]}
              onPress={() => onSelectPrice(opt.key)}
            >
              <Text
                style={[
                  styles.priceChipText,
                  isSelected && styles.priceChipTextActive,
                ]}
              >
                {opt.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionHeader: { marginTop: 4, marginBottom: 2 },
  sectionTitle: { fontSize: 13, fontWeight: "bold", color: "#333" },
  filterScroll: { marginBottom: 6, flexGrow: 0, minHeight: 46 },
  scrollListContainer: { paddingVertical: 5, paddingHorizontal: 2, alignItems: "center" },

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
  catChipActive: { backgroundColor: "#007ACC" },
  catChipText: {
    fontSize: 13,
    color: "#444",
    lineHeight: 18,
    includeFontPadding: false,
    textAlign: "center",
  },
  catChipTextActive: { color: "#FFFFFF", fontWeight: "bold" },

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
  priceChipActive: { backgroundColor: "#E3F2FD", borderColor: "#007ACC" },
  priceChipText: {
    fontSize: 12,
    color: "#444",
    lineHeight: 16,
    includeFontPadding: false,
    textAlign: "center",
  },
  priceChipTextActive: { color: "#007ACC", fontWeight: "bold" },
});