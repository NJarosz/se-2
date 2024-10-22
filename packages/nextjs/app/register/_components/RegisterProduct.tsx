"use client";

import { useEffect, useState } from "react";
import { useScaffoldWriteContract, useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { ethers } from "ethers";

export const RegisterProduct = () => {
    const [newID, setNewID] = useState<number | null>(null);
    const [newRFID, setNewRFID] = useState<string>("");
    const [newName, setNewName] = useState<string>("");
    const [newOrigin, setNewOrigin] = useState<number | null>(null);
    const [nodeLocations, setNodeLocations] = useState<{ id: number; name: string }[]>([]);

    // Fetch all nodes/ indexes from Smart Contracts
    const { data: nodes } = useScaffoldReadContract({
        contractName: "StateTransition",
        functionName: "fetchNodes",
    });

    useEffect(() => {
        const populateNodes = async () => {
            if (nodes) {
                const nodeList = [];
                const len = nodes[0].length - 1;
                for (let i = 1; i < len; i++) {
                    // Simulate data fetching
                    nodeList.push({ id: Number(nodes[0][i]), name: nodes[1][i].toString() });
                }
                console.log("node lists: ", nodeList);
                setNodeLocations(nodeList);
            };
        }
        populateNodes();
    }, [nodes]);

    const { writeContractAsync, isPending } = useScaffoldWriteContract("ProductRegistration");

    const handleProductRegistration = async () => {
        try {
            const formattedRFID = newRFID ? ethers.zeroPadBytes(newRFID, 32) : undefined;

            const args = [
                newID !== null ? BigInt(newID) : undefined,  // convert to BigInt if not null
                formattedRFID,
                newName !== "" ? newName : undefined,        // include name if not empty
                newOrigin !== null ? BigInt(newOrigin) : 0  // convert to BigInt if not null
            ].filter(arg => arg !== undefined);  // Filter out undefined values

            await writeContractAsync(
                {
                    functionName: "registerProduct",
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
            <h2 className="font-bold text-xl mb-4">Register a New Product</h2>
            <form
                onSubmit={e => {
                    e.preventDefault();
                    handleProductRegistration(); // Call the registration function on form submission
                }}
            >
                {/* Product ID Input */}
                <div className="mb-4">
                    <label htmlFor="productID" className="block font-medium">Product ID:</label>
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
                    <label htmlFor="rfid" className="block font-medium">RFID:</label>
                    <input
                        type="text"
                        id="rfid"
                        className="border p-2 w-full"
                        value={newRFID}
                        onChange={e => setNewRFID(e.target.value)}
                        required
                    />
                </div>

                {/* Name Input */}
                <div className="mb-4">
                    <label htmlFor="productName" className="block font-medium">Product Name:</label>
                    <input
                        type="text"
                        id="productName"
                        className="border p-2 w-full"
                        value={newName}
                        onChange={e => setNewName(e.target.value)}
                        required
                    />
                </div>

                {/* Origin Input */}
                <div className="mb-4">
                    <label htmlFor="location" className="block font-medium">
                        Origin (Code):
                    </label>
                    <select
                        id="location"
                        className="border p-2 w-full"
                        value={newOrigin ?? ""}
                        onChange={e => setNewOrigin(parseInt(e.target.value))}
                    >
                        <option value="">Select Origin</option>
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
                    {isPending ? "Registering..." : "Register Product"}
                </button>
            </form>
        </div>
    );
};