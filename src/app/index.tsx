import React from 'react';
import AppTabs from '../component/project/navigation/AppTabs';

export default function Index() {
  return <AppTabs />;
}
// import React, { useState, useEffect } from 'react';
// import { Text } from 'react-native';
// import { NavigationContainer, NavigationIndependentTree } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// // Khởi tạo Database & Type
// import { initDatabase, User } from '../component/Buoi11/database';

// // Nhập các màn hình
// import AdminHome from '../component/Buoi12/AdminHome';
// import ProductSqlite from '../component/Buoi11/ProductSqlite2';
// import ProductDetailScreen from '../component/Buoi12/ProductDetailScreen';
// import ProductsByCategoryScreen from '../component/Buoi12/ProductsByCategoryScreen';
// import UserHome from '../component/Buoi12/UserHome';
// import LoginSqlite from '../component/Buoi13/LoginSqlite';
// import SignupSqlite from '../component/Buoi13/SignupSqlite';

// const Stack = createNativeStackNavigator();
// const Tab = createBottomTabNavigator();

// function HomeStack({ currentUser, onUserUpdated, onLogout }: any) {
//   return (
//     <Stack.Navigator>
//       <Stack.Screen name="ShopHome" options={{ headerShown: false }}>
//         {(props) => (
//           <UserHome 
//             {...props} 
//             currentUser={currentUser} 
//             onUserUpdated={onUserUpdated} 
//             onLogout={onLogout}
//             initialTab="shop"
//           />
//         )}
//       </Stack.Screen>
//       <Stack.Screen 
//         name="ProductDetail" 
//         component={ProductDetailScreen} 
//         options={{ title: 'Chi tiết sản phẩm' }} 
//       />
//       <Stack.Screen 
//         name="ProductsByCategory" 
//         component={ProductsByCategoryScreen} 
//         options={{ title: 'Sản phẩm cùng loại' }} 
//       />
//     </Stack.Navigator>
//   );
// }

// function AdminStack() {
//   return (
//     <Stack.Navigator initialRouteName="AdminHome">
//       <Stack.Screen 
//         name="AdminHome" 
//         component={AdminHome} 
//         options={{ title: 'Bảng điều khiển', headerShown: false }} 
//       />
//       <Stack.Screen 
//         name="Product" 
//         component={ProductSqlite} 
//         options={{ title: 'Quản lý sản phẩm' }} 
//       />
//       <Stack.Screen 
//         name="ProductDetail" 
//         component={ProductDetailScreen} 
//         options={{ title: 'Chi tiết sản phẩm' }} 
//       />
//       <Stack.Screen 
//         name="ProductsByCategory" 
//         component={ProductsByCategoryScreen} 
//         options={{ title: 'Sản phẩm theo loại' }} 
//       />
//     </Stack.Navigator>
//   );
// }

// function ProfileStack({ currentUser, onUserUpdated, onLogout }: any) {
//   return (
//     <Stack.Navigator>
//       <Stack.Screen name="ProfileHome" options={{ headerShown: false }}>
//         {(props) => (
//           <UserHome 
//             {...props} 
//             currentUser={currentUser} 
//             onUserUpdated={onUserUpdated} 
//             onLogout={onLogout}
//             initialTab="profile"
//           />
//         )}
//       </Stack.Screen>
//     </Stack.Navigator>
//   );
// }

// export default function Index() {
//   const [currentUser, setCurrentUser] = useState<User | null>(null);

//   useEffect(() => {
//     initDatabase();
//   }, []);

//   const handleLogout = () => {
//     setCurrentUser(null);
//   };

//   return (
//     <NavigationIndependentTree>
//       <NavigationContainer>
//         <Tab.Navigator screenOptions={{ headerShown: false }}>
//           {/* NẾU LÀ ADMIN: Đưa AdminTab lên đầu để tự chuyển vào trang quản trị */}
//           {currentUser && currentUser.role === 'admin' && (
//             <Tab.Screen 
//               name="AdminTab" 
//               component={AdminStack} 
//               options={{ 
//                 title: 'Quản trị', 
//                 tabBarIcon: () => <Text>⚙️</Text> 
//               }} 
//             />
//           )}

//           {/* TRANG CHỦ CỬA HÀNG */}
//           <Tab.Screen 
//             name="HomeTab" 
//             options={{ 
//               title: 'Trang chủ', 
//               tabBarIcon: () => <Text>🛍️</Text> 
//             }} 
//           >
//             {() => (
//               <HomeStack 
//                 currentUser={currentUser} 
//                 onUserUpdated={setCurrentUser} 
//                 onLogout={handleLogout} 
//               />
//             )}
//           </Tab.Screen>

//           {/* TAB TÔI: XUẤT HIỆN KHI ĐÃ ĐĂNG NHẬP */}
//           {currentUser && (
//             <Tab.Screen 
//               name="ProfileTab" 
//               options={{ 
//                 title: 'Tôi', 
//                 tabBarIcon: () => <Text>👤</Text> 
//               }} 
//             >
//               {() => (
//                 <ProfileStack 
//                   currentUser={currentUser} 
//                   onUserUpdated={setCurrentUser} 
//                   onLogout={handleLogout} 
//                 />
//               )}
//             </Tab.Screen>
//           )}

//           {/* NẾU CHƯA ĐĂNG NHẬP (GUEST): HIỆN ĐĂNG KÝ VÀ ĐĂNG NHẬP */}
//           {!currentUser && (
//             <>
//               <Tab.Screen 
//                 name="Signup" 
//                 component={SignupSqlite} 
//                 options={{ 
//                   title: 'Đăng ký', 
//                   tabBarIcon: () => <Text>📝</Text> 
//                 }} 
//               />
//               <Tab.Screen 
//                 name="Login" 
//                 options={{ 
//                   title: 'Đăng nhập', 
//                   tabBarIcon: () => <Text>🔒</Text> 
//                 }} 
//               >
//                 {(props) => (
//                   <LoginSqlite 
//                     {...props} 
//                     onLoginSuccess={(user: User) => setCurrentUser(user)} 
//                   />
//                 )}
//               </Tab.Screen>
//             </>
//           )}
//         </Tab.Navigator>
//       </NavigationContainer>
//     </NavigationIndependentTree>
//   );
// }