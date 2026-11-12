import { Platform } from 'react-native';
import * as SQLite from 'expo-sqlite';

export type Category = { id: number; name: string };
export type Product = { id: number; name: string; price: number; img: string; categoryId: number };
export type User = { id: number; username: string; password: string; role: string };
export type CartItem = { id: number; userId: number; productId: number; quantity: number; name: string; price: number; img: string };
export type OrderItem = { id: number; orderId: number; productName: string; price: number; quantity: number };
export type Order = { id: number; userId: number; total: number; createdAt: string; items?: OrderItem[] };

const initialCategories: Category[] = [
  { id: 1, name: 'Thời trang nữ' },
  { id: 2, name: 'Thời trang nam' },
  { id: 3, name: 'Phụ kiện nữ' },
  { id: 4, name: 'Phụ kiện nam' },
];

const initialProducts: Product[] = [
  { id: 1, name: 'Áo sơ mi', price: 250000, img: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=300', categoryId: 1 },
  { id: 2, name: 'Giày sneaker', price: 1100000, img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300', categoryId: 2 },
  { id: 3, name: 'Balo thời trang', price: 490000, img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300', categoryId: 3 },
  { id: 4, name: 'Mũ lưỡi trai', price: 120000, img: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=300', categoryId: 4 },
];

const initialUsers: User[] = [
  { id: 1, username: 'admin', password: '123', role: 'admin' },
  { id: 2, username: 'user1', password: '123', role: 'user' },
];

const getWebStorage = (key: string, defaultValue: any) => {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const data = localStorage.getItem(`app_${key}`);
    return data ? JSON.parse(data) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const setWebStorage = (key: string, value: any) => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(`app_${key}`, JSON.stringify(value));
    } catch (e) {
      console.error(e);
    }
  }
};

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;
const getNativeDb = async (): Promise<SQLite.SQLiteDatabase> => {
  if (!dbPromise) dbPromise = SQLite.openDatabaseAsync('myDatabase.db');
  return dbPromise;
};

export const initDatabase = async (onSuccess?: () => void): Promise<void> => {
  try {
    if (Platform.OS === 'web') {
      if (!localStorage.getItem('app_initialized')) {
        setWebStorage('categories', initialCategories);
        setWebStorage('products', initialProducts);
        setWebStorage('users', initialUsers);
        setWebStorage('cart', []);
        setWebStorage('orders', []);
        localStorage.setItem('app_initialized', 'true');
      }
      if (onSuccess) onSuccess();
      return;
    }

    const db = await getNativeDb();
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS categories (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, price REAL NOT NULL, img TEXT, categoryId INTEGER);
      CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE NOT NULL, password TEXT NOT NULL, role TEXT DEFAULT 'user');
      CREATE TABLE IF NOT EXISTS cart (id INTEGER PRIMARY KEY AUTOINCREMENT, userId INTEGER NOT NULL, productId INTEGER NOT NULL, quantity INTEGER DEFAULT 1);
      CREATE TABLE IF NOT EXISTS orders (id INTEGER PRIMARY KEY AUTOINCREMENT, userId INTEGER NOT NULL, total REAL NOT NULL, createdAt TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS order_items (id INTEGER PRIMARY KEY AUTOINCREMENT, orderId INTEGER NOT NULL, productName TEXT NOT NULL, price REAL NOT NULL, quantity INTEGER NOT NULL);
    `);

    for (const c of initialCategories) {
      await db.runAsync('INSERT OR IGNORE INTO categories (id, name) VALUES (?, ?)', [c.id, c.name]);
    }
    for (const p of initialProducts) {
      await db.runAsync(
        'INSERT OR IGNORE INTO products (id, name, price, img, categoryId) VALUES (?, ?, ?, ?, ?)',
        [p.id, p.name, p.price, p.img, p.categoryId]
      );
    }
    await db.runAsync(`
      INSERT INTO users (username, password, role)
      SELECT 'admin', '123', 'admin'
      WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'admin')
    `);

    if (onSuccess) onSuccess();
  } catch (e) {
    console.error('initDatabase error:', e);
  }
};

export const fetchCategories = async (): Promise<Category[]> => {
  if (Platform.OS === 'web') return getWebStorage('categories', initialCategories);
  try {
    const db = await getNativeDb();
    return (await db.getAllAsync<Category>('SELECT * FROM categories')) || [];
  } catch {
    return [];
  }
};

export const addCategory = async (name: string): Promise<boolean> => {
  if (Platform.OS === 'web') {
    const cats: Category[] = getWebStorage('categories', initialCategories);
    cats.push({ id: Date.now(), name });
    setWebStorage('categories', cats);
    return true;
  }
  try {
    const db = await getNativeDb();
    await db.runAsync('INSERT INTO categories (name) VALUES (?)', [name]);
    return true;
  } catch {
    return false;
  }
};

export const updateCategory = async (id: number, name: string): Promise<boolean> => {
  if (Platform.OS === 'web') {
    const cats: Category[] = getWebStorage('categories', initialCategories);
    setWebStorage('categories', cats.map((c) => (Number(c.id) === Number(id) ? { ...c, name } : c)));
    return true;
  }
  try {
    const db = await getNativeDb();
    await db.runAsync('UPDATE categories SET name = ? WHERE id = ?', [name, Number(id)]);
    return true;
  } catch {
    return false;
  }
};

export const deleteCategory = async (id: number): Promise<boolean> => {
  if (Platform.OS === 'web') {
    const cats: Category[] = getWebStorage('categories', initialCategories);
    setWebStorage('categories', cats.filter((c) => Number(c.id) !== Number(id)));
    return true;
  }
  try {
    const db = await getNativeDb();
    await db.runAsync('DELETE FROM categories WHERE id = ?', [Number(id)]);
    return true;
  } catch {
    return false;
  }
};

export const fetchProducts = async (): Promise<Product[]> => {
  if (Platform.OS === 'web') return getWebStorage('products', initialProducts);
  try {
    const db = await getNativeDb();
    return (await db.getAllAsync<Product>('SELECT * FROM products')) || [];
  } catch {
    return [];
  }
};

export const fetchProductsByCategory = async (categoryId: number): Promise<Product[]> => {
  const catId = Number(categoryId);
  if (Platform.OS === 'web') {
    const prods: Product[] = getWebStorage('products', initialProducts);
    return prods.filter((p) => Number(p.categoryId) === catId);
  }
  try {
    const db = await getNativeDb();
    return (await db.getAllAsync<Product>('SELECT * FROM products WHERE categoryId = ?', [catId])) || [];
  } catch {
    return [];
  }
};

export const addProduct = async (product: Omit<Product, 'id'>) => {
  if (Platform.OS === 'web') {
    const prods: Product[] = getWebStorage('products', initialProducts);
    prods.push({ id: Date.now(), ...product, price: Number(product.price), categoryId: Number(product.categoryId) });
    setWebStorage('products', prods);
    return;
  }
  try {
    const db = await getNativeDb();
    await db.runAsync(
      'INSERT INTO products (name, price, img, categoryId) VALUES (?, ?, ?, ?)',
      [product.name, Number(product.price), product.img, Number(product.categoryId)]
    );
  } catch (e) {
    console.error(e);
  }
};

export const updateProduct = async (product: Product) => {
  const pid = Number(product.id);
  if (Platform.OS === 'web') {
    const prods: Product[] = getWebStorage('products', initialProducts);
    setWebStorage('products', prods.map((p) => (Number(p.id) === pid ? { ...product, price: Number(product.price) } : p)));
    return;
  }
  try {
    const db = await getNativeDb();
    await db.runAsync(
      'UPDATE products SET name = ?, price = ?, categoryId = ?, img = ? WHERE id = ?',
      [product.name, Number(product.price), Number(product.categoryId), product.img, pid]
    );
  } catch (e) {
    console.error(e);
  }
};

export const deleteProduct = async (id: number) => {
  const pid = Number(id);
  if (Platform.OS === 'web') {
    const prods: Product[] = getWebStorage('products', initialProducts);
    setWebStorage('products', prods.filter((p) => Number(p.id) !== pid));
    return;
  }
  try {
    const db = await getNativeDb();
    await db.runAsync('DELETE FROM products WHERE id = ?', [pid]);
  } catch (e) {
    console.error(e);
  }
};

export const fetchUsers = async (): Promise<User[]> => {
  if (Platform.OS === 'web') return getWebStorage('users', initialUsers);
  try {
    const db = await getNativeDb();
    return (await db.getAllAsync<User>('SELECT * FROM users')) || [];
  } catch {
    return [];
  }
};

export const addUser = async (username: string, password: string, role = 'user'): Promise<boolean> => {
  if (Platform.OS === 'web') {
    const users: User[] = getWebStorage('users', initialUsers);
    if (users.some((u) => u.username === username)) return false;
    users.push({ id: Date.now(), username, password, role });
    setWebStorage('users', users);
    return true;
  }
  try {
    const db = await getNativeDb();
    await db.runAsync('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', [username, password, role]);
    return true;
  } catch {
    return false;
  }
};

export const updateUser = async (user: User) => {
  const uid = Number(user.id);
  if (Platform.OS === 'web') {
    const users: User[] = getWebStorage('users', initialUsers);
    setWebStorage('users', users.map((u) => (Number(u.id) === uid ? user : u)));
    return;
  }
  try {
    const db = await getNativeDb();
    await db.runAsync('UPDATE users SET username = ?, password = ?, role = ? WHERE id = ?', [
      user.username,
      user.password,
      user.role,
      uid,
    ]);
  } catch (e) {
    console.error(e);
  }
};

export const deleteUser = async (id: number) => {
  const uid = Number(id);
  if (Platform.OS === 'web') {
    const users: User[] = getWebStorage('users', initialUsers);
    setWebStorage('users', users.filter((u) => Number(u.id) !== uid));
    return;
  }
  try {
    const db = await getNativeDb();
    await db.runAsync('DELETE FROM users WHERE id = ?', [uid]);
  } catch (e) {
    console.error(e);
  }
};

export const getUserByCredentials = async (username: string, password: string): Promise<User | null> => {
  if (Platform.OS === 'web') {
    const users: User[] = getWebStorage('users', initialUsers);
    return users.find((u) => u.username === username && u.password === password) || null;
  }
  try {
    const db = await getNativeDb();
    return await db.getFirstAsync<User>('SELECT * FROM users WHERE username = ? AND password = ?', [username, password]);
  } catch {
    return null;
  }
};

// --- GIỎ HÀNG: LOAD CHI TIẾT SẢN PHẨM ---
export const fetchCart = async (userId: number): Promise<CartItem[]> => {
  const uid = Number(userId);
  if (isNaN(uid)) return [];

  if (Platform.OS === 'web') {
    const carts: any[] = getWebStorage('cart', []);
    const prods: Product[] = getWebStorage('products', initialProducts);
    return carts
      .filter((c) => Number(c.userId) === uid)
      .map((c) => {
        const prod = prods.find((p) => Number(p.id) === Number(c.productId)) || {
          name: 'Sản phẩm',
          price: 0,
          img: '',
        };
        return {
          id: c.id,
          userId: Number(c.userId),
          productId: Number(c.productId),
          quantity: Number(c.quantity),
          name: prod.name,
          price: Number(prod.price),
          img: prod.img,
        };
      });
  }

  try {
    const db = await getNativeDb();
    const rows = await db.getAllAsync<CartItem>(
      `SELECT c.id, c.userId, c.productId, c.quantity, p.name, p.price, p.img 
       FROM cart c 
       JOIN products p ON c.productId = p.id 
       WHERE c.userId = ?`,
      [uid]
    );
    return rows || [];
  } catch (error) {
    console.error('Lỗi fetchCart:', error);
    return [];
  }
};

export const addToCart = async (userId: number, productId: number): Promise<boolean> => {
  const uid = Number(userId);
  const pid = Number(productId);
  if (isNaN(uid) || isNaN(pid)) return false;

  if (Platform.OS === 'web') {
    const carts: any[] = getWebStorage('cart', []);
    const existing = carts.find((c) => Number(c.userId) === uid && Number(c.productId) === pid);
    if (existing) {
      existing.quantity = Number(existing.quantity) + 1;
    } else {
      carts.push({ id: Date.now(), userId: uid, productId: pid, quantity: 1 });
    }
    setWebStorage('cart', carts);
    return true;
  }

  try {
    const db = await getNativeDb();
    const existing = await db.getFirstAsync<any>(
      'SELECT * FROM cart WHERE userId = ? AND productId = ?',
      [uid, pid]
    );

    if (existing) {
      await db.runAsync('UPDATE cart SET quantity = quantity + 1 WHERE id = ?', [existing.id]);
    } else {
      await db.runAsync('INSERT INTO cart (userId, productId, quantity) VALUES (?, ?, 1)', [uid, pid]);
    }
    return true;
  } catch (error) {
    console.error('Lỗi addToCart:', error);
    return false;
  }
};

export const updateCartQuantity = async (cartId: number, quantity: number): Promise<boolean> => {
  const cid = Number(cartId);
  const q = Number(quantity);

  if (Platform.OS === 'web') {
    let carts: any[] = getWebStorage('cart', []);
    if (q <= 0) {
      carts = carts.filter((c) => Number(c.id) !== cid);
    } else {
      carts = carts.map((c) => (Number(c.id) === cid ? { ...c, quantity: q } : c));
    }
    setWebStorage('cart', carts);
    return true;
  }

  try {
    const db = await getNativeDb();
    if (q <= 0) {
      await db.runAsync('DELETE FROM cart WHERE id = ?', [cid]);
    } else {
      await db.runAsync('UPDATE cart SET quantity = ? WHERE id = ?', [q, cid]);
    }
    return true;
  } catch (error) {
    console.error('Lỗi updateCartQuantity:', error);
    return false;
  }
};

export const checkoutOrder = async (userId: number, total: number, cartItems: CartItem[]): Promise<boolean> => {
  const uid = Number(userId);
  const time = new Date().toLocaleString('vi-VN');

  if (Platform.OS === 'web') {
    const orders: Order[] = getWebStorage('orders', []);
    const newOrderId = Date.now();
    const items: OrderItem[] = cartItems.map((c) => ({
      id: Date.now() + Math.random(),
      orderId: newOrderId,
      productName: c.name,
      price: Number(c.price),
      quantity: Number(c.quantity),
    }));
    orders.unshift({ id: newOrderId, userId: uid, total: Number(total), createdAt: time, items });
    setWebStorage('orders', orders);

    let carts: any[] = getWebStorage('cart', []);
    setWebStorage('cart', carts.filter((c) => Number(c.userId) !== uid));
    return true;
  }

  try {
    const db = await getNativeDb();
    const res = await db.runAsync('INSERT INTO orders (userId, total, createdAt) VALUES (?, ?, ?)', [uid, Number(total), time]);
    const orderId = res.lastInsertRowId;
    for (const it of cartItems) {
      await db.runAsync(
        'INSERT INTO order_items (orderId, productName, price, quantity) VALUES (?, ?, ?, ?)',
        [orderId, it.name, Number(it.price), Number(it.quantity)]
      );
    }
    await db.runAsync('DELETE FROM cart WHERE userId = ?', [uid]);
    return true;
  } catch (e) {
    console.error('Lỗi checkoutOrder:', e);
    return false;
  }
};

export const fetchOrderHistory = async (userId: number): Promise<Order[]> => {
  const uid = Number(userId);
  if (isNaN(uid)) return [];

  if (Platform.OS === 'web') {
    const orders: Order[] = getWebStorage('orders', []);
    return orders.filter((o) => Number(o.userId) === uid);
  }

  try {
    const db = await getNativeDb();
    const orders = await db.getAllAsync<Order>(
      'SELECT * FROM orders WHERE userId = ? ORDER BY id DESC',
      [uid]
    );
    for (const o of orders) {
      o.items = await db.getAllAsync<OrderItem>(
        'SELECT * FROM order_items WHERE orderId = ?',
        [o.id]
      );
    }
    return orders || [];
  } catch (error) {
    console.error('Lỗi fetchOrderHistory:', error);
    return [];
  }
};