import React from 'react';
import { Alert, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const ErrorDisplay = ({ error, onDismiss }) => {
    return (
        <Alert
            severity="error"
            action={
                <IconButton aria-label="close" color="inherit" size="small" onClick={onDismiss}>
                    <CloseIcon fontSize="inherit" />
                </IconButton>
            }
            sx={{ mb: 2 }}
        >
            {error}
        </Alert>
    );
};

export default ErrorDisplay;