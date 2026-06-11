import React, { useState } from 'react';
import { Box, Button, Divider, List, ListItem, ListItemButton, ListItemText, Typography, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';

const HistorySidebar = ({
                            conversations,
                            currentConversationId,
                            onSelectConversation,
                            onNewConversation
                        }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredConversations = conversations.filter(conv =>
        conv.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Button
                variant="contained"
                startIcon={<AddIcon />}
                fullWidth
                onClick={onNewConversation}
                sx={{
                    mb: 2,
                    borderRadius: '10px',
                    textTransform: 'none',
                    fontWeight: 600,
                    py: 1,
                }}
            >
                Nouvelle conversation
            </Button>

            <Divider sx={{ my: 1.5 }} />

            <Box sx={{ position: 'relative', mb: 2 }}>
                <SearchIcon sx={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 20, color: 'text.secondary' }} />
                <TextField
                    size="small"
                    placeholder="Rechercher..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            pl: 4,
                            borderRadius: '10px',
                        }
                    }}
                    fullWidth
                />
            </Box>

            <Typography variant="caption" color="text.secondary" sx={{ mb: 1, px: 1 }}>
                Historique ({filteredConversations.length})
            </Typography>

            <List sx={{ flex: 1, overflowY: 'auto' }}>
                {filteredConversations.map((conv) => (
                    <ListItem key={conv.id} disablePadding>
                        <ListItemButton
                            selected={conv.id === currentConversationId}
                            onClick={() => onSelectConversation(conv.id)}
                            sx={{
                                borderRadius: '8px',
                                marginBottom: '2px',
                            }}
                        >
                            <ListItemText
                                primary={conv.title}
                                secondary={`${conv.messages.length} message${conv.messages.length > 1 ? 's' : ''}`}
                                primaryTypographyProps={{
                                    noWrap: true,
                                    sx: { fontWeight: conv.id === currentConversationId ? 600 : 400 }
                                }}
                            />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default HistorySidebar;