// app/api/rfid/route.ts

// Not currently in use, but can be implemented for 
// using App Routing instead of using websockets

// import { NextResponse } from 'next/server';

// let storedData: any = null; // Store data received from POST

// export async function POST(request: Request) {
//     const data = await request.json(); // Parse the JSON body
//     const { id, rfid, supplyChainNode } = data; // Destructure the received data
//     storedData = data;

//     return NextResponse.json({
//         message: 'RFID data received',
//         id,
//         rfid,
//         supplyChainNode
//     });
// }

// export async function GET() {
//     return NextResponse.json(storedData); // Return the stored data
// }
