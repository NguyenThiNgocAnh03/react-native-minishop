
import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';

interface Student {
  id: number;
  name: string;
  age: number;
  grade: number;
}

const QuanLySinhVien1 = () => {
  const [students] = useState<Student[]>([
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
  ]);

  return (
    <View
      style={{ flex: 1,padding: 10,paddingTop: 300,backgroundColor: 'white',}}>
      {/* Tiêu đề */}
      <Text
        style={{
          fontSize: 22,
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: 20,      }}
      >
        QUẢN LÝ SINH VIÊN
      </Text>

      {/* Bảng sinh viên */}
      <ScrollView>
        {/* Hàng tiêu đề */}
        <View style={{ flexDirection: 'row' }}>
          <Text style={{ width: 45,  padding: 8, borderWidth: 1,textAlign: 'center',fontWeight: 'bold',}}>
            STT
          </Text>

          <Text
            style={{flex: 1,padding: 8,borderWidth: 1,textAlign: 'center',fontWeight: 'bold',}}>
            Họ tên
          </Text>

          <Text
            style={{ width: 55,padding: 8,borderWidth: 1,textAlign: 'center',fontWeight: 'bold',
              }}
          >
            Tuổi
          </Text>

          <Text style={{width: 55,padding: 8,borderWidth: 1,textAlign: 'center',fontWeight: 'bold',
            }}
          >
            Điểm
          </Text>
        </View>

        {/* Duyệt danh sách sinh viên bằng map() */}
        {students.map((student, index) => (
          <View
            key={student.id}
            style={{
              flexDirection: 'row',
            }}
          >
            <Text style={{width: 45,padding: 8,borderWidth: 1,textAlign: 'center',
              }}>
              {index + 1}
            </Text>

            <Text
              style={{flex: 1,padding: 8,borderWidth: 1,}} >
              {student.name}
            </Text>

            <Text
              style={{width: 55,padding: 8,borderWidth: 1,textAlign: 'center',}}>
              {student.age}
            </Text>

            <Text
              style={{width: 55,padding: 8,borderWidth: 1,textAlign: 'center',}}>
              {student.grade}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default QuanLySinhVien1;
