import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { initDatabase, User } from '../Buoi11/database';
import UserHome from '../Buoi12/UserHome';
import AdminHome from '../Buoi12/AdminHome';
import ProductDetailScreen from '../Buoi12/ProductDetailScreen';
import ProductsByCategoryScreen from '../Buoi12/ProductsByCategoryScreen';
import SignupSqlite from './SignupSqlite';
import LoginSqlite from './LoginSqlite';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Stack dành cho Người dùng / Khách
function UserStack({ currentUser, onUserUpdated, onLogout }: any) {
  return (
    <Stack.Navigator>
      <Stack.Screen name="UserMain" options={{ headerShown: false }}>
        {(props) => (
          <UserHome 
            {...props} 
            currentUser={currentUser} 
            onUserUpdated={onUserUpdated} 
            onLogout={onLogout}
          />
        )}
      </Stack.Screen>
      <Stack.Screen 
        name="ProductDetail" 
        component={ProductDetailScreen} 
        options={{ title: 'Chi tiết sản phẩm' }} 
      />
      <Stack.Screen 
        name="ProductsByCategory" 
        component={ProductsByCategoryScreen} 
        options={{ title: 'Sản phẩm cùng loại' }} 
      />
    </Stack.Navigator>
  );
}

// Stack dành cho Quản trị viên
function AdminStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="AdminDashboard" 
        component={AdminHome} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="ProductDetail" 
        component={ProductDetailScreen} 
        options={{ title: 'Chi tiết sản phẩm' }} 
      />
      <Stack.Screen 
        name="ProductsByCategory" 
        component={ProductsByCategoryScreen} 
        options={{ title: 'Sản phẩm cùng loại' }} 
      />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    initDatabase();
  }, []);

  const handleLogout = () => {
    setCurrentUser(null);
  };

  return (
    <View style={styles.container}>
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen 
          name="HomeTab" 
          options={{ 
            title: 'Trang chủ',
          }}
        >
          {() => (
            <UserStack 
              currentUser={currentUser} 
              onUserUpdated={setCurrentUser} 
              onLogout={handleLogout}
            />
          )}
        </Tab.Screen>

        <Tab.Screen 
          name="AdminTab" 
          component={AdminStack} 
          options={{ 
            title: 'Quản trị',
          }} 
        />

        <Tab.Screen 
          name="SignupTab" 
          component={SignupSqlite} 
          options={{ 
            title: 'Đăng ký',
          }} 
        />

        <Tab.Screen 
          name="LoginTab" 
          options={{ 
            title: 'Đăng nhập',
          }}
        >
          {(props: any) => (
            <LoginSqlite 
              {...props} 
              currentUser={currentUser}
              onLoginSuccess={setCurrentUser} 
            />
          )}
        </Tab.Screen>
      </Tab.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
});