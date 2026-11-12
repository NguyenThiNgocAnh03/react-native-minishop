import { Platform } from 'react-native';
import * as SQLite from 'expo-sqlite';

// ==========================================
// 1. TYPES CỐT LÕI (THEO ĐÚNG BAREM)
// ==========================================
export type Category = { id: number; name: string };
export type Product = { id: number; name: string; price: number; img: string; categoryId: number };
export type User = { id: number; username: string; password: string; role: string };
export type CartItem = { id: number; userId: number; productId: number; quantity: number; name: string; price: number; img: string };
export type OrderItem = { 
  id: number; 
  orderId: number; 
  productName: string; 
  price: number; 
  quantity: number; 
  img?: string; 
};

export type OrderStatus = 'pending' | 'approved' | 'rejected';

export type Order = {
  id: number;
  userId: number;
  customerName?: string;
  phone?: string;
  address?: string;
  total: number;
  createdAt: string;
  status?: OrderStatus;
  items?: OrderItem[];
};

// ==========================================
// 2. DỮ LIỆU BAN ĐẦU
// ==========================================
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

const getWeb = (key: string, def: any) => {
  if (typeof window === 'undefined') return def;
  try {
    const d = localStorage.getItem(`pj_${key}`);
    return d ? JSON.parse(d) : def;
  } catch { return def; }
};

const setWeb = (key: string, val: any) => {
  if (typeof window !== 'undefined') localStorage.setItem(`pj_${key}`, JSON.stringify(val));
};

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;
const getNativeDb = async () => {
  if (!dbPromise) dbPromise = SQLite.openDatabaseAsync('projectApp.db');
  return dbPromise;
};

// ==========================================
// 3. KHỞI TẠO CƠ SỞ DỮ LIỆU
// ==========================================
export const initDatabase = async (): Promise<void> => {
  try {
    if (Platform.OS === 'web') {
      if (!localStorage.getItem('pj_inited')) {
        setWeb('categories', initialCategories);
        setWeb('products', initialProducts);
        setWeb('users', initialUsers);
        setWeb('cart', []);
        setWeb('orders', []);
        localStorage.setItem('pj_inited', '1');
      }
      return;
    }

    const db = await getNativeDb();
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        name TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        name TEXT NOT NULL, 
        price REAL NOT NULL, 
        img TEXT, 
        categoryId INTEGER
      );
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        username TEXT UNIQUE NOT NULL, 
        password TEXT NOT NULL, 
        role TEXT DEFAULT 'user'
      );
      CREATE TABLE IF NOT EXISTS cart (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        userId INTEGER NOT NULL, 
        productId INTEGER NOT NULL, 
        quantity INTEGER DEFAULT 1
      );
      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        userId INTEGER NOT NULL, 
        customerName TEXT,
        phone TEXT,
        address TEXT,
        total REAL NOT NULL, 
        createdAt TEXT NOT NULL,
        status TEXT DEFAULT 'pending'
      );
      CREATE TABLE IF NOT EXISTS order_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        orderId INTEGER NOT NULL, 
        productName TEXT NOT NULL, 
        price REAL NOT NULL, 
        quantity INTEGER NOT NULL,
        img TEXT
      );
    `);

    try { await db.execAsync('ALTER TABLE orders ADD COLUMN status TEXT DEFAULT "pending";'); } catch {}
    try { await db.execAsync('ALTER TABLE orders ADD COLUMN customerName TEXT;'); } catch {}
    try { await db.execAsync('ALTER TABLE orders ADD COLUMN phone TEXT;'); } catch {}
    try { await db.execAsync('ALTER TABLE orders ADD COLUMN address TEXT;'); } catch {}
    try { await db.execAsync('ALTER TABLE order_items ADD COLUMN img TEXT;'); } catch {}

    for (const c of initialCategories) {
      await db.runAsync('INSERT OR IGNORE INTO categories (id, name) VALUES (?, ?)', [c.id, c.name]);
    }
    for (const p of initialProducts) {
      await db.runAsync('INSERT OR IGNORE INTO products (id, name, price, img, categoryId) VALUES (?, ?, ?, ?, ?)', [p.id, p.name, p.price, p.img, p.categoryId]);
    }

    await db.runAsync(`INSERT INTO users (username, password, role) SELECT 'admin', '123', 'admin' WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'admin')`);
    await db.runAsync(`INSERT INTO users (username, password, role) SELECT 'user1', '123', 'user' WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'user1')`);
  } catch (e) {
    console.error('initDatabase error:', e);
  }
};

// ==========================================
// 4. QUẢN LÝ LOẠI SẢN PHẨM (CATEGORIES)
// ==========================================
export const fetchCategories = async (): Promise<Category[]> => {
  if (Platform.OS === 'web') return getWeb('categories', initialCategories);
  try {
    const db = await getNativeDb();
    return (await db.getAllAsync<Category>('SELECT * FROM categories')) || [];
  } catch { return []; }
};

export const addCategory = async (name: string): Promise<boolean> => {
  const clean = name.trim();
  if (!clean) return false;
  if (Platform.OS === 'web') {
    const list = getWeb('categories', initialCategories);
    list.push({ id: Date.now(), name: clean });
    setWeb('categories', list);
    return true;
  }
  try {
    const db = await getNativeDb();
    await db.runAsync('INSERT INTO categories (name) VALUES (?)', [clean]);
    return true;
  } catch { return false; }
};

export const updateCategory = async (id: number, name: string): Promise<boolean> => {
  const clean = name.trim();
  if (Platform.OS === 'web') {
    const list = getWeb('categories', initialCategories);
    setWeb('categories', list.map((c: any) => (Number(c.id) === Number(id) ? { ...c, name: clean } : c)));
    return true;
  }
  try {
    const db = await getNativeDb();
    await db.runAsync('UPDATE categories SET name = ? WHERE id = ?', [clean, Number(id)]);
    return true;
  } catch { return false; }
};

export const deleteCategory = async (id: number): Promise<boolean> => {
  if (Platform.OS === 'web') {
    const list = getWeb('categories', initialCategories);
    setWeb('categories', list.filter((c: any) => Number(c.id) !== Number(id)));
    return true;
  }
  try {
    const db = await getNativeDb();
    await db.runAsync('DELETE FROM categories WHERE id = ?', [Number(id)]);
    return true;
  } catch { return false; }
};

// ==========================================
// 5. QUẢN LÝ SẢN PHẨM (PRODUCTS)
// ==========================================
export const fetchProducts = async (): Promise<Product[]> => {
  if (Platform.OS === 'web') return getWeb('products', initialProducts);
  try {
    const db = await getNativeDb();
    return (await db.getAllAsync<Product>('SELECT * FROM products')) || [];
  } catch { return []; }
};

export const addProduct = async (p: Omit<Product, 'id'>) => {
  if (Platform.OS === 'web') {
    const list = getWeb('products', initialProducts);
    list.push({ id: Date.now(), ...p, price: Number(p.price), categoryId: Number(p.categoryId) });
    setWeb('products', list);
    return;
  }
  try {
    const db = await getNativeDb();
    await db.runAsync('INSERT INTO products (name, price, img, categoryId) VALUES (?, ?, ?, ?)', [p.name.trim(), Number(p.price), p.img.trim(), Number(p.categoryId)]);
  } catch (e) { console.error(e); }
};

export const updateProduct = async (p: Product) => {
  if (Platform.OS === 'web') {
    const list = getWeb('products', initialProducts);
    setWeb('products', list.map((x: any) => (Number(x.id) === Number(p.id) ? { ...p, price: Number(p.price) } : x)));
    return;
  }
  try {
    const db = await getNativeDb();
    await db.runAsync('UPDATE products SET name = ?, price = ?, categoryId = ?, img = ? WHERE id = ?', [p.name.trim(), Number(p.price), Number(p.categoryId), p.img.trim(), Number(p.id)]);
  } catch (e) { console.error(e); }
};

export const deleteProduct = async (id: number) => {
  if (Platform.OS === 'web') {
    const list = getWeb('products', initialProducts);
    setWeb('products', list.filter((x: any) => Number(x.id) !== Number(id)));
    return;
  }
  try {
    const db = await getNativeDb();
    await db.runAsync('DELETE FROM products WHERE id = ?', [Number(id)]);
  } catch (e) { console.error(e); }
};

// ==========================================
// 6. QUẢN LÝ USER: XEM, ĐỔI VAI TRÒ, XÓA
// ==========================================
export const fetchUsers = async (): Promise<User[]> => {
  if (Platform.OS === 'web') return getWeb('users', initialUsers);
  try {
    const db = await getNativeDb();
    return (await db.getAllAsync<User>('SELECT * FROM users')) || [];
  } catch { return []; }
};

export const addUser = async (u: string, p: string, role = 'user'): Promise<boolean> => {
  const cleanU = String(u).trim();
  const cleanP = String(p).trim();
  if (!cleanU || !cleanP) return false;

  if (Platform.OS === 'web') {
    const list = getWeb('users', initialUsers);
    if (list.some((x: any) => String(x.username).trim().toLowerCase() === cleanU.toLowerCase())) return false;
    list.push({ id: Date.now(), username: cleanU, password: cleanP, role });
    setWeb('users', list);
    return true;
  }
  try {
    const db = await getNativeDb();
    await db.runAsync('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', [cleanU, cleanP, role]);
    return true;
  } catch { return false; }
};

export const updateUserRole = async (userId: number, currentRole: string): Promise<boolean> => {
  const newRole = currentRole === 'admin' ? 'user' : 'admin';
  const uid = Number(userId);

  if (Platform.OS === 'web') {
    const list = getWeb('users', initialUsers);
    setWeb('users', list.map((u: any) => (Number(u.id) === uid ? { ...u, role: newRole } : u)));
    return true;
  }
  try {
    const db = await getNativeDb();
    await db.runAsync('UPDATE users SET role = ? WHERE id = ?', [newRole, uid]);
    return true;
  } catch { return false; }
};

export const deleteUser = async (id: number): Promise<boolean> => {
  const uid = Number(id);
  if (Platform.OS === 'web') {
    const list = getWeb('users', initialUsers);
    setWeb('users', list.filter((x: any) => Number(x.id) !== uid));
    return true;
  }
  try {
    const db = await getNativeDb();
    await db.runAsync('DELETE FROM users WHERE id = ?', [uid]);
    return true;
  } catch { return false; }
};



export const getUserByCredentials = async (u: string, p: string): Promise<User | null> => {
  const cleanU = String(u).trim();
  const cleanP = String(p).trim();
  if (Platform.OS === 'web') {
    const list = getWeb('users', initialUsers);
    return list.find((x: any) => 
      String(x.username).trim().toLowerCase() === cleanU.toLowerCase() && 
      String(x.password).trim() === cleanP
    ) || null;
  }
  try {
    const db = await getNativeDb();
    return (await db.getFirstAsync<User>(
      'SELECT * FROM users WHERE LOWER(TRIM(username)) = LOWER(?) AND TRIM(password) = ?', 
      [cleanU, cleanP]
    )) || null;
  } catch { return null; }
};

// ==========================================
// 7. GIỎ HÀNG (CART)
// ==========================================
export const fetchCart = async (userId: number): Promise<CartItem[]> => {
  const uid = Number(userId);
  if (isNaN(uid)) return [];
  if (Platform.OS === 'web') {
    const carts = getWeb('cart', []);
    const prods = getWeb('products', initialProducts);
    return carts.filter((c: any) => Number(c.userId) === uid).map((c: any) => {
      const p = prods.find((x: any) => Number(x.id) === Number(c.productId)) || { name: 'SP', price: 0, img: '' };
      return { id: c.id, userId: Number(c.userId), productId: Number(c.productId), quantity: Number(c.quantity), name: p.name, price: Number(p.price), img: p.img };
    });
  }
  try {
    const db = await getNativeDb();
    return (await db.getAllAsync<CartItem>(`SELECT c.id, c.userId, c.productId, c.quantity, p.name, p.price, p.img FROM cart c JOIN products p ON c.productId = p.id WHERE c.userId = ?`, [uid])) || [];
  } catch { return []; }
};

export const addToCart = async (userId: number, productId: number): Promise<boolean> => {
  const uid = Number(userId);
  const pid = Number(productId);
  if (isNaN(uid) || isNaN(pid)) return false;
  if (Platform.OS === 'web') {
    const carts = getWeb('cart', []);
    const ex = carts.find((c: any) => Number(c.userId) === uid && Number(c.productId) === pid);
    if (ex) ex.quantity = Number(ex.quantity) + 1;
    else carts.push({ id: Date.now(), userId: uid, productId: pid, quantity: 1 });
    setWeb('cart', carts);
    return true;
  }
  try {
    const db = await getNativeDb();
    const ex = await db.getFirstAsync<any>('SELECT * FROM cart WHERE userId = ? AND productId = ?', [uid, pid]);
    if (ex) await db.runAsync('UPDATE cart SET quantity = quantity + 1 WHERE id = ?', [ex.id]);
    else await db.runAsync('INSERT INTO cart (userId, productId, quantity) VALUES (?, ?, 1)', [uid, pid]);
    return true;
  } catch { return false; }
};

export const updateCartQuantity = async (cartId: number, qty: number): Promise<boolean> => {
  const cid = Number(cartId);
  const q = Number(qty);
  if (Platform.OS === 'web') {
    let carts = getWeb('cart', []);
    if (q <= 0) carts = carts.filter((c: any) => Number(c.id) !== cid);
    else carts = carts.map((c: any) => (Number(c.id) === cid ? { ...c, quantity: q } : c));
    setWeb('cart', carts);
    return true;
  }
  try {
    const db = await getNativeDb();
    if (q <= 0) await db.runAsync('DELETE FROM cart WHERE id = ?', [cid]);
    else await db.runAsync('UPDATE cart SET quantity = ? WHERE id = ?', [q, cid]);
    return true;
  } catch { return false; }
};

// ==========================================
// 8. ĐƠN HÀNG, CHECKOUT & DUYỆT TÌNH TRẠNG
// ==========================================
export const checkoutOrder = async (
  userId: number,
  total: number,
  cartItems: CartItem[],
  customerInfo?: { customerName: string; phone: string; address: string }
): Promise<boolean> => {
  const uid = Number(userId);
  const time = new Date().toLocaleString('vi-VN');
  const cName = customerInfo?.customerName || 'Khách hàng';
  const cPhone = customerInfo?.phone || '';
  const cAddress = customerInfo?.address || '';

  if (Platform.OS === 'web') {
    const orders: Order[] = getWeb('orders', []);
    const newOrderId = Date.now();
    const items: OrderItem[] = cartItems.map((c) => ({
      id: Date.now() + Math.random(),
      orderId: newOrderId,
      productName: c.name,
      price: Number(c.price),
      quantity: Number(c.quantity),
      img: c.img || '',
    }));

    orders.unshift({
      id: newOrderId,
      userId: uid,
      customerName: cName,
      phone: cPhone,
      address: cAddress,
      total: Number(total),
      createdAt: time,
      status: 'pending',
      items,
    });
    setWeb('orders', orders);

    let carts = getWeb('cart', []);
    setWeb('cart', carts.filter((c: any) => Number(c.userId) !== uid));
    return true;
  }

  try {
    const db = await getNativeDb();
    const res = await db.runAsync(
      'INSERT INTO orders (userId, customerName, phone, address, total, createdAt, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [uid, cName, cPhone, cAddress, Number(total), time, 'pending']
    );
    const orderId = res.lastInsertRowId;
    for (const it of cartItems) {
      await db.runAsync(
        'INSERT INTO order_items (orderId, productName, price, quantity, img) VALUES (?, ?, ?, ?, ?)',
        [orderId, it.name, Number(it.price), Number(it.quantity), it.img || '']
      );
    }
    await db.runAsync('DELETE FROM cart WHERE userId = ?', [uid]);
    return true;
  } catch (e) {
    console.error('Lỗi checkoutOrder:', e);
    return false;
  }
};

// Hàm cập nhật trạng thái đơn hàng (Dùng chung cho cả Admin duyệt/từ chối và User hủy đơn)
export const updateOrderStatus = async (
  orderId: number,
  status: OrderStatus
): Promise<boolean> => {
  try {
    if (Platform.OS === 'web') {
      const orders: Order[] = getWeb('orders', []);
      const updated = orders.map((o) =>
        Number(o.id) === Number(orderId) ? { ...o, status } : o
      );
      setWeb('orders', updated);
      return true;
    }

    const db = await getNativeDb();
    await db.runAsync('UPDATE orders SET status = ? WHERE id = ?', [
      status,
      Number(orderId),
    ]);
    return true;
  } catch (e) {
    console.error('updateOrderStatus error:', e);
    return false;
  }
};
export const fetchOrderHistory = async (userId: number): Promise<Order[]> => {
  const uid = Number(userId);
  if (isNaN(uid)) return [];
  if (Platform.OS === 'web') {
    const orders: Order[] = getWeb('orders', []);
    return orders.filter((o: any) => Number(o.userId) === uid);
  }
  try {
    const db = await getNativeDb();
    const orders = await db.getAllAsync<Order>('SELECT * FROM orders WHERE userId = ? ORDER BY id DESC', [uid]);
    for (const o of orders) {
      o.items = await db.getAllAsync<OrderItem>('SELECT * FROM order_items WHERE orderId = ?', [o.id]);
    }
    return orders || [];
  } catch { return []; }
};

export const fetchAllOrders = async (): Promise<Order[]> => {
  if (Platform.OS === 'web') {
    const orders: Order[] = getWeb('orders', []);
    return orders;
  }
  try {
    const db = await getNativeDb();
    const orders = await db.getAllAsync<Order>('SELECT * FROM orders ORDER BY id DESC');
    for (const o of orders) {
      o.items = await db.getAllAsync<OrderItem>('SELECT * FROM order_items WHERE orderId = ?', [o.id]);
    }
    return orders || [];
  } catch { return []; }
};

export const updateUser = async (user: User): Promise<boolean> => {
  const cleanU = String(user.username).trim();
  const cleanP = String(user.password).trim();
  const uid = Number(user.id);

  if (!cleanU || !cleanP) return false;

  if (Platform.OS === 'web') {
    const list = getWeb('users', initialUsers);
    setWeb('users', list.map((x: any) => (Number(x.id) === uid ? { ...x, username: cleanU, password: cleanP } : x)));
    return true;
  }
  try {
    const db = await getNativeDb();
    await db.runAsync('UPDATE users SET username = ?, password = ? WHERE id = ?', [cleanU, cleanP, uid]);
    return true;
  } catch (e) {
    console.error('Lỗi updateUser:', e);
    return false;
  }
};