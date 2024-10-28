"use client";

import { useEffect, useState } from "react";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { Address } from "~~/components/scaffold-eth";

export const ProductState = () => {
    const [productId, setProductId] = useState<number | null>(null); // State to hold the user's input
    const [submittedId, setSubmittedId] = useState<number | null>(null); // Separate state for submitted ID
    const [hasSubmitted, setHasSubmitted] = useState(false); // Track if form has been submitted
    const states = ["Created", "Storage", "Shipped", "Received"];

    // Conditionally call the contract only if submittedId is a valid number
    const { data: getState } = useScaffoldReadContract({
        contractName: "StateTransition",
        functionName: "getState",
        args: submittedId !== null ? [BigInt(submittedId)] : undefined, // Pass the user's input as BigInt
    });

    const { data: getProduct } = useScaffoldReadContract({
        contractName: "ProductRegistration",
        functionName: "getProduct",
        args: submittedId !== null ? [BigInt(submittedId)] : undefined, // Pass the user's input as BigInt
    });

    const origin = getProduct ? BigInt(getProduct.origin) : 0;

    const { data: nodes } = useScaffoldReadContract({
        contractName: "StateTransition",
        functionName: "supplyChainNodes",
        args: [BigInt(origin)], // Pass the user's input as BigInt
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value ? parseInt(e.target.value) : null;
        setProductId(value);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault(); // Prevent page refresh
        setSubmittedId(productId); // Set the submitted ID to trigger contract reads
        setHasSubmitted(true); // Mark the form as submitted
    };

    useEffect(() => {
        const socket = new WebSocket('ws://localhost:4000'); //Configure to whichever port you defined in your websocket-server.ts file

        socket.onopen = () => {
            console.log('Connected to WebSocket server');
        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setProductId(data.id);
        };

        socket.onclose = () => {
            console.log('Disconnected from WebSocket server');
        };

        return () => socket.close();
    }, []);

    return (
        <div>
            <div className="flex flex-col items-center">
                <h1 className="font-bold text-4xl text-center mb-8">Retrieve Product State</h1>

                {/* Form with input field and submit button */}
                <form onSubmit={handleSubmit} className="flex flex-col text-center items-center">
                    <input
                        type="text" // Changed to text to prevent scroll buttons
                        value={productId ?? ""}
                        onChange={handleInputChange}
                        placeholder="Enter Product ID"
                        className="input mb-4 px-4 py-2 border border-gray-300"
                    />
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Submit
                    </button>
                </form>
            </div>

            {/* Display product state information */}
            {hasSubmitted && submittedId !== null ? (
                getState && getProduct && nodes ? (
                    <div className="mt-8 bg-white p-6 rounded-lg shadow-lg max-w-xl mx-auto">
                        <h2 className="font-bold text-2xl mb-4 text-center">Product Information</h2>
                        <p>Product ID: {getState.id.toString()}</p>
                        <p>RFID Hash: {getState.secret.toString().slice(0, 6)}...{getState.secret.toString().slice(-3)}</p>
                        <p>Name: {getProduct.name.toString()}</p>
                        <p>Status: {states[getState.state]}</p>
                        <p>Origin: {nodes.toString()}</p>
                        <p>Location: {getState.location.toString()}</p>
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <p style={{ marginRight: "8px", marginTop: "0", marginBottom: "0" }}>Owner: </p>
                            <Address address={getProduct.owner} />
                        </div>
                        <p>Timestamp: {new Date(Number(getState.timestamp) * 1000).toString()}</p>
                    </div>
                ) : (
                    <p className="mt-4 text-center text-red-500">No product found. Enter a valid product ID</p>
                )
            ) : null}
        </div>
    );
};
