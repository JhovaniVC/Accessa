import React, { useState } from 'react';
import { View, Button, Image, StyleSheet, Text, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function ImageSelector({ onImageSelected }) {
  const [selectedImage, setSelectedImage] = useState(null);

  const pickImage = async () => {
    // Solicita permisos de galería
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Se necesita acceso a la galería para seleccionar una imagen.');
      return;
    }

    // Abre el selector de imágenes
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,       // permite recorte
      aspect: [4, 3],            // relación de aspecto
      quality: 1,                // calidad máxima
    });

    // Si el usuario no canceló, guarda la imagen
    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      if (onImageSelected) {
        onImageSelected(result.assets[0].uri);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selecciona una imagen</Text>
      <Button title="Elegir imagen" onPress={pickImage} color="#499FE9" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    marginBottom:20,
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    marginBottom: 12,
  },
  image: {
    width: 250,
    height: 200,
    marginTop: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ccc',
  },
});
