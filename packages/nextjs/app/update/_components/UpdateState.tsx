"use client";

import { useEffect, useState } from "react";
import { useScaffoldWriteContract, useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { ethers } from "ethers";

export const UpdateState = () => {
    const [newStatus, setnewStatus] = useState<number | null>(null);
    const [nodeLocations, setNodeLocations] = useState<{ id: number; name: string }[]>([]);
    const [rfidData, setRfidData] = useState({
        id: '',
        rfid: '',
        supplyChainNode: ''
    });

    const StatusEnum = {
        Storage: 1,
        Shipped: 2,
        Received: 3,
    };

    // Fetch all nodes/ indexes from Smart Contracts
    const { data: nodes } = useScaffoldReadContract({
        contractName: "StateTransition",
        functionName: "fetchNodes",
    });

    // Function to handle manual input change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setRfidData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Auto-set location when status equals "Shipped"
    useEffect(() => {
        if (newStatus === StatusEnum.Shipped) {
            setRfidData((prevData) => ({
                ...prevData,
                supplyChainNode: '0', // Auto-set location to 0 for shipped status
            }));
        };
    }, [newStatus]);

    // Set Node Locations for drop down menu
    useEffect(() => {
        const populateNodes = async () => {
            if (nodes) {
                const nodeList = [];
                const len = nodes[0].length;
                for (let i = 0; i < len; i++) {
                    nodeList.push({ id: Number(nodes[0][i]), name: nodes[1][i].toString() });
                }
                setNodeLocations(nodeList);
            };
        }
        populateNodes();
    }, [nodes]);

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

    const { writeContractAsync, isPending } = useScaffoldWriteContract("StateTransition");

    const handleProductUpdate = async () => {
        try {
            const concatRFID = rfidData.rfid.slice(0, 2) === "0x" ? rfidData.rfid : ("0x" + rfidData.rfid);
            const formattedRFID = rfidData.rfid ? ethers.zeroPadBytes(concatRFID, 32) : undefined;

            const args = [
                rfidData.id !== null ? BigInt(rfidData.id) : undefined, // Convert to BigInt if not null
                formattedRFID,
                newStatus !== null ? newStatus : undefined,
                rfidData.supplyChainNode ? BigInt(rfidData.supplyChainNode) : BigInt(0), // Convert to BigInt if not null
            ].filter(arg => arg !== undefined); // Filter out undefined values

            await writeContractAsync(
                {
                    functionName: "updateState",
                    args,
                },
                {
                    onBlockConfirmation: txnReceipt => {
                        console.log("📦 Transaction blockHash", txnReceipt.blockHash);
                    }
                }
            );
        } catch (e) {
            console.error("Error updating product state", e);
        }
    };

    return (
        <div className="flex flex-col items-center">
            <form
                onSubmit={e => {
                    e.preventDefault();
                    handleProductUpdate(); // Call the update function on form submission
                }}
            >
                {/* Product ID Input */}
                <div className="mb-4">
                    <label htmlFor="productID" className="block font-medium">
                        Product ID:
                    </label>
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
                    <label htmlFor="rfid" className="block font-medium">
                        RFID:
                    </label>
                    <input
                        type="text"
                        id="rfid"
                        className="border p-2 w-full"
                        name="rfid"
                        value={rfidData.rfid}
                        onChange={handleChange}
                        placeholder="0x..."
                        required
                    />
                </div>

                {/* Status Input - dropdown */}
                <div className="mb-4">
                    <label htmlFor="productStatus" className="block font-medium">
                        Product Status:
                    </label>
                    <select
                        id="productStatus"
                        className="border p-2 w-full"
                        value={newStatus ?? ""}
                        onChange={e => setnewStatus(parseInt(e.target.value))}
                        required
                    >
                        <option value="">Select Status</option>
                        <option value={StatusEnum.Created}>Created</option>
                        <option value={StatusEnum.Storage}>Storage</option>
                        <option value={StatusEnum.Shipped}>Shipped</option>
                        <option value={StatusEnum.Received}>Received</option>
                    </select>
                </div>

                {/* Location Input - dropdown */}
                <div className="mb-4">
                    <label htmlFor="location" className="block font-medium">
                        Location (Code):
                    </label>
                    <select
                        id="location"
                        className="border p-2 w-full"
                        name="supplyChainNode"
                        value={rfidData.supplyChainNode}
                        onChange={handleChange}
                        disabled={newStatus === StatusEnum.Shipped} // Disable dropdown if the status is "Shipped"
                    >
                        <option value="">Select Location</option>
                        {nodeLocations.map(location => (
                            <option key={location.id} value={location.id}>
                                {location.id} - {location.name} {/* Display ID and name */}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className={`bg-blue-500 text-white p-2 rounded ${isPending ? "opacity-50" : ""}`}
                    disabled={isPending}
                >
                    {isPending ? "Updating..." : "Update Product"}
                </button>
            </form>
        </div>
    );
};
