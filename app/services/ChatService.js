// Assuming ChatService is a singleton class or similar approach
class ChatService {
    static chats = [];
    static subscribers = [];

    static startChatWithUser(user) {
        const newChat = {
            id: user.id, // Ensure each user has a unique id
            userName: user.name,
            lastMessage: "Say hi!",
        };
        this.chats.push(newChat);
        this.notify();
    }

    static getChats() {
        return this.chats;
    }

    static subscribe(callback) {
        this.subscribers.push(callback);
    }

    static notify() {
        this.subscribers.forEach(callback => callback(this.chats));
    }
}

export default ChatService;
