"use client";

import { useEffect, useState } from "react";
import { useScaffoldWriteContract, useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import useWebSocket from "~~/hooks/scaffold-eth/useWebSocket";

export const RegisterProduct = () => {
    const [newName, setNewName] = useState<string>("");
    const [nodeLocations, setNodeLocations] = useState<{ id: number; name: string }[]>([]);
    const [rfidData, setRfidData] = useState({
        id: '',
        rfid: '',
        supplyChainNode: ''
    });

    // Function to handle manual input change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setRfidData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Fetch all nodes/ indexes from Smart Contracts
    const { data: nodes } = useScaffoldReadContract({
        contractName: "StateTransition",
        functionName: "fetchNodes",
    });

    // Set Node Locations for drop down menu
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

    const { data: productData, isConnected: connection } = useWebSocket('ws://localhost:4000');
    // console.log("CONNECTION: ", connection); // Use this for debugging

    useEffect(() => {
        if (productData) {
            setRfidData(productData);
        }
    }, [productData]);

    const { writeContractAsync, isPending } = useScaffoldWriteContract("ProductRegistration");

    const handleProductRegistration = async () => {
        try {
            const concatRFID = rfidData.rfid.slice(0, 2) === "0x" ? rfidData.rfid : ("0x" + rfidData.rfid);

            const args = [
                rfidData.id !== null ? BigInt(rfidData.id) : undefined,  // convert to BigInt if not null
                concatRFID,
                newName !== "" ? newName : undefined,        // include name if not empty
                rfidData.supplyChainNode !== null ? BigInt(rfidData.supplyChainNode) : 0  // convert to BigInt if not null
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
            setNewName("");
            setRfidData({ id: "", rfid: "", supplyChainNode: "" });
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
                    <label htmlFor="productId" className="block font-medium">Product ID:</label>
                    <input
                        type="number"
                        id="productId"
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
                        name="rfid"
                        value={rfidData.rfid}
                        onChange={handleChange}
                        placeholder="0x..."
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
                        name="supplyChainNode"
                        value={rfidData.supplyChainNode}
                        onChange={handleChange}
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