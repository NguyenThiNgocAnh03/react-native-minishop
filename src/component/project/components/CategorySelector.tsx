import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Category } from '../database/db';

interface Props {
  categories: Category[];
  selectedId: number | null;
  onSelect: (id: number | null) => void;
}

export default function CategorySelector({ categories, selectedId, onSelect }: Props) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0 }}>
      {categories.map((c) => (
        <TouchableOpacity
          key={c.id}
          style={[styles.item, selectedId === c.id && styles.active]}
          onPress={() => onSelect(c.id)}
        >
          <Text style={[styles.text, selectedId === c.id && styles.activeText]}>{c.name}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  item: { paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#EEE', borderRadius: 16, marginRight: 6 },
  active: { backgroundColor: '#007ACC' },
  text: { color: '#333', fontSize: 13 },
  activeText: { color: '#FFF', fontWeight: 'bold' },
});