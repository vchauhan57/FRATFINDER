import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1D3D47'
    },
    card: {
        width: 300,
        height: 400,
        borderRadius: 8,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 20
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10
    },
    bio: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center'
    }
});

const ProfileCard = () => {
    return (
        <View style={styles.card}>
            <Image style={styles.image} source={require('./kendrick.jpg')} />
            <Text style={styles.name}>Kendrick</Text>
            <Text style={styles.bio}>Engineering Major at XYZ University. Enjoys hiking and outdoor activities.</Text>
        </View>
    );
};

export default function App() {
    return (
        <View style={styles.container}>
            <ProfileCard />
        </View>
    );
}