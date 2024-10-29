// hooks/useWebSocket.ts
import { useEffect, useState } from 'react';

const useWebSocket = (url: string) => {
    const [data, setData] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const socket = new WebSocket(url);

        socket.onopen = () => {
            console.log('Connected to WebSocket server');
            setIsConnected(true);
        };

        socket.onmessage = (event) => {
            const parsedData = JSON.parse(event.data);
            setData(parsedData);
        };

        socket.onclose = () => {
            console.log('Disconnected from WebSocket server');
            setIsConnected(false);
        };

        return () => {
            socket.close();
        };
    }, [url]);

    return { data, isConnected };
};

export default useWebSocket;
