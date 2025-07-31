// BitacoraPaqueteriaScreen.js
import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Colors } from '../../../themes/colors';

export default function BitacoraAccesosScreen() {
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Nueva entrada de paquetería</Text>

            <View style={styles.card}>
                <Text style={styles.label}>Fecha y hora:</Text>
                <Text style={styles.subtext}>09:10 a.m - 16/06/25</Text>

                <Text style={styles.label}>¿Quién entrega?</Text>
                <TextInput style={styles.input} placeholder="Nombre de quien entrega" placeholderTextColor="#aaa" />

                <Text style={styles.label}>Paquetería:</Text>
                <TextInput style={styles.input} placeholder="Ej. DHL, FedEx" placeholderTextColor="#aaa" />

                <Text style={styles.label}>Departamento:</Text>
                <TextInput style={styles.input} placeholder="Ej. 201, 3B..." placeholderTextColor="#aaa" />

                <Text style={styles.label}>¿Quién recibe?</Text>
                <TextInput style={styles.input} placeholder="Nombre de quien recibe" placeholderTextColor="#aaa" />

                <Text style={styles.label}>Descripción:</Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Contenido del paquete"
                    placeholderTextColor="#aaa"
                    multiline
                    numberOfLines={4}
                />

                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Guardar</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#F4F6F8',
        padding: 20,
        marginBottom: 100
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 20,
        textAlign: 'center',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 4,
        marginBottom: 100
    },
    label: {
        color: '#374151',
        fontSize: 14,
        fontWeight: '600',
        marginTop: 15,
        marginBottom: 5,
    },
    subtext: {
        fontSize: 13,
        color: '#6B7280',
        marginBottom: 10,
    },
    input: {
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 8,
        padding: 12,
        fontSize: 14,
        color: '#111827',
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    button: {
        backgroundColor: '#3B82F6',
        paddingVertical: 14,
        borderRadius: 8,
        marginTop: 25,
        
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 15,
    },
});
