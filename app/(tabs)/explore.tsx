import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, SafeAreaView } from 'react-native';
import ChatService from '../services/ChatService';

export default function MessagesScreen() {
    const [chats, setChats] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        ChatService.subscribe(setChats);
        return () => {
            ChatService.unsubscribe(setChats); // Cleanup subscription on unmount
        };
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
        padding: 10,
    },
    searchBar: {
        padding: 10,
        margin: 10,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    chatItem: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    chatName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    lastMessage: {
        fontSize: 14,
        color: '#666',
    },
});
