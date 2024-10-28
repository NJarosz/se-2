"use client";

import { useEffect, useState } from "react";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { ethers } from "ethers";

export const UpdateOwner = () => {
    // const [newID, setNewID] = useState<number | null>(null);
    // const [newRFID, setNewRFID] = useState<string>("");
    const [newOwner, setNewOwner] = useState<string>("");
    const [rfidData, setRfidData] = useState({
        id: '',
        rfid: ''
    });

    // Function to handle manual input change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setRfidData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Receive data sent from RFID Scanner
    useEffect(() => {
        const socket = new WebSocket('ws://localhost:4000'); //Configure to whichever port you defined in your websocket-server.ts file

        socket.onopen = () => {
            console.log('Connected to WebSocket server');
        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setRfidData(data);
        };

        socket.onclose = () => {
            console.log('Disconnected from WebSocket server');
        };

        return () => socket.close();
    }, []);

    const { writeContractAsync, isPending } = useScaffoldWriteContract("ProductRegistration");

    const handleOwnerUpdate = async () => {
        try {
            // Ensure RFID is formatted as bytes32
            const concatRFID = rfidData.rfid.slice(0, 2) === "0x" ? rfidData.rfid : ("0x" + rfidData.rfid);
            const formattedRFID = rfidData.rfid ? ethers.zeroPadBytes(concatRFID, 32) : undefined;;

            const args = [
                rfidData.id !== null ? BigInt(rfidData.id) : undefined,  // convert to BigInt if not null
                formattedRFID,
                newOwner || undefined, // Pass only if not empty
            ].filter(arg => arg !== undefined);  // Filter out undefined values

            await writeContractAsync(
                {
                    functionName: "transferOwnership",
                    args,
                },
                {
                    onBlockConfirmation: txnReceipt => {
                        console.log("📦 Transaction blockHash", txnReceipt.blockHash);
                    },
                },
            );
        } catch (e) {
            console.error("Error setting product registration", e);
        }
    };

    return (
        <div className="flex flex-col items-center">
            <form
                onSubmit={e => {
                    e.preventDefault();
                    handleOwnerUpdate(); // Call the registration function on form submission
                }}
            >
                {/* Product ID Input */}
                <div className="mb-4">
                    <label htmlFor="productID" className="block font-medium">Product ID:</label>
                    <input
                        type="number"
                        id="productID"
                        className="border p-2 w-full"
                        name="id"
                        value={rfidData.id}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* RFID Input */}
                <div className="mb-4">
                    <label htmlFor="rfid" className="block font-medium">RFID:</label>
                    <input
                        type="text"
                        id="rfid"
                        className="border p-2 w-full"
                        value={rfidData.rfid}
                        onChange={handleChange}
                        placeholder="0x..."
                        required
                    />
                </div>

                {/* New Owner Input */}
                <div className="mb-4">
                    <label htmlFor="productName" className="block font-medium">New Owner Address:</label>
                    <input
                        type="text"
                        id="productName"
                        className="border p-2 w-full"
                        value={newOwner}
                        onChange={e => setNewOwner(e.target.value)}
                        placeholder="0x..."
                        required
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className={`bg-blue-500 text-white p-2 rounded ${isPending ? "opacity-50" : ""}`}
                    disabled={isPending}
                >
                    {isPending ? "Updating Owner..." : "Update Ownership"}
                </button>
            </form>
        </div >
    );
};