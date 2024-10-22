'use client'; // Ensure this is a client component

import { useEffect, useState } from 'react';

const RfidScanner = () => {
    const [rfidData, setRfidData] = useState({ id: '', rfid: '', status: '', supplyChainNode: '' });

    const fetchData = async () => {
        try {
            const response = await fetch('/api/rfid'); // Adjust the endpoint as necessary
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const jsonData = await response.json();
            console.log("JSON DATA: ", jsonData);
            setRfidData(jsonData); // Update state with the received data
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        // Fetch data when the component mounts
        fetchData();

        // Optionally, set up a way to fetch data when an RFID is scanned
        // Example: Use a WebSocket, event listeners, or polling

        // You can also implement a polling mechanism or listen for events here
    }, []);

    return (
        <div>
            <h2>RFID Data</h2>
            {rfidData ? (
                <div>
                    <p>ID: {rfidData.id}</p>
                    <p>RFID: {rfidData.rfid}</p>
                    <p>Status: {rfidData.status}</p>
                    <p>Supply Chain Node: {rfidData.supplyChainNode}</p>
                </div>
            ) : (
                <p>No RFID data received yet.</p>
            )}
        </div>
    );
};

export default RfidScanner;
