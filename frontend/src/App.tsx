// App.js
import React, { useState, useEffect } from 'react';
import {Box, Paper } from '@mui/material';
import HistorySidebar from './components/HistorySidebar';
import ChatInterface from './components/ChatInterface';

const App = () => {
    const [conversations, setConversations] = useState(() => {
        const saved = localStorage.getItem('conversations');
        if (saved && JSON.parse(saved).length > 0) {
            const parsed = JSON.parse(saved);
            return parsed.map((conv: { messages: any[]; }) => ({
                ...conv,
                messages: conv.messages.map(msg => ({
                    ...msg,
                    timestamp: new Date(msg.timestamp)
                }))
            }));
        }
        return [{
            id: 'default',
            title: 'Nouvelle conversation',
            messages: [],
            createdAt: new Date()
        }];
    });

    const [currentConversationId, setCurrentConversationId] = useState(() => {
        const saved = localStorage.getItem('conversations');
        if (saved && JSON.parse(saved).length > 0) {
            return JSON.parse(saved)[0].id;
        }
        return 'default';
    });

    useEffect(() => {
        if (conversations.length > 0) {
            localStorage.setItem('conversations', JSON.stringify(conversations));
        }
    }, [conversations]);

    const handleNewConversation = () => {
        const newConversation = {
            id: Date.now().toString(),
            title: 'Nouvelle conversation',
            messages: [],
            createdAt: new Date()
        };
        setConversations((prev: any) => [newConversation, ...prev]);
        setCurrentConversationId(newConversation.id);
    };

    const handleConversationChange = (newId: any) => {
        setCurrentConversationId(newId);
    };

    return (
        <Box sx={{ height: '100vh', display: 'flex', overflow: 'hidden' }}>
            {/* Sidebar - Fixe à gauche */}
            <Box sx={{
                width: 260,
                flexShrink: 0,
                borderRight: 1,
                borderColor: 'divider',
                bgcolor: 'background.paper',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
            }}>
                <Paper sx={{ height: '100%', p: 2, overflow: 'auto', borderRadius: 0, boxShadow: 'none' }}>
                    <HistorySidebar
                        conversations={conversations}
                        currentConversationId={currentConversationId}
                        onSelectConversation={setCurrentConversationId}
                        onNewConversation={handleNewConversation}
                    />
                </Paper>
            </Box>

            {/* Zone de chat principale */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <ChatInterface
                    conversationId={currentConversationId}
                    conversations={conversations}
                    setConversations={setConversations}
                    onConversationChange={handleConversationChange}
                />
            </Box>
        </Box>
    );
};

export default App;