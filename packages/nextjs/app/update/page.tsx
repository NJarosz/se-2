// pages/update.tsx
import Link from "next/link";
import type { NextPage } from "next";
import { UpdateState } from "./_components/UpdateState";
import { UpdateOwner } from "./_components/UpdateOwnership";
import RfidScanner from "./_components/RFIDData";

const Update: NextPage = () => {
    return (
        <div className="min-h-screen flex flex-col items-center p-6">
            <h1 className="text-3xl font-bold mb-8">Update Product</h1>
            <div className="flex flex-row justify-center gap-6 w-full max-w-5xl">
                <div className="flex flex-col justify-center items-center gap-8 w-full max-w-md bg-white shadow-md rounded-lg p-6">
                    <h2 className="font-bold text-xl mb-2">Update Product Status</h2>
                    <UpdateState />
                </div>
                <div className="flex flex-col justify-center items-center gap-8 w-full max-w-md bg-white shadow-md rounded-lg p-6">
                    <h2 className="font-bold text-xl mb-6">Transfer Product Ownership</h2>
                    <UpdateOwner />
                    <RfidScanner />

                </div>
            </div>
        </div >
    );
};

export default Update;
