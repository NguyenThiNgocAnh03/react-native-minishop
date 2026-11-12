import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Alert,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';

interface Student {
  id: number;
  name: string;
  age: number;
  grade: number;
};

const QuanLySinhVien2 = () => {
  const [students, setStudents] = useState([
    { id: 1, name: 'Nguyễn Văn An', age: 19, grade: 8.5 },
    { id: 2, name: 'Trần Thị Bình', age: 17, grade: 7.2 },
    { id: 3, name: 'Lê Hoàng Cường', age: 20, grade: 9.0 },
    { id: 4, name: 'Phạm Minh Đức', age: 18, grade: 6.5 },
    { id: 5, name: 'Vũ Thị Hoa', age: 21, grade: 8.2 },
    { id: 6, name: 'Nguyễn Thị Lan', age: 22, grade: 7.8 },
    { id: 7, name: 'Trần Văn Hùng', age: 19, grade: 8.9 },
    { id: 8, name: 'Lê Thị Mai', age: 20, grade: 6.7 },
    { id: 9, name: 'Phạm Văn Long', age: 18, grade: 9.1 },
    { id: 10, name: 'Vũ Thị Hạnh', age: 21, grade: 7.5 },
    { id: 11, name: 'Nguyễn Văn Bình', age: 19, grade: 8.0 },
    { id: 12, name: 'Trần Thị Dung', age: 17, grade: 7.5 },
    { id: 13, name: 'Lê Hoàng Nam', age: 20, grade: 9.2 },
    { id: 14, name: 'Phạm Minh Huy', age: 18, grade: 6.8 },
    { id: 15, name: 'Vũ Thị Lan', age: 21, grade: 8.3 },
    { id: 16, name: 'Nguyễn Thị Hồng', age: 22, grade: 7.9 },
    { id: 17, name: 'Trần Văn Quang', age: 19, grade: 8.7 },
    { id: 18, name: 'Lê Thị Hạnh', age: 20, grade: 6.9 },
    { id: 19, name: 'Phạm Văn Sơn', age: 18, grade: 9.3 },
    { id: 20, name: 'Vũ Thị Mai', age: 21, grade: 7.6 },
  ]);

  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [grade, setGrade] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);

  // Chọn sinh viên để sửa
  const handleEdit = (student: Student) => {
    setEditingId(student.id);
    setName(student.name);
    setAge(student.age.toString());
    setGrade(student.grade.toString());
  };

  // Hủy sửa
  const handleCancel = () => {
    setEditingId(null);
    setName('');
    setAge('');
    setGrade('');
  };
 
  // Xóa sinh viên
  const handleDeleteStudent = (id: number) => {
    Alert.alert('Xác nhận', 'Bạn có chắc chắn muốn xóa sinh viên này?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: () => {
          setStudents((prev) => prev.filter((s) => s.id !== id));
          if (editingId === id) {
            handleCancel();
          }
          Alert.alert('Thành công', 'Đã xóa sinh viên!');
        },
      },
    ]);
  };

  // Cập nhật sinh viên
  const handleUpdateStudent = () => {
    const studentName = name.trim();
    const studentAge = Number(age);
    const studentGrade = Number(grade);

    if (studentName === '' || age.trim() === '' || grade.trim() === '') {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin sinh viên.');
      return;
    }

    if (
      !Number.isInteger(studentAge) ||
      studentAge <= 0 ||
      !Number.isFinite(studentGrade) ||
      studentGrade < 0 ||
      studentGrade > 10
    ) {
      Alert.alert('Lỗi', 'Tuổi phải là số nguyên > 0 và điểm phải từ 0 đến 10.');
      return;
    }

    if (
      students.some(
        (s) => s.id !== editingId && s.name.toLowerCase() === studentName.toLowerCase()
      )
    ) {
      Alert.alert('Lỗi', 'Sinh viên đã tồn tại trong danh sách.');
      return;
    }

    setStudents((prev) =>
      prev.map((s) =>
        s.id === editingId
          ? { ...s, name: studentName, age: studentAge, grade: studentGrade }
          : s
      )
    );

    handleCancel();
    Alert.alert('Thành công', 'Đã cập nhật sinh viên!');
  };

  // Thêm sinh viên
  const handleaddStudent = () => {
    const studentName = name.trim();
    const studentAge = Number(age);
    const studentGrade = Number(grade);

    if (studentName === '' || age.trim() === '' || grade.trim() === '') {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin sinh viên.');
      return;
    }

    if (
      !Number.isInteger(studentAge) ||
      studentAge <= 0 ||
      !Number.isFinite(studentGrade) ||
      studentGrade < 0 ||
      studentGrade > 10
    ) {
      Alert.alert('Lỗi', 'Tuổi phải là số nguyên > 0 và điểm phải từ 0 đến 10.');
      return;
    }

    if (students.some((s) => s.name.toLowerCase() === studentName.toLowerCase())) {
      Alert.alert('Lỗi', 'Sinh viên đã tồn tại trong danh sách.');
      return;
    }

    const newStudent: Student = {
      id: Date.now(),
      name: studentName,
      age: studentAge,
      grade: studentGrade,
    };

    setStudents((prev) => [newStudent, ...prev]);
    setName('');
    setAge('');
    setGrade('');
    Alert.alert('Thành công', 'Đã thêm sinh viên!');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>QUẢN LÝ SINH VIÊN</Text>

      {/* Form nhập thông tin */}
      <TextInput
        placeholder="Nhập họ tên"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="Nhập tuổi"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        placeholder="Nhập điểm (0 - 10)"
        value={grade}
        onChangeText={setGrade}
        keyboardType="decimal-pad"
        style={styles.input}
      />

      {/* Nút hành động */}
      {editingId ? (
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 15 }}>
          <TouchableOpacity
            onPress={handleUpdateStudent}
            style={[styles.btn, { flex: 1, backgroundColor: 'green' }]}
          >
            <Text style={styles.btnText}>Cập nhật</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleCancel}
            style={[styles.btn, { flex: 1, backgroundColor: 'gray' }]}
          >
            <Text style={styles.btnText}>Hủy</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          onPress={handleaddStudent}
          style={[styles.btn, { backgroundColor: 'blue', marginBottom: 15 }]}
        >
          <Text style={styles.btnText}>Thêm sinh viên</Text>
        </TouchableOpacity>
      )}

      {/* Bảng danh sách */}
      <FlatList
        data={students}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item: student, index }) => (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={[styles.cell, { width: 34 }]}>{index + 1}</Text>
            <Text style={[styles.cell, { flex: 1, textAlign: 'left', paddingHorizontal: 6 }]}>
              {student.name}
            </Text>
            <Text style={[styles.cell, { width: 50 }]}>{student.age}</Text>
            <Text style={[styles.cell, { width: 50 }]}>{student.grade}</Text>
            <View style={[styles.cell, { width: 84, flexDirection: 'row', gap: 3, padding: 3 }]}>
              <TouchableOpacity
                onPress={() => handleEdit(student)}
                style={[styles.actionBtn, { backgroundColor: '#f0ad4e' }]}
              >
                <Text style={styles.actionBtnText}>Sửa</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDeleteStudent(student.id)}
                style={[styles.actionBtn, { backgroundColor: '#d9534f' }]}
              >
                <Text style={styles.actionBtnText}>Xóa</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListHeaderComponent={() => (
          <View style={{ flexDirection: 'row' }}>
            <Text style={[styles.cell, styles.headerCell, { width: 34 }]}>STT</Text>
            <Text style={[styles.cell, styles.headerCell, { flex: 1 }]}>Họ tên</Text>
            <Text style={[styles.cell, styles.headerCell, { width: 50 }]}>Tuổi</Text>
            <Text style={[styles.cell, styles.headerCell, { width: 50 }]}>Điểm</Text>
            <Text style={[styles.cell, styles.headerCell, { width: 84 }]}>Tác vụ</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    paddingTop: 45,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 9,
    marginBottom: 8,
    borderRadius: 5,
  },
  btn: {
    padding: 11,
    borderRadius: 5,
    alignItems: 'center',
  },
  btnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,
  },
  cell: {
    paddingVertical: 7,
    paddingHorizontal: 2,
    borderWidth: 1,
    borderColor: '#ccc',
    textAlign: 'center',
    fontSize: 13,
  },
  headerCell: {
    fontWeight: 'bold',
    backgroundColor: '#eee',
    borderColor: '#999',
    fontSize: 13,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 5,
    borderRadius: 3,
    alignItems: 'center',
  },
  actionBtnText: {
    color: 'white',
    fontSize: 11,
    fontWeight: 'bold',
  },
});

export default QuanLySinhVien2;