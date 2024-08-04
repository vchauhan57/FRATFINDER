import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#172A45'
    },
    card: {
        width: 300,
        height: 400,
        borderRadius: 8,
        backgroundColor: '#A67C00',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 15
    },
    image: {
        width: 250,
        height: 250,
        borderRadius: 75,
        marginBottom: 20
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#FFFFFF'
    },
    bio: {
        fontSize: 16,
        color: '#FFFFFF',
        textAlign: 'center'
    },
    header: {
        fontSize: 40,
        color: '#A67C00',
        fontWeight: 'bold',
        marginBottom: 80
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
            <Text style={styles.header}>FratFinder</Text>
            <ProfileCard />
        </View>
    );
}
