import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import {
    Box,
    Paper,
    Typography,
    Avatar,
    IconButton,
    Collapse
} from '@mui/material';
import { deepPurple, grey } from '@mui/material/colors';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from '@mui/material/styles';

const MessagePaper = styled(Paper)(({ theme, isuser }) => ({
    padding: theme.spacing(2),
    borderRadius: isuser === 'true'
        ? '20px 20px 4px 20px'
        : '20px 20px 20px 4px',
    backgroundColor: isuser === 'true'
        ? theme.palette.primary.main
        : theme.palette.mode === 'dark'
            ? '#2f2f2f'
            : '#ffffff',
    color: isuser === 'true'
        ? '#ffffff'
        : theme.palette.text.primary,
    boxShadow: isuser === 'true'
        ? 'none'
        : '0 1px 2px rgba(0,0,0,0.05)',
    border: isuser === 'true'
        ? 'none'
        : `1px solid ${theme.palette.divider}`,
}));

const ToolUsageBadge = styled(Box)(({ theme }) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: theme.spacing(0.5),
    padding: `${theme.spacing(0.5)} ${theme.spacing(1)}`,
    backgroundColor: theme.palette.mode === 'dark'
        ? '#2f2f2f'
        : '#f0f0f0',
    borderRadius: '12px',
    fontSize: '0.75rem',
    marginTop: theme.spacing(1),
}));

const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';

    const date = timestamp instanceof Date
        ? timestamp
        : new Date(timestamp);

    if (isNaN(date.getTime())) return '';

    return date.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
    });
};

const Message = ({ message }) => {

    const isUser = message.role === 'user';

    // 🔥 FIX IMPORTANT : erreur uniquement si booléen explicite
    const hasError = Boolean(message.hasError);

    const [copied, setCopied] = useState(false);
    const [showDetails, setShowDetails] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(message.content || '');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const formattedTime = formatTimestamp(message.timestamp);

    return (
        <Box sx={{
            display: 'flex',
            mb: 3,
            justifyContent: isUser ? 'flex-end' : 'flex-start'
        }}>
            <Box sx={{
                display: 'flex',
                gap: 2,
                maxWidth: '85%',
                width: '100%'
            }}>

                {!isUser && (
                    <Avatar sx={{
                        bgcolor: deepPurple[600],
                        width: 36,
                        height: 36,
                        flexShrink: 0
                    }}>
                        AI
                    </Avatar>
                )}

                <Box sx={{ flex: 1 }}>
                    <MessagePaper isuser={isUser.toString()}>

                        {/* MESSAGE CONTENT */}
                        <Box sx={{
                            '& pre': {
                                overflow: 'auto',
                                bgcolor: 'action.hover',
                                p: 2,
                                borderRadius: 1,
                                fontSize: '0.875rem',
                            },
                            '& code': {
                                bgcolor: 'action.hover',
                                px: 0.5,
                                py: 0.25,
                                borderRadius: 0.5,
                                fontSize: '0.875rem',
                            },
                            '& p': {
                                margin: 0,
                                '&:not(:last-child)': { mb: 1 }
                            },
                        }}>
                            <ReactMarkdown>
                                {message.content || ''}
                            </ReactMarkdown>
                        </Box>

                        {/* TOOL BADGE */}
                        {message.toolUsed?.length > 0 && !hasError && (
                            <ToolUsageBadge>
                                <span>⚙️</span>
                                <span>
                                    Outil utilisé: {message.toolUsed}
                                </span>

                                <IconButton
                                    size="small"
                                    onClick={() => setShowDetails(!showDetails)}
                                    sx={{ p: 0.5 }}
                                >
                                    <ExpandMoreIcon
                                        sx={{
                                            transform: showDetails
                                                ? 'rotate(180deg)'
                                                : 'none',
                                            transition: '0.2s'
                                        }}
                                    />
                                </IconButton>
                            </ToolUsageBadge>
                        )}

                        {/* ERROR BADGE (FIX IMPORTANT) */}
                        {hasError === true && (
                            <ToolUsageBadge
                                sx={{
                                    bgcolor: 'error.light',
                                    color: 'error.contrastText'
                                }}
                            >
                                <span>⚠️</span>
                                <span>Erreur lors de l'exécution</span>
                            </ToolUsageBadge>
                        )}

                        {/* DETAILS */}
                        <Collapse in={showDetails} timeout="auto" unmountOnExit>
                            {message.metadata && (
                                <Box sx={{
                                    mt: 2,
                                    p: 1.5,
                                    bgcolor: 'action.hover',
                                    borderRadius: 1
                                }}>
                                    <Typography
                                        variant="caption"
                                        component="pre"
                                        sx={{
                                            whiteSpace: 'pre-wrap',
                                            m: 0
                                        }}
                                    >
                                        {JSON.stringify(message.metadata, null, 2)}
                                    </Typography>
                                </Box>
                            )}
                        </Collapse>

                        {/* FOOTER */}
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mt: 1
                        }}>
                            <Typography variant="caption" sx={{ opacity: 0.6 }}>
                                {formattedTime}
                            </Typography>

                            {!isUser && (
                                <Box sx={{ display: 'flex', gap: 0.5 }}>
                                    <IconButton size="small" onClick={handleCopy}>
                                        <ContentCopyIcon fontSize="small" />
                                    </IconButton>

                                    <IconButton size="small">
                                        <ThumbUpOffAltIcon fontSize="small" />
                                    </IconButton>

                                    <IconButton size="small">
                                        <ThumbDownOffAltIcon fontSize="small" />
                                    </IconButton>
                                </Box>
                            )}
                        </Box>

                    </MessagePaper>
                </Box>

                {isUser && (
                    <Avatar sx={{
                        bgcolor: grey[500],
                        width: 36,
                        height: 36,
                        flexShrink: 0
                    }}>
                        U
                    </Avatar>
                )}

            </Box>
        </Box>
    );
};

export default Message;