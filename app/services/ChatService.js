class ChatService {
    static chats = [];
    static subscribers = [];

    static startChatWithUser(user) {
        // Check if a chat with this user already exists
        const existingChat = this.chats.find(chat => chat.id === user.id);
        if (existingChat) {
            return; // Don't create a duplicate chat
        }

        const newChat = {
            id: user.id,
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
        return () => {
            this.subscribers = this.subscribers.filter(cb => cb !== callback);
        };
    }

    static notify() {
        this.subscribers.forEach(callback => callback(this.chats));
    }
}

export default ChatService;