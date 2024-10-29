"use client";

import type { NextPage } from "next";

import { ProductStatus } from "~~/components/ProductStatus";

const Home: NextPage = () => {

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <ProductStatus />
      </div>
    </>
  );
};

export default Home;
