import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';

interface Student {
  id: number;
  name: string;
  age: number;
  grade: number;
}

const initialStudents: Student[] = [
  { id: 1, name: 'Nguyễn Văn An', age: 19, grade: 8.5 },
  { id: 2, name: 'Trần Thị Bình', age: 17, grade: 7.2 },
  { id: 3, name: 'Lê Hoàng Cường', age: 20, grade: 9.0 },
  { id: 4, name: 'Phạm Minh Đức', age: 18, grade: 6.5 },
  { id: 5, name: 'Vũ Thị Hoa', age: 21, grade: 8.2 },
];

export default function App() {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [filtered, setFiltered] = useState<Student[] | null>(null);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [grade, setGrade] = useState('');
  const [editId, setEditId] = useState<number | null>(null);

  // 1 & 2. Thêm mới hoặc Cập nhật
  const handleSave = () => {
    const a = parseInt(age, 10);
    const g = parseFloat(grade);

    if (!name.trim() || isNaN(a) || isNaN(g) || g < 0 || g > 10) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên, tuổi hợp lệ và điểm từ 0 - 10!');
      return;
    }

    if (editId !== null) {
      setStudents(
        students.map((s) =>
          s.id === editId ? { ...s, name: name.trim(), age: a, grade: g } : s
        )
      );
      setEditId(null);
    } else {
      setStudents([
        ...students,
        { id: Date.now(), name: name.trim(), age: a, grade: g },
      ]);
    }

    setFiltered(null);
    setName('');
    setAge('');
    setGrade('');
  };

  // Chuẩn bị sửa
  const handleEdit = (s: Student) => {
    setEditId(s.id);
    setName(s.name);
    setAge(s.age.toString());
    setGrade(s.grade.toString());
  };

  // 3. Xóa học sinh
  const handleDelete = (id: number) => {
    setStudents(students.filter((s) => s.id !== id));
    setFiltered(null);
    if (editId === id) {
      setEditId(null);
      setName('');
      setAge('');
      setGrade('');
    }
  };

  // 4. Lọc học sinh (không làm mất dữ liệu gốc)
  const handleFilter = () => {
    const res = name.trim()
      ? students.filter((s) =>
          s.name.toLowerCase().includes(name.trim().toLowerCase())
        )
      : students.filter((s) => s.age > 18 || s.grade > 8);
    setFiltered(res);
  };

  // 5. Sắp xếp
  const handleSortGrade = () => {
    const list = [...(filtered ?? students)].sort((a, b) => b.grade - a.grade);
    if (filtered) setFiltered(list);
    else setStudents(list);
  };

  const handleSortAge = () => {
    const list = [...(filtered ?? students)].sort((a, b) => a.age - b.age);
    if (filtered) setFiltered(list);
    else setStudents(list);
  };

  // Reset về ban đầu
  const handleReset = () => {
    setStudents(initialStudents);
    setFiltered(null);
    setEditId(null);
    setName('');
    setAge('');
    setGrade('');
  };

  const displayList = filtered ?? students;
  const countOver8 = students.reduce(
    (sum, s) => (s.grade > 8 ? sum + 1 : sum),
    0
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Quản Lý Học Sinh</Text>

      {/* 6. Thống kê reduce() */}
      <Text style={styles.countText}>
        Số HS điểm &gt; 8: <Text style={{ fontWeight: 'bold' }}>{countOver8}</Text> / {students.length}
      </Text>

      {/* Form nhập liệu */}
      <TextInput
        style={styles.input}
        placeholder="Tên học sinh (hoặc từ khóa lọc)"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Tuổi"
        keyboardType="numeric"
        value={age}
        onChangeText={setAge}
      />
      <TextInput
        style={styles.input}
        placeholder="Điểm (0 - 10)"
        keyboardType="numeric"
        value={grade}
        onChangeText={setGrade}
      />

      <Button
        title={editId !== null ? 'LƯU THAY ĐỔI' : 'THÊM HỌC SINH'}
        color={editId !== null ? '#eab308' : '#2563eb'}
        onPress={handleSave}
      />

      {/* Bộ nút chức năng */}
      <View style={styles.row}>
        <Button title="Lọc" color="#8b5cf6" onPress={handleFilter} />
        <Button title="Xếp Điểm" color="#06b6d4" onPress={handleSortGrade} />
        <Button title="Xếp Tuổi" color="#0284c7" onPress={handleSortAge} />
        <Button title="Reset" color="gray" onPress={handleReset} />
      </View>

      {/* Danh sách học sinh */}
      {displayList.map((item) => (
        <View key={item.id} style={styles.card}>
          <Text style={styles.cardText}>
            {item.name} - {item.age} tuổi - Điểm: {item.grade}
          </Text>
          <View style={styles.actions}>
            <Button
              title="Sửa"
              color="#eab308"
              onPress={() => handleEdit(item)}
            />
            <Button
              title="Xóa"
              color="#ef4444"
              onPress={() => handleDelete(item.id)}
            />
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingTop: 45,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  countText: {
    fontSize: 15,
    color: 'green',
    textAlign: 'center',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 8,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  card: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  cardText: {
    fontSize: 14,
    marginBottom: 6,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 6,
  },
});