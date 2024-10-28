"use client";

import type { NextPage } from "next";

import { ProductState } from "~~/components/ProductState";

const Home: NextPage = () => {

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <ProductState />
      </div>
    </>
  );
};

export default Home;
