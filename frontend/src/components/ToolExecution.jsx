import React from 'react';
import {Box, Paper, Typography} from '@mui/material';
import {CheckCircle, Error, HourglassEmpty} from '@mui/icons-material';

const ToolExecution = ({ toolName, status, result }) => {
    const getStatusIcon = () => {
        switch (status) {
            case 'success': return <CheckCircle color="success" />;
            case 'error': return <Error color="error" />;
            default: return <HourglassEmpty color="action" />;
        }
    };

    return (
        <Box sx={{ mb: 2 }}>
            <Paper
                sx={{
                    p: 2,
                    bgcolor: status === 'error' ? 'error.light' : 'info.light',
                    borderLeft: `4px solid ${status === 'error' ? '#f44336' : '#2196f3'}`,
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    {getStatusIcon()}
                    <Typography variant="subtitle1" fontWeight="bold">
                        {status === 'error' ? 'Erreur dans l\'outil' : 'Exécution de l\'outil'} : {toolName}
                    </Typography>
                </Box>

                {result && (
                    <Box sx={{ mt: 1, p: 1, bgcolor: 'background.paper', borderRadius: 1 }}>
                        <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
                            {JSON.stringify(result, null, 2)}
                        </Typography>
                    </Box>
                )}
            </Paper>
        </Box>
    );
};

export default ToolExecution;