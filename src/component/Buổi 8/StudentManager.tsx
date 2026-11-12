import React, { useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, StyleSheet } from 'react-native';

interface Student {
  id: number;
  name: string;
  age: number;
  grade: number;
}

// 1. Mảng mẫu ban đầu
const initialStudents: Student[] = [
  { id: 1, name: 'Nguyễn Văn An', age: 19, grade: 8.5 },
  { id: 2, name: 'Trần Thị Bình', age: 17, grade: 7.2 },
  { id: 3, name: 'Lê Hoàng Cường', age: 20, grade: 9.0 },
  { id: 4, name: 'Phạm Minh Đức', age: 18, grade: 6.5 },
  { id: 5, name: 'Vũ Thị Hoa', age: 21, grade: 8.2 },
];

export default function App() {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [grade, setGrade] = useState('');
  const [editId, setEditId] = useState<number | null>(null);

  // Thêm các state điều khiển hiển thị (tránh làm mất mảng gốc)
  const [search, setSearch] = useState('');
  const [filterCondition, setFilterCondition] = useState(false);
  const [sortType, setSortType] = useState<'none' | 'grade' | 'age'>('none');

  // 1 & 2. Thêm mới [...] hoặc Cập nhật theo ID qua map()
  const handleSave = () => {
    if (!name || !age || !grade) return;
    if (editId !== null) {
      setStudents(students.map((s) => s.id === editId ? { ...s, name, age: +age, grade: +grade } : s));
      setEditId(null);
    } else {
      setStudents([...students, { id: Date.now(), name, age: +age, grade: +grade }]);
    }
    setName(''); setAge(''); setGrade('');
  };

  // Nạp thông tin lên ô nhập để chuẩn bị sửa
  const handleEdit = (s: Student) => {
    setEditId(s.id);
    setName(s.name);
    setAge(s.age.toString());
    setGrade(s.grade.toString());
  };

  // 3. Xóa học sinh theo ID bằng filter()
  const handleDelete = (id: number) => {
    setStudents(students.filter((s) => s.id !== id));
    if (editId === id) {
      setEditId(null);
      setName(''); setAge(''); setGrade('');
    }
  };

  // Reset về ban đầu
  const handleReset = () => {
    setStudents(initialStudents);
    setSearch('');
    setFilterCondition(false);
    setSortType('none');
    setEditId(null);
    setName(''); setAge(''); setGrade('');
  };

  // 6. Tính số lượng học sinh có điểm > 8 bằng reduce()
  const countOver8 = students.reduce((sum, s) => (s.grade > 8 ? sum + 1 : sum), 0);

  // 4 & 5. Lọc và Sắp xếp trên danh sách hiển thị
  let displayList = [...students];

  // 4a. Lọc theo tên
  if (search.trim()) {
    displayList = displayList.filter((s) => s.name.toLowerCase().includes(search.toLowerCase().trim()));
  }
  // 4b. Lọc theo điều kiện (Tuổi > 18 hoặc Điểm > 8)
  if (filterCondition) {
    displayList = displayList.filter((s) => s.age > 18 || s.grade > 8);
  }
  // 5. Sắp xếp điểm giảm dần / tuổi tăng dần
  if (sortType === 'grade') displayList.sort((a, b) => b.grade - a.grade);
  if (sortType === 'age') displayList.sort((a, b) => a.age - b.age);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Quản Lý Học Sinh</Text>

      {/* 6. Thống kê số lượng học sinh điểm > 8 (reduce) */}
      <Text style={styles.countText}>
        Số HS có điểm &gt; 8: <Text style={{ fontWeight: 'bold' }}>{countOver8}</Text> / {students.length}
      </Text>

      {/* Form nhập dữ liệu */}
      <TextInput style={styles.input} placeholder="Tên học sinh" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Tuổi" keyboardType="numeric" value={age} onChangeText={setAge} />
      <TextInput style={styles.input} placeholder="Điểm" keyboardType="numeric" value={grade} onChangeText={setGrade} />

      <Button
        title={editId ? '2. LƯU THAY ĐỔI' : '1. THÊM HỌC SINH'}
        color={editId ? '#eab308' : '#2563eb'}
        onPress={handleSave}
      />

      {/* 4. Ô tìm kiếm lọc theo tên */}
      <TextInput
        style={[styles.input, { marginTop: 12 }]}
        placeholder=" 4. Lọc theo tên học sinh..."
        value={search}
        onChangeText={setSearch}
      />

      {/* Bộ nút Lọc & Sắp xếp (Bấm bật / tắt linh hoạt) */}
      <View style={styles.row}>
        <Button
          title={filterCondition ? 'Bỏ Lọc ĐK' : '4. Lọc (>18t / >8đ)'}
          color={filterCondition ? '#7c3aed' : '#8b5cf6'}
          onPress={() => setFilterCondition(!filterCondition)}
        />
        <Button
          title={sortType === 'grade' ? 'Bỏ Xếp Điểm' : '5. Xếp Điểm'}
          color={sortType === 'grade' ? '#0891b2' : '#06b6d4'}
          onPress={() => setSortType(sortType === 'grade' ? 'none' : 'grade')}
        />
        <Button
          title={sortType === 'age' ? 'Bỏ Xếp Tuổi' : '5. Xếp Tuổi'}
          color={sortType === 'age' ? '#0369a1' : '#0284c7'}
          onPress={() => setSortType(sortType === 'age' ? 'none' : 'age')}
        />
        <Button title="Reset" color="gray" onPress={handleReset} />
      </View>

      {/* Danh sách học sinh */}
      {displayList.map((item) => (
        <View key={item.id} style={styles.card}>
          <Text style={styles.cardText}>
            {item.name} - {item.age} tuổi - Điểm: <Text style={{ fontWeight: 'bold' }}>{item.grade}</Text>
          </Text>
          <View style={styles.actions}>
            <Button title="Sửa" color="#eab308" onPress={() => handleEdit(item)} />
            <Button title="Xóa" color="#ef4444" onPress={() => handleDelete(item.id)} />
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingTop: 45 },
  title: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  countText: { fontSize: 15, color: 'green', textAlign: 'center', marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, marginBottom: 8, borderRadius: 5, backgroundColor: '#fff' },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 },
  card: { padding: 10, borderWidth: 1, borderColor: '#ddd', borderRadius: 6, marginBottom: 8, backgroundColor: '#fff' },
  cardText: { fontSize: 14, marginBottom: 6 },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 6 },
});