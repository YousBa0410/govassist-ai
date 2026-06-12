// ChatInterface.jsx
import React, { useEffect, useRef, useState } from 'react';
import { useMCP } from '../hooks/useMCP';
import Message from './Message';
import { Box, Button, CircularProgress, Fade, IconButton, TextField, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import MicIcon from '@mui/icons-material/Mic';
import { styled } from '@mui/material/styles';

const StyledTextField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        borderRadius: '28px',
        backgroundColor: theme.palette.mode === 'dark' ? '#2f2f2f' : '#f7f7f8',
        transition: 'all 0.2s ease',
        '& fieldset': {
            borderColor: 'transparent',
            transition: 'border-color 0.2s ease',
        },
        '&:hover fieldset': {
            borderColor: theme.palette.divider,
        },
        '&.Mui-focused fieldset': {
            borderColor: theme.palette.primary.main,
            borderWidth: '1px',
        },
    },
    '& .MuiInputBase-root': {
        paddingRight: '8px',
    },
    '& .MuiInputBase-input': {
        padding: '12px 16px',
        fontSize: '1rem',
        lineHeight: 1.5,
    },
}));

const StyledButton = styled(Button)(({ theme }) => ({
    borderRadius: '28px',
    minWidth: '40px',
    width: '40px',
    height: '40px',
    padding: 0,
    backgroundColor: theme.palette.primary.main,
    '&:hover': {
        backgroundColor: theme.palette.primary.dark,
    },
    '&.Mui-disabled': {
        backgroundColor: theme.palette.action.disabledBackground,
    },
}));

const WelcomeContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    textAlign: 'center',
    padding: theme.spacing(4),
}));

const ChatInterface = ({conversationId, conversations, setConversations, onConversationChange}) => {
    const [inputMessage, setInputMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const { callMCP, isLoading, error, toolExecution, clearError } = useMCP();
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const currentConversation = conversations.find(conv => conv.id === conversationId);
    const messages = currentConversation?.messages || [];

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isTyping]);

    useEffect(() => {
        if (!isLoading && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isLoading]);

    const createNewConversation = (title = 'Nouvelle conversation') => {
        const newId = Date.now().toString();
        const newConversation = {
            id: newId,
            title: title,
            messages: [],
            createdAt: new Date()
        };
        setConversations(prev => [newConversation, ...prev]);

        if (onConversationChange) {
            onConversationChange(newId);
        }

        return newId;
    };

    const handleSend = async () => {
        if (!inputMessage.trim() || isLoading) return;

        let activeConversationId = conversationId;

        if (!activeConversationId || !currentConversation) {
            activeConversationId = createNewConversation(inputMessage.slice(0, 30));
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        const userMessage = {
            id: Date.now(),
            role: 'user',
            content: inputMessage,
            timestamp: new Date(),
        };

        setConversations(prev =>
            prev.map(conv => {
                if (conv.id === activeConversationId) {
                    return {
                        ...conv,
                        messages: [...conv.messages, userMessage],
                        title: conv.messages.length === 0 ? inputMessage.slice(0, 30) : conv.title,
                    };
                }
                return conv;
            })
        );

        const sentMessage = inputMessage;
        setInputMessage('');
        setIsTyping(true);

        const response = await callMCP(sentMessage, activeConversationId);
        setIsTyping(false);

        if (response) {
            const assistantMessage = {
                id: Date.now() + 1,
                role: 'assistant',
                content: response.answer || "Je n'ai pas pu traiter votre demande.",
                timestamp: new Date(),
                toolUsed: response.tool_used,
                hasError: Boolean(response.error),
                metadata: response.metadata || response.data || null,
            };

            setConversations(prev =>
                prev.map(conv => {
                    if (conv.id === activeConversationId) {
                        return {
                            ...conv,
                            messages: [...conv.messages, assistantMessage],
                        };
                    }
                    return conv;
                })
            );
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };


    // Écran d'accueil
    if (!currentConversation || messages.length === 0) {
        return (
            <WelcomeContainer>
                <Fade in timeout={500}>
                    <Box>
                        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
                            🇨🇮 eGov Assistant
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 500 }}>
                            Posez vos questions sur les services gouvernementaux.
                        </Typography>

                        <Box sx={{ position: 'relative', width: '100%', maxWidth: 700, mx: 'auto' }}>
                            <StyledTextField
                                fullWidth
                                placeholder="Posez votre question en français ou en anglais..."
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                disabled={isLoading}
                                multiline
                                maxRows={5}
                                inputRef={inputRef}
                            />
                            <Box sx={{ position: 'absolute', right: 8, bottom: 8 }}>
                                <StyledButton
                                    onClick={handleSend}
                                    disabled={isLoading || !inputMessage.trim()}
                                >
                                    {isLoading ? <CircularProgress size={20} /> : <SendIcon fontSize="small" />}
                                </StyledButton>
                            </Box>
                        </Box>

                        <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                            💡 Essayez: "Prépare ma déclaration TVA" ou "Vérifie les échéances fiscales"
                        </Typography>
                    </Box>
                </Fade>
            </WelcomeContainer>
        );
    }

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            bgcolor: 'background.default'
        }}>
            <Box sx={{
                flex: 1,
                overflowY: 'auto',
                py: 4,
                px: { xs: 2, md: 4 }
            }}>
                <Box sx={{ maxWidth: 800, mx: 'auto' }}>
                    {error && (
                        <Box sx={{ mb: 2, p: 2, bgcolor: 'error.light', borderRadius: 2 }}>
                            <Typography color="error">{error}</Typography>
                        </Box>
                    )}

                    {messages.map((msg, index) => (
                        <Message key={msg.id || index} message={msg} />
                    ))}

                    {isTyping && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, color: 'text.secondary' }}>
                            <div className="typing-indicator">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                            <Typography variant="body2">L'assistant réfléchit...</Typography>
                        </Box>
                    )}

                    {toolExecution && toolExecution.status !== 'success' && (
                        <Box sx={{ mb: 2, p: 2, bgcolor: 'info.light', borderRadius: 2 }}>
                            <Typography variant="body2">⚙️ Exécution de l'outil: {toolExecution.tool_name}</Typography>
                        </Box>
                    )}

                    <div ref={messagesEndRef} />
                </Box>
            </Box>

            {/* Zone de saisie - Fixe en bas */}
            <Box sx={{
                p: 2,
                pb: 3,
                borderTop: 1,
                borderColor: 'divider',
                bgcolor: 'background.paper'
            }}>
                <Box sx={{ maxWidth: 800, mx: 'auto', position: 'relative' }}>
                    <StyledTextField
                        fullWidth
                        placeholder="Posez votre question..."
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={isLoading}
                        multiline
                        maxRows={5}
                        inputRef={inputRef}
                    />
                    <Box sx={{ position: 'absolute', right: 8, bottom: 8, display: 'flex', gap: 1 }}>
                        <IconButton size="small" sx={{ color: 'text.secondary' }}>
                            <AttachFileIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" sx={{ color: 'text.secondary' }}>
                            <MicIcon fontSize="small" />
                        </IconButton>
                        <StyledButton onClick={handleSend} disabled={isLoading || !inputMessage.trim()}>
                            {isLoading ? <CircularProgress size={20} /> : <SendIcon fontSize="small" />}
                        </StyledButton>
                    </Box>
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1.5, textAlign: 'center', display: 'block' }}>
                    ⚡ eGov Assistant peut faire des erreurs. Vérifiez les informations importantes.
                </Typography>
            </Box>
        </Box>
    );
};

export default ChatInterface;