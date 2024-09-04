import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, SafeAreaView } from 'react-native';
import ChatService from '../services/ChatService'; // Adjust the import path as needed

export default function MessagesScreen() {
    const [chats, setChats] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        setChats(ChatService.getChats()); // Load chats on component mount
    }, []);

    const filteredChats = chats.filter(chat =>
        chat.userName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const renderChat = ({ item }) => (
        <TouchableOpacity style={styles.chatItem}>
            <Text style={styles.chatName}>{item.userName}</Text>
            <Text style={styles.lastMessage}>{item.lastMessage}</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <TextInput
                placeholder="Search..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={styles.searchBar}
                placeholderTextColor="#4A90E2"  // Light blue placeholder text color
            />
            <FlatList
                data={filteredChats}
                renderItem={renderChat}
                keyExtractor={(item) => item.id.toString()}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#162238',  // Dark navy blue background
        padding: 10,
    },
    searchBar: {
        padding: 10,
        margin: 10,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#4A90E2',  // Light blue border
        backgroundColor: '#1E2F47',  // Slightly lighter blue for contrast
        color: '#FFFFFF',  // White text color
    },
    chatItem: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#4A90E2',  // Light blue line
    },
    chatName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',  // White text color
    },
    lastMessage: {
        fontSize: 14,
        color: '#CCCCCC',  // Light gray for less important text
    },
});
