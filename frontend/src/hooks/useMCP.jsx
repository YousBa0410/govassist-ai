import {useState} from 'react';

const BACKEND_URL = process.env.REACT_APP_API_URL;

const originalConsoleError = console.error;
console.error = (...args) => {
    if (args[0]?.includes?.('port closed') || args[0]?.includes?.('message port')) {
        return;
    }
    originalConsoleError(...args);
};

export const useMCP = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [toolExecution, setToolExecution] = useState(null);

    const callMCP = async (message, conversationId) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`${BACKEND_URL}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    session_id: conversationId,
                    message: message,
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();
            console.error('data:', data);
            return {
                answer: data.answer,
                tool_used: data.tool_used || null,
                error: data.error || null,
                metadata: data.data || null
            };
        } catch (err) {
            console.error('Erreur:', err);

            let errorMsg = "Erreur de connexion au server";

            return {
                answer: `❌ ${errorMsg}\n\n💡 Solution: Essayez en navigation privée (Ctrl+Shift+N) ou désactivez vos extensions Chrome.`,
                tool_used: null,
                error: errorMsg,
                metadata: null,
            };
        } finally {
            setIsLoading(false);
        }
    };

    return { callMCP, isLoading, error, toolExecution, clearError: () => setError(null) };
};