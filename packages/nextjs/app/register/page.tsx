// app/register/page.tsx
import type { NextPage } from "next";
import { RegisterProduct } from "./_components/RegisterProduct";

const Register: NextPage = () => {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center p-6">
            <h1 className="text-3xl font-bold mb-8">Register Product</h1>
            <div className="flex flex-col lg:flex-row justify-center items-center gap-8 w-full max-w-md bg-white shadow-md rounded-lg p-6">
                <RegisterProduct />
            </div>
        </div>
    );
};

export default Register;
