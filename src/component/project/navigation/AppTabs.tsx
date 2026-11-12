import React, { useState, useEffect } from 'react';
import { Text } from 'react-native';
import { NavigationContainer, NavigationIndependentTree } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { initDatabase, User } from '../database/db';
import UserHome from '../screens/user/UserHome';
import AdminHome from '../screens/admin/AdminHome';
import LoginScreen from '../auth/LoginScreen';
import SignupScreen from '../auth/SignupScreen';
import CheckoutScreen from '../screens/user/CheckoutScreen';
import OrderDetailScreen from '../screens/admin/OrderDetailScreen';

import ProductDetailScreen from '../../Buoi12/ProductDetailScreen';
import ProductsByCategoryScreen from '../../Buoi12/ProductsByCategoryScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

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
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} options={{ title: 'Chi tiết sản phẩm' }} />
      <Stack.Screen name="ProductsByCategory" component={ProductsByCategoryScreen} options={{ title: 'Sản phẩm cùng loại' }} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} options={{ title: 'Xác nhận đặt hàng' }} />
    </Stack.Navigator>
  );
}

function AdminStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="AdminDashboard" component={AdminHome} options={{ headerShown: false }} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} options={{ title: 'Chi tiết sản phẩm' }} />
      <Stack.Screen name="ProductsByCategory" component={ProductsByCategoryScreen} options={{ title: 'Sản phẩm cùng loại' }} />
      <Stack.Screen name="OrderDetail" component={OrderDetailScreen} options={{ title: 'Chi tiết đơn hàng' }} />
    </Stack.Navigator>
  );
}

export default function AppTabs() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    initDatabase();
  }, []);

  return (
    <NavigationIndependentTree>
      <NavigationContainer>
        <Tab.Navigator initialRouteName="HomeUserTab" screenOptions={{ headerShown: false }}>
          <Tab.Screen
            name="HomeUserTab"
            options={{ title: 'Home của user', tabBarIcon: () => <Text>🛍️</Text> }}
          >
            {() => (
              <UserStack
                currentUser={currentUser}
                onUserUpdated={setCurrentUser}
                onLogout={() => setCurrentUser(null)}
              />
            )}
          </Tab.Screen>

          {currentUser?.role === 'admin' && (
            <Tab.Screen
              name="HomeAdminTab"
              component={AdminStack}
              options={{ title: 'Home của admin', tabBarIcon: () => <Text>⚙️</Text> }}
            />
          )}

          <Tab.Screen
            name="SignupTab"
            component={SignupScreen}
            options={{ title: 'Signup', tabBarIcon: () => <Text>📝</Text> }}
          />

          <Tab.Screen
            name="LoginTab"
            options={{ title: 'Login', tabBarIcon: () => <Text>🔒</Text> }}
          >
            {(props) => (
              <LoginScreen {...props} onLoginSuccess={(u: User) => setCurrentUser(u)} />
            )}
          </Tab.Screen>
          
        </Tab.Navigator>
      </NavigationContainer>
    </NavigationIndependentTree>
  );
}