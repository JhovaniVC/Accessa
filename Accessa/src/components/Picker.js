import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Menu, Button } from 'react-native-paper';
import { Colors } from '../themes/colors'; // Usa tu archivo de colores

export default function Picker({ label, items, selectedValue, onValueChange, placeholder }) {
  const [visible, setVisible] = useState(false);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const handleSelect = (item) => {
    onValueChange(item.value);
    closeMenu();
  };

  const getSelectedLabel = () => {
    if (!selectedValue) return placeholder || 'Selecciona una opción...';
    const selectedItem = items?.find(item => item.value === selectedValue);
    return selectedItem?.label || placeholder || 'Selecciona una opción...';
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <Menu
        visible={visible}
        onDismiss={closeMenu}
        anchor={
          <Button
            mode="outlined"
            onPress={openMenu}
            contentStyle={styles.buttonContent}
            style={styles.button}
            textColor={Colors.textPrimary}
          >
            {getSelectedLabel()}
          </Button>
        }
      >
        {items && items.map((item, index) => (
          <Menu.Item
            key={index}
            onPress={() => handleSelect(item)}
            title={item.label}
            titleStyle={{ color: Colors.textPrimary }}
          />
        ))}
      </Menu>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textSecondary,
    marginBottom: 8,
    marginLeft: 4,
  },
  button: {
    borderColor: Colors.border,
    borderRadius: 8,
    backgroundColor: Colors.card,
  },
  buttonContent: {
    justifyContent: 'space-between',
    height: 48,
  },
});
