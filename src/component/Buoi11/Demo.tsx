import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Dữ liệu danh sách 10 sản phẩm
const PRODUCTS = [
  {
    id: "1",
    name: "Tram Go Mun Hoa Hong",
    price: "65.000d",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5POChx9CZf-Kh_qjX3vPO3KxZX-8rBS9tBL0r7bdjyg&s=10",
  },
  {
    id: "2",
    name: "Tram Hoa Luu Ly Bac",
    price: "85.000d",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8u7aO0x-Sly5Xdrrt782UwPNUxWyWqmUmd7JJheiF8g&s=10",
  },
  {
    id: "3",
    name: "Tram Dan Huong Hoa Dao",
    price: "55.000d",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSk-2XqwfM9sJvbus080fsK_Cfs-mUsH0oEWHY8rUDExw&s=10",
  },
  {
    id: "4",
    name: "Tram Phuong Hoang Ma Vang",
    price: "120.000d",
    image:
      "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRlKL8Dii8V0s7jP661mtOgKSKX0miJ7pfptOer0WbYVpkdV4R3pzzZ8Tw1niuz0kOsN4gohaZpo6LtYHAQCikkd_yaLDrpp8sgjn71cHG9A0xa1x2rl-Wcag&usqp=CAc",
  },
  {
    id: "5",
    name: "Tram Dinh Hat Ngoc Trai",
    price: "45.000d",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9YTls2ruytg-y2OhD_Z9eZ-gbxIqTjyxFNJOhKOTAhA&s",
  },
  {
    id: "6",
    name: "Tram Ho Diep Da Quang",
    price: "95.000d",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwmDcOETOF_6dwf6T110-qxhNn5Qv3r-fxpQ5X35zWvQ&s=10",
  },
  {
    id: "7",
    name: "Tram Truc Khac Thu Phap",
    price: "40.000d",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSREq_S324jxBZFbYEL6-tBmu0UlIVZ5FL7QCvyNovDOw&s=10",
  },
  {
    id: "8",
    name: "Bo Tram Dinh Chuong",
    price: "110.000d",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS88g46oUD_UUrxWezNt1V6cPmMb2ATQbC1GTJyoCErDQ&s=10",
  },
  {
    id: "9",
    name: "Tram Tan Trung Hoa",
    price: "79.000d",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJAaVdXgxJrfo7z8sVF6TKwgbm7irZtLaqJVoIjQvCLg&s",
  },
  {
    id: "10",
    name: "Tram Thuy Tinh Khac Hoa",
    price: "69.000d",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0eZ4bgwPsp807EtF-CzppdbX16Z7GZDcuU7l-BRf0CQ&s=10",
  },
];

export default function Demo() {
  // Hàm hiển thị thông báo khi bấm nút mua
  const handleBuy = (name: string) => {
    Alert.alert("Thong bao", "Ban da chon mua: " + name);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={PRODUCTS}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        // Phần đầu trang: Logo, Tiêu đề, Banner
        ListHeaderComponent={
          <View style={styles.header}>
            <View style={styles.logoRow}>
              <Image
                source={{ uri: "https://img.icons8.com/color/96/lotus.png" }}
                style={styles.logo}
              />
              <View>
                <Text style={styles.logoTitle}>CO PHONG CAC</Text>
                <Text style={styles.logoSubtitle}>
                  Tram cai toc va phu kien co phong
                </Text>
              </View>
            </View>

            <Image
              source={{
                uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5POChx9CZf-Kh_qjX3vPO3KxZX-8rBS9tBL0r7bdjyg&s=10",
              }}
              style={styles.banner}
            />

            <Text style={styles.sectionTitle}>DANH SACH SAN PHAM</Text>
          </View>
        }
        // Giao diện của từng ô sản phẩm
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.productImage} />
            <Text style={styles.productName} numberOfLines={2}>
              {item.name}
            </Text>
            <Text style={styles.price}>{item.price}</Text>

            <TouchableOpacity
              style={styles.buyButton}
              onPress={() => handleBuy(item.name)}
            >
              <Text style={styles.buyText}>Mua ngay</Text>
            </TouchableOpacity>
          </View>
        )}
        // Phần chân trang: Thông tin liên hệ
        ListFooterComponent={
          <View style={styles.footer}>
            <Text style={styles.footerTitle}>THONG TIN LIEN HE</Text>

            <View style={styles.footerRow}>
              <View style={styles.footerCol}>
                <Text style={styles.colTitle}>Ho ten</Text>
                <Text style={styles.colText}>Ten cua ban</Text>
              </View>

              <View style={styles.footerCol}>
                <Text style={styles.colTitle}>Dien thoai</Text>
                <Text style={styles.colText}>So dien thoai</Text>
              </View>

              <View style={styles.footerCol}>
                <Text style={styles.colTitle}>Dia chi</Text>
                <Text style={styles.colText}>Da Nang</Text>
              </View>
            </View>

            <Text style={styles.copyright}>© 2026 Co Phong Cac</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f4ef",
  },
  header: {
    backgroundColor: "#ffffff",
    padding: 12,
    marginBottom: 10,
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  logo: {
    width: 45,
    height: 45,
    marginRight: 10,
  },
  logoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#8c2d19",
  },
  logoSubtitle: {
    fontSize: 11,
    color: "#666666",
  },
  banner: {
    width: "100%",
    height: 140,
    borderRadius: 8,
    backgroundColor: "#dddddd",
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#8c2d19",
    marginTop: 15,
  },
  row: {
    justifyContent: "space-between",
    paddingHorizontal: 12,
  },
  card: {
    width: "48%",
    backgroundColor: "#ffffff",
    padding: 8,
    marginBottom: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  productImage: {
    width: "100%",
    height: 125,
    borderRadius: 6,
    backgroundColor: "#eeeeee",
  },
  productName: {
    width: "100%",
    height: 38,
    fontSize: 13,
    fontWeight: "bold",
    color: "#333333",
    textAlign: "center",
    marginTop: 8,
  },
  price: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#c62828",
    marginVertical: 6,
  },
  buyButton: {
    width: "100%",
    backgroundColor: "#8c2d19",
    paddingVertical: 9,
    borderRadius: 5,
    alignItems: "center",
  },
  buyText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "bold",
  },
  footer: {
    backgroundColor: "#332525",
    padding: 16,
    marginTop: 8,
  },
  footerTitle: {
    color: "#f5d6a5",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  footerRow: {
    flexDirection: "row",
  },
  footerCol: {
    flex: 1,
    alignItems: "center",
  },
  colTitle: {
    color: "#e4bd62",
    fontWeight: "bold",
    fontSize: 12,
    marginBottom: 5,
  },
  colText: {
    color: "#ffffff",
    fontSize: 10,
    textAlign: "center",
  },
  copyright: {
    color: "#bbbbbb",
    fontSize: 11,
    textAlign: "center",
    marginTop: 18,
  },
});
