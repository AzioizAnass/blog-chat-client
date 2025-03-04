import React, { useEffect, useState, useRef } from 'react';
import Navbar from '../components/NavBar.tsx';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import type {Message,Conversation} from '../types/chat.d.ts'
import type {User} from '../types/auth.d.ts'
import {useUserInfo} from '../services/auth/authService.ts'



const Chat: React.FC = () => {
    const [stompClient, setStompClient] = useState<Client | null>(null);
    const [connectedUsers, setConnectedUsers] = useState<string[]>([]);
    const [selectedUser, setSelectedUser] = useState<string | null>(null);
    const [conversations, setConversations] = useState<Record<string, Conversation>>({});
    const [messageInput, setMessageInput] = useState('');
    const [isConnecting, setIsConnecting] = useState(false);
    const messageAreaRef = useRef<HTMLDivElement>(null);
    const token = localStorage.getItem("token")
    const [user,setUser] = useState<User>(useUserInfo(token)) ;  

    
    const handlePublicMessage = (message: any) => {
        try {
            const payload = JSON.parse(message.body);
            console.log('Public message received:', payload);

            console.log('Message type:', payload.type);
            console.log('Message content:', payload.content);

            if (payload.type === 'JOIN') {
                console.log('JOIN message received from:', payload.sender);
                setConnectedUsers(prev => {
                    if (!prev.includes(payload.sender) && payload.sender !== user?.data.username) {
                        return [...prev, payload.sender];
                    }
                    return prev;
                });
            } 
            else if (payload.type === 'LEAVE') {
                console.log('LEAVE message received from:', payload.sender);
                setConnectedUsers(prev => prev.filter(u => u !== payload.sender));
            }
            else if (payload.type === 'USERS_LIST') {
                console.log('USERS_LIST received:', payload.content);
                const usersList = typeof payload.content === 'string' 
                    ? payload.content.split(',') 
                    : payload.content;
                
                const filteredUsers = usersList.filter((u: string) => u && u !== user?.data.username);
                console.log('Filtered users list:', filteredUsers);
                setConnectedUsers(filteredUsers);
            }
        } catch (error) {
            console.error('Error handling public message:', error);
            console.log('Raw message:', message);
        }
    };

    const handlePrivateMessage = (message: any) => {
        try {
            const payload: Message = JSON.parse(message.body);
            console.log('Private message received:', payload);
            
            const otherUser = payload.sender === user?.data.username ? payload.recipient : payload.sender;

            console.log("payload : " +JSON.stringify(payload))

            setConversations(prev => ({
                ...prev,
                [otherUser]: {
                    messages: [...(prev[otherUser]?.messages || []), payload]
                }
            }));
        } catch (error) {
            console.error('Error handling private message:', error);
        }
    };

    const connect = () => {
        console.log("user : "+ JSON.stringify(user))
        if (!user?.data.username || isConnecting) return;

        setIsConnecting(true);
        const client = new Client({
            webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
            debug: (str) => {
                console.log('STOMP Debug:', str);
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            onConnect: () => {
                console.log('Successfully connected to WebSocket!');
                
                client.subscribe('/topic/public', handlePublicMessage);
                console.log('Subscribed to public topic');
                
                client.subscribe(`/user/${user.data.username}/topic/private`, handlePrivateMessage);
                console.log('Subscribed to private topic');

                client.publish({
                    destination: '/app/chat.addUser',
                    body: JSON.stringify({
                        sender: user.data.username,
                        type: 'JOIN'
                    })
                });

                setIsConnecting(false);
            },
            onDisconnect: () => {
                console.log('Disconnected from WebSocket');
                setIsConnecting(false);
            },
            onStompError: (frame) => {
                console.error('STOMP error:', frame);
                setIsConnecting(false);
            }
        });

        console.log('Activating STOMP client');
        client.activate();
        setStompClient(client);
    };
    const [firstTime,setFirstTime] = useState<boolean>(true)
    
    useEffect(() => {
        if (user?.data.username && !stompClient && !isConnecting && firstTime) {
            setFirstTime(false)
            connect();
            
        }

        return () => {
            if (stompClient?.active) {
                console.log('Cleaning up WebSocket connection');
                stompClient.publish({
                    destination: '/app/chat.removeUser',
                    body: JSON.stringify({
                        sender: user?.data.username,
                        type: 'LEAVE'
                    })
                });
                stompClient.deactivate();
            }
        };
    }, [user?.data.username]);

    const sendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (messageInput.trim() && selectedUser && stompClient?.active) {
            console.log('Sending message to:', selectedUser);
            const chatMessage = {
                sender: user?.data.username,
                recipient: selectedUser,
                content: messageInput.trim(),
                type: 'CHAT'
            };

            stompClient.publish({
                destination: '/app/chat.sendMessage',
                body: JSON.stringify(chatMessage)
            });

            setMessageInput('');
        }
    };

    useEffect(() => {
        if (messageAreaRef.current) {
            messageAreaRef.current.scrollTop = messageAreaRef.current.scrollHeight;
        }
    }, [conversations, selectedUser]);

    return (
        <div className="chat-page">
            <Navbar />
            <div className="chat-container">
                 
                    <div className="chat-layout">
                        <div className="users-list">
                            <h2>Utilisateurs en ligne ({connectedUsers.length})</h2>
                            <div className="debug-info">
                                {isConnecting && <p>Connexion en cours...</p>}
                                {!stompClient?.active && !isConnecting && (
                                    <button onClick={connect}>Reconnecter</button>
                                )}
                            </div>
                            {connectedUsers.length === 0 ? (
                                <p className="no-users">Aucun utilisateur en ligne</p>
                            ) : (
                                connectedUsers.map(username => (
                                    <div
                                        key={username}
                                        className={`user-item ${selectedUser === username ? 'active' : ''}`}
                                        onClick={() => setSelectedUser(username)}
                                    >
                                        {username}
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="chat-area">
                            {!selectedUser ? (
                                <div className="no-chat-selected">
                                    <p>Sélectionnez un utilisateur pour commencer à chatter</p>
                                </div>
                            ) : (
                                <>
                                    <div className="chat-header">
                                        <h3>Chat avec {selectedUser}</h3>
                                    </div>
                                    <div className="message-area" ref={messageAreaRef}>
                                        {conversations[selectedUser]?.messages.map((msg, index) => (
                                            <div
                                                key={index}
                                                className={`message ${msg.sender === user?.data.username ? 'sent' : 'received'}`}
                                            >
                                                <div className="message-content">{msg.content}</div>
                                            </div>
                                        ))}
                                    </div>
                                    <form onSubmit={sendMessage} className="message-form">
                                        <input
                                            type="text"
                                            value={messageInput}
                                            onChange={(e) => setMessageInput(e.target.value)}
                                            placeholder="Écrivez votre message..."
                                            className="message-input"
                                        />
                                        <button type="submit" className="send-button">
                                            Envoyer
                                        </button>
                                    </form>
                                </>
                            )}
                        </div>
                    </div>
            </div>
        </div>
    );
};

export default Chat;
