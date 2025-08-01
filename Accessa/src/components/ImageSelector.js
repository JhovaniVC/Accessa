import React, { useState, useEffect } from 'react';
import { View, Button, Image, StyleSheet, Text, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function ImageSelector({ onImageSelected, selectedImage, ref }) {
  const [localSelectedImage, setLocalSelectedImage] = useState(selectedImage);

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
      const imageUri = result.assets[0].uri;
      setLocalSelectedImage(imageUri);
      if (onImageSelected) {
        onImageSelected(imageUri);
      }
    }
  };

  const removeImage = () => {
    setLocalSelectedImage(null);
    if (onImageSelected) {
      onImageSelected(null);
    }
  };

  // Actualizar imagen local cuando cambia la prop
  useEffect(() => {
    setLocalSelectedImage(selectedImage);
  }, [selectedImage]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selecciona una imagen</Text>
      <Button title="Elegir imagen" onPress={pickImage} color="#499FE9" />
      
      {localSelectedImage && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: localSelectedImage }} style={styles.image} />
          <Button title="Eliminar imagen" onPress={removeImage} color="#FF4444" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    marginBottom: 12,
  },
  imageContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  image: {
    width: 250,
    height: 200,
    marginBottom: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ccc',
  },
});

