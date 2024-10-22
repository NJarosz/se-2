"use client";

import { useState } from "react";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { ethers } from "ethers";

export const UpdateOwner = () => {
    const [newID, setNewID] = useState<number | null>(null);
    const [newRFID, setNewRFID] = useState<string>("");
    const [newOwner, setNewOwner] = useState<string>("");


    const { writeContractAsync, isPending } = useScaffoldWriteContract("ProductRegistration");

    const handleOwnerUpdate = async () => {
        try {
            // Ensure RFID is formatted as bytes32
            const formattedRFID = newRFID ? ethers.zeroPadBytes(newRFID, 32) : undefined;

            const args = [
                newID !== null ? BigInt(newID) : undefined,  // convert to BigInt if not null
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

                {/* New Owner Input */}
                <div className="mb-4">
                    <label htmlFor="productName" className="block font-medium">New Owner Address:</label>
                    <input
                        type="text"
                        id="productName"
                        className="border p-2 w-full"
                        value={newOwner}
                        onChange={e => setNewOwner(e.target.value)}
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