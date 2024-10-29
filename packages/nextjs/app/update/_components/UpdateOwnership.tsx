"use client";

import { useEffect, useState } from "react";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import useWebSocket from "~~/hooks/scaffold-eth/useWebSocket";

export const UpdateOwner = () => {
    const [newOwner, setNewOwner] = useState<string>("");
    const [productId, setProductId] = useState<number | null>(null);
    const [passKey, setPassKey] = useState<string>("");

    // Function to handle manual input change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value ? parseInt(e.target.value) : null;
        setProductId(value);
    };

    const { data: productData, isConnected: connection } = useWebSocket('ws://localhost:4000');
    // console.log("CONNECTION: ", connection); // Use this for debugging

    useEffect(() => {
        if (productData) {
            setProductId(productData.id);
        }
    }, [productData]);

    const { writeContractAsync, isPending } = useScaffoldWriteContract("ProductRegistration");

    const handleOwnerUpdate = async () => {
        try {
            // Ensure RFID is formatted as hex
            //const concatRFID = rfidData.rfid.slice(0, 2) === "0x" ? rfidData.rfid : ("0x" + rfidData.rfid);

            const args = [
                productId !== null ? BigInt(productId) : undefined,  // convert to BigInt if not null
                passKey,
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
            setProductId(null);
            setPassKey("");
            setNewOwner("");
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
                    <label htmlFor="productId" className="block font-medium">Product ID:</label>
                    <input
                        type="number"
                        id="productId"
                        className="border p-2 w-full"
                        name="id"
                        value={productId ?? ""}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                {/* Pass Key Input */}
                <div className="mb-4">
                    <label htmlFor="passKey" className="block font-medium">Pass Key:</label>
                    <input
                        type="text"
                        id="passKey"
                        className="border p-2 w-full"
                        value={passKey}
                        onChange={e => setPassKey(e.target.value)}
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