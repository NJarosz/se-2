// Not currently in use, but can be used to check RFID scanner/ routing is properly working

// 'use client';

// import { useEffect, useState } from 'react';

// const RfidScanner = () => {
//     const [rfidData, setRfidData] = useState({ id: '', rfid: '', supplyChainNode: '' });

//     useEffect(() => {
//         const socket = new WebSocket('ws://localhost:4000');

//         socket.onopen = () => {
//             console.log('Connected to WebSocket server');
//         };

//         socket.onmessage = (event) => {
//             const data = JSON.parse(event.data);
//             setRfidData(data);
//         };

//         socket.onclose = () => {
//             console.log('Disconnected from WebSocket server');
//         };

//         return () => socket.close();
//     }, []);



//     return (
//         <div>
//             <h2>RFID Data</h2>
//             {rfidData ? (
//                 <div>
//                     <p>ID: {rfidData.id}</p>
//                     <p>RFID: {rfidData.rfid}</p>
//                     <p>Supply Chain Node: {rfidData.supplyChainNode}</p>
//                 </div>
//             ) : (
//                 <p>No RFID data received yet.</p>
//             )}
//         </div>
//     );
// };

// export default RfidScanner;
