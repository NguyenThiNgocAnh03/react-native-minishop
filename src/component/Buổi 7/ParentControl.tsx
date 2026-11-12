import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import LightControl from './LightControl';

const BIRTH_MONTH = 6;

export default function ParentControl() {
  const [isOn, setIsOn] = useState(false);
  const [brightness, setBrightness] = useState(0);

  const toggleLight = () => {
    setIsOn((previous) => !previous);
  };

  const increaseBrightness = () => {
    if (!isOn) return;

    if (brightness >= 100) {
      alert("Độ sáng đã đạt mức tối đa 100%!");
      return;
    }

    setBrightness((previous) => {
      const nextVal = previous + BIRTH_MONTH;
      if (nextVal > 100) {
        alert("Độ sáng không được quá 100%!");
        return 100;
      }
      return nextVal;
    });
  };

  const decreaseBrightness = () => {
    if (!isOn) return;

    if (brightness <= 0) {
      alert("Độ sáng đã ở mức tối thiểu 0%!");
      return;
    }

    setBrightness((previous) => {
      const nextVal = previous - BIRTH_MONTH;
      if (nextVal < 0) {
        alert("Độ sáng không được nhỏ hơn 0%!");
        return 0;
      }
      return nextVal;
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>
        HỆ THỐNG ĐIỀU KHIỂN ĐÈN THÔNG MINH
      </Text>

      <Text style={styles.info}>
        SVTH: Nguyễn Thị Ngọc Anh
      </Text>

      <Text style={styles.info}>
        Ngày sinh: 03/06/2003
      </Text>

      {/* COMPONENT CHA */}
      <View style={styles.parentBox}>
        <Text style={styles.parentTitle}>
          ===== COMPONENT CHA =====
        </Text>

        <Text style={styles.label}>Trạng thái đèn:</Text>

        <Text
          style={[styles.status,{ color: isOn ? 'green' : 'red' },
          ]} > {isOn ? 'ĐANG BẬT' : 'ĐANG TẮT'}
        </Text>

        <Text style={styles.label}>
          Độ sáng hiện tại: {brightness}%
        </Text>

        {/* BÓNG ĐÈN THƯ VIỆN - SÁNG RÕ THEO ĐỘ SÁNG */}
        <View
          style={[
            styles.bulbCircle,
            {
              backgroundColor: isOn
                ? `rgba(255, 215, 0, ${Math.max(0.15, brightness / 100)})`
                : '#D9DDE3',
            },
          ]}
        >
          <MaterialCommunityIcons
            name={isOn ? "lightbulb-on" : "lightbulb-outline"}
            size={52}
            color={isOn ? "#FFC107" : "#757575"}
            style={{
              opacity: isOn ? Math.max(0.3, brightness / 100) : 0.5,
              transform: [{ scale: isOn ? 0.6 + (brightness / 100) * 0.25 : 0.8 }],
            }}
          />

          <Text style={styles.bulbLabel}>
            {isOn ? `Đèn sáng ${brightness}%` : 'Đèn đang tối'}
          </Text>
        </View>

        {/* ĐIỀU KHIỂN TỪ COMPONENT CHA */}
        <Text style={styles.controlTitle}>
          Điều khiển từ component cha
        </Text>

        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: isOn ? '#E53935' : '#2E7D32' },
          ]}
          onPress={toggleLight}
        >
          <Text style={styles.buttonText}>
            {isOn ? 'Tắt đèn từ cha' : 'Bật đèn từ cha'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            styles.increaseButton,
            { opacity: isOn ? 1 : 0.4 },
          ]}
          onPress={increaseBrightness}
          disabled={!isOn}
        >
          <Text style={styles.buttonText}>
            Tăng độ sáng từ cha
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            styles.decreaseButton,
            { opacity: isOn ? 1 : 0.4 },
          ]}
          onPress={decreaseBrightness}
          disabled={!isOn}
        >
          <Text style={styles.buttonText}>
            Giảm độ sáng từ cha
          </Text>
        </TouchableOpacity>
      </View>

      {/* TRUYỀN DỮ LIỆU XUỐNG COMPONENT CON BẰNG PROPS */}
      <LightControl
        isOn={isOn}
        brightness={brightness}
        onToggle={toggleLight}
        onIncrease={increaseBrightness}
        onDecrease={decreaseBrightness}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 25,
  },
  title: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#1565C0',
    textAlign: 'center',
    marginBottom: 12,
  },
  info: {
    fontSize: 14,
    color: '#111',
    marginBottom: 5,
  },
  parentBox: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#448AFF',
    borderRadius: 10,
    padding: 12,
    marginTop: 8,
  },
  parentTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1565C0',
    textAlign: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    color: '#222',
    marginBottom: 7,
  },
  status: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  bulbCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 1,
    borderColor: '#448AFF',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  bulbLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#222',
    marginTop: 4,
  },
  controlTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
    color: '#1565C0',
  },
  button: {
    padding: 11,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 8,
  },
  increaseButton: {
    backgroundColor: '#1565C0',
  },
  decreaseButton: {
    backgroundColor: '#EF6C00',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 13,
  },
});