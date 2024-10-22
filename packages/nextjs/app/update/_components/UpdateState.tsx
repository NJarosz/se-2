"use client";

import { useEffect, useState } from "react";
import { useScaffoldWriteContract, useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { ethers } from "ethers";

export const UpdateState = () => {
    const [newID, setNewID] = useState<number | null>(null);
    const [newRFID, setNewRFID] = useState<string>("");
    const [newStatus, setnewStatus] = useState<number | null>(null);
    const [newLocation, setNewLocation] = useState<number | null>(null);
    const [nodeLocations, setNodeLocations] = useState<{ id: number; name: string }[]>([]);
    const [rfidData, setRFIDData] = useState({
        rfid: '',
        id: '',
        status: '',
        supplyChainNode: ''
    });

    const StatusEnum = {
        Created: 0,
        Storage: 1,
        Shipped: 2,
        Received: 3,
    };

    // Fetch all nodes/ indexes from Smart Contracts
    const { data: nodes } = useScaffoldReadContract({
        contractName: "StateTransition",
        functionName: "fetchNodes",
    });

    // Auto-set location when status equals "Shipped"
    useEffect(() => {
        if (newStatus === StatusEnum.Shipped) {
            setNewLocation(0); // Auto-set location to 0 for shipped status
        }
    }, [newStatus]);

    // Set Node Locations for drop down menu
    useEffect(() => {
        const populateNodes = async () => {
            if (nodes) {
                const nodeList = [];
                const len = nodes[0].length;
                for (let i = 0; i < len; i++) {
                    // Simulate data fetching
                    nodeList.push({ id: Number(nodes[0][i]), name: nodes[1][i].toString() });
                }
                setNodeLocations(nodeList);
            };
        }
        populateNodes();
    }, [nodes]);

    useEffect(() => {
        // Fetch the data from the API route (you may adjust the URL depending on your setup)
        const fetchData = async () => {
            const response = await fetch('api/rfid');
            const result = await response.json();

            // Set the data in state to auto-populate the fields
            if (result.id && result.rfid && result.status && result.supplyChainNode) {
                setRFIDData(result);
            }
        };

        fetchData();
    }, []);

    const { writeContractAsync, isPending } = useScaffoldWriteContract("StateTransition");

    const handleProductUpdate = async () => {
        try {
            const formattedRFID = newRFID ? ethers.zeroPadBytes(newRFID, 32) : undefined;

            const args = [
                newID !== null ? BigInt(newID) : undefined, // Convert to BigInt if not null
                formattedRFID,
                newStatus !== null ? newStatus : undefined,
                newLocation ? BigInt(newLocation) : BigInt(0), // Convert to BigInt if not null
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
                        value={newID || ""}
                        onChange={e => setNewID(e.target.value ? parseInt(e.target.value) : null)}
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
                        value={newRFID}
                        onChange={e => setNewRFID(e.target.value)}
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

                <div className="mb-4">
                    <label htmlFor="productStatus" className="block font-medium">
                        Product Status:
                    </label>
                    <select
                        id="productStatus"
                        className="border p-2 w-full"

                    >
                        <option value="">Select Status</option>
                        <option value={rfidData.id}></option>
                        <option value={rfidData.rfid}></option>
                        <option value={rfidData.status}></option>
                        <option value={rfidData.supplyChainNode}></option>
                    </select>
                </div>

                {/* Location Input - dropdown */}
                <div className="mb-4">
                    <label htmlFor="location" className="block font-medium">
                        New Location (Code):
                    </label>
                    <select
                        id="location"
                        className="border p-2 w-full"
                        value={newLocation ?? ""}
                        onChange={e => setNewLocation(parseInt(e.target.value))}
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
