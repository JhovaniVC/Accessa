import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Menu } from 'react-native-paper';
import { Colors } from '../themes/colors';
import { MaterialIcons } from '@expo/vector-icons';

export default function Picker({ label, options, selectedValue, onSelect }) {
  const [visible, setVisible] = useState(false);
  const [menuWidth, setMenuWidth] = useState(null);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View
        onLayout={(event) => {
          const width = event.nativeEvent.layout.width;
          setMenuWidth(width);
        }}
      >
        <Menu
          visible={visible}
          onDismiss={closeMenu}
          anchor={
            <TouchableOpacity style={styles.selector} onPress={openMenu}>
              <Text style={selectedValue ? styles.value : styles.placeholder}>
                {selectedValue || 'Seleccionar'}
              </Text>
              <MaterialIcons name="arrow-drop-down" size={24} color={Colors.gray} />
            </TouchableOpacity>
          }
          style={{ width: menuWidth }} // Aplica el mismo ancho del input
        >
          {options.map((option, index) => (
            <Menu.Item
              key={index}
              onPress={() => {
                onSelect(option);
                closeMenu();
              }}
              title={option}
            />
          ))}
        </Menu>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
    color: Colors.textPrimary,
  },
  selector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    padding: 14,
    backgroundColor: Colors.card,
  },
  placeholder: {
    fontSize: 15,
    color: Colors.gray,
  },
  value: {
    fontSize: 15,
    color: Colors.textPrimary,
  },
});
