import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface LightControlProps {
  isOn: boolean;
  brightness: number;
  onToggle: () => void;
  onIncrease: () => void;
  onDecrease: () => void;
}

export default function LightControl({
  isOn,
  brightness,
  onToggle,
  onIncrease,
  onDecrease,
}: LightControlProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        ===== COMPONENT CON =====
      </Text>

      <Text style={styles.label}>
        Trạng thái nhận được:
      </Text>

      <Text
        style={[
          styles.status,
          { color: isOn ? 'green' : 'red' },
        ]}
      >
        {isOn ? 'ĐANG BẬT' : 'ĐANG TẮT'}
      </Text>

      <Text style={styles.label}>
        Độ sáng nhận được: {brightness}%
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
          size={58}
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

      {/* ĐIỀU KHIỂN TỪ COMPONENT CON */}
      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: isOn ? '#E53935' : '#2E7D32' },
        ]}
        onPress={onToggle}
      >
        <Text style={styles.buttonText}>
          {isOn ? 'Tắt đèn' : 'Bật đèn'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.button,
          styles.increaseButton,
          { opacity: isOn ? 1 : 0.4 },
        ]}
        onPress={onIncrease}
        disabled={!isOn}
      >
        <Text style={styles.buttonText}>
          Tăng độ sáng
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.button,
          styles.decreaseButton,
          { opacity: isOn ? 1 : 0.4 },
        ]}
        onPress={onDecrease}
        disabled={!isOn}
      >
        <Text style={styles.buttonText}>
          Giảm độ sáng
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#FFB52E',
    borderRadius: 10,
    padding: 12,
    marginTop: 14,
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#EF6C00',
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
    width: 125,
    height: 125,
    borderRadius: 63,
    borderWidth: 1,
    borderColor: '#FFB300',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  bulbLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#222',
    marginTop: 4,
  },
  button: {
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 9,
  },
  increaseButton: {
    backgroundColor: '#1565C0',
  },
  decreaseButton: {
    backgroundColor: '#EF6C00',
  },
  buttonText: {
    color: 'white',
    fontSize: 13,
    fontWeight: 'bold',
  },
});