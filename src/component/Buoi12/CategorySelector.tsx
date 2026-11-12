import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function CategorySelector({ categories, selectedId, onSelect }: any) {
  return (
    <View style={styles.container}>
      {categories.map((cat: any) => {
        const isSelected = cat.id === selectedId;
        return (
          <TouchableOpacity
            key={cat.id}
            style={[styles.btn, isSelected && styles.btnActive]}
            onPress={() => onSelect(cat.id)}
          >
            <Text style={[styles.text, isSelected && styles.textActive]}>
              {cat.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginVertical: 10 },
  btn: { paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#eee', borderRadius: 16 },
  btnActive: { backgroundColor: '#007AFF' },
  text: { color: '#333' },
  textActive: { color: '#fff', fontWeight: 'bold' },
});