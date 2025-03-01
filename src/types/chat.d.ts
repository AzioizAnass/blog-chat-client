export interface Message {
    sender: string;
    recipient: string;
    content: string;
    type: 'CHAT' | 'JOIN' | 'LEAVE' | 'USERS_LIST';
}

export interface Conversation {
    messages: Message[];
}
