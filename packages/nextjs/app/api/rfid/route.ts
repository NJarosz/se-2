// app/api/rfid/route.ts
import { NextResponse } from 'next/server';

let storedData: any = null; // Store data received from POST

export async function POST(request: Request) {
    const data = await request.json(); // Parse the JSON body
    const { id, rfid, status, supplyChainNode } = data; // Destructure the received data
    storedData = data;

    return NextResponse.json({
        message: 'RFID data received',
        id,
        rfid,
        status,
        supplyChainNode
    });
}

export async function GET() {
    return NextResponse.json(storedData); // Return the stored data
}
