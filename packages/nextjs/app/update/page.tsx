// app/update/page.tsx

"use client"

import { useState } from "react";
import type { NextPage } from "next";
import { UpdateState } from "./_components/UpdateState";
import { UpdateOwner } from "./_components/UpdateOwnership";

const Update: NextPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <div className="min-h-screen flex flex-col items-center p-6">
            <h1 className="text-3xl font-bold mb-8">Update Product</h1>
            <div className="flex flex-col items-center justify-center gap-6 w-full max-w-5xl">
                <div className="flex flex-col justify-center items-center gap-8 w-full max-w-md bg-white shadow-md rounded-lg p-6">
                    <h2 className="font-bold text-xl mb-2">Update Product Status</h2>
                    <UpdateState />
                </div>
                <div className="flex flex-col justify-center items-center gap-8 w-full max-w-md bg-white shadow-md rounded-lg p-6">
                    <h2 className="font-bold text-xl mb-0">Transfer Product Ownership</h2>
                    {/* Button to open the modal */}
                    <button
                        onClick={openModal}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg"
                    >
                        Open Ownership Transfer
                    </button>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                        <h2 className="font-bold text-xl mb-4">Transfer Product Ownership</h2>
                        {/* UpdateOwner Component inside the modal */}
                        <UpdateOwner />

                        <button
                            onClick={closeModal}
                            className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Update;
