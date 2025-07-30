import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Menu, Button } from 'react-native-paper';
import { Colors } from '../themes/colors'; // Usa tu archivo de colores

export default function Picker({ label, options, selectedValue, onSelect }) {
  const [visible, setVisible] = useState(false);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

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
            {selectedValue || 'Selecciona una opción...'}
          </Button>
        }
      >
        {options.map((option, index) => (
          <Menu.Item
            key={index}
            onPress={() => {
              onSelect(option);
              closeMenu();
            }}
            title={option}
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
