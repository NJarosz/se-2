import { useState } from "react";
import { CopyIcon } from "./assets/CopyIcon";
import { DiamondIcon } from "./assets/DiamondIcon";
import { HareIcon } from "./assets/HareIcon";
import { ethers } from "ethers";
import { ArrowSmallRightIcon } from "@heroicons/react/24/outline";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

export const ContractInteraction = () => {
  const initTokens: string[] = [];
  const initRecipients: string[] = [];
  const initAmounts: number[] = [];
  const [newToken, setNewToken] = useState("");
  const [newRecipient, setNewRecipient] = useState("");
  const [newAmount, setNewAmount] = useState(0);
  const [arrayLength, setArrayLength] = useState(0);
  const [tokenList, setTokenList] = useState(initTokens);
  const [recipientList, setRecipientList] = useState(initRecipients);
  const [tokenAmounts, setTokenAmounts] = useState(initAmounts);
  //const [bigNumberAmounts, setBigNumberAmounts] = useState([]);
  const txValue = "0.001";

  const handleAdd = (e: any) => {
    e.preventDefault();
    // eslint-disable-next-line prettier/prettier
    setTokenList([
      newToken,
      ...tokenList
      ]);
    // eslint-disable-next-line prettier/prettier
    setRecipientList([
      newRecipient,
      ...recipientList
      ]);
    // eslint-disable-next-line prettier/prettier
    setTokenAmounts([
      newAmount,
      ...tokenAmounts
      ]);
    // setBigNumberAmounts([
    //   ethers.BigNumber.from(newAmount),
    //   ...bigNumberAmounts
    //   ]);
    setArrayLength(arrayLength + 1);
    console.log(tokenList);
  };

  const { writeAsync, isLoading } = useScaffoldContractWrite({
    contractName: "YourContract",
    functionName: "multiSend",
    args: [tokenList, recipientList, [ethers.BigNumber.from(100)]],
    value: txValue,
  });

  return (
    <div>
      <div className="flex bg-base-300 relative pb-20 ">
        <DiamondIcon className="absolute top-24" />
        <CopyIcon className="absolute bottom-0 left-36" />
        <HareIcon className="absolute right-0 bottom-24" />
        <div className="flex flex-row justify-center items-center py-14 w-full mx-5 sm:mx-8 2xl:mx-20">
          <div className="mt-6 grid grid-cols-1 px-7 py-10 bg-base-200 opacity-80 rounded-2xl shadow-lg border-2 border-primary">
            <span className="flex flex-col items-center text-6xl sm:text-6xl text-black">
              Send Tokens to Multiple Recipients
            </span>
            <div className="mt-8 flex flex-row sm:flex-row items-start sm:items-center gap-2 sm:gap-5">
              <input
                type="text"
                placeholder="Token Address"
                className="input font-bai-jamjuree w-full px-5 bg-[url('/assets/gradient-bg.png')] bg-[length:100%_100%] border border-primary text-lg sm:text-2xl placeholder-white uppercase"
                onChange={e => setNewToken(e.target.value)}
              />
              <input
                type="text"
                placeholder="Recipient Address"
                className="input font-bai-jamjuree w-full px-5 bg-[url('/assets/gradient-bg.png')] bg-[length:100%_100%] border border-primary text-lg sm:text-2xl placeholder-white uppercase"
                onChange={e => setNewRecipient(e.target.value)}
              />
              <input
                type="number"
                placeholder="Amount to Send"
                className="input font-bai-jamjuree w-full px-5 bg-[url('/assets/gradient-bg.png')] bg-[length:100%_100%] border border-primary text-lg sm:text-2xl placeholder-white uppercase"
                onChange={e => setNewAmount(parseInt(e.target.value))}
              />
              <div className="flex rounded-full border border-primary p-1 flex-shrink-0">
                <div className="flex rounded-full border-2 border-primary p-1">
                  <button
                    className={`btn btn-primary rounded-full capitalize font-normal font-white w-24 flex items-center gap-1 hover:gap-2 transition-all tracking-widest ${
                      isLoading ? "loading" : ""
                    }`}
                    onClick={handleAdd}
                  >
                    {!isLoading && (
                      <>
                        Add <ArrowSmallRightIcon className="w-3 h-3 mt-0.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
              <div className="flex rounded-full border border-primary p-1 flex-shrink-0">
                <div className="flex rounded-full border-2 border-primary p-1">
                  <button
                    className={`btn btn-primary rounded-full capitalize font-normal font-white w-24 flex items-center gap-1 hover:gap-2 transition-all tracking-widest ${
                      isLoading ? "loading" : ""
                    }`}
                    onClick={writeAsync}
                  >
                    {!isLoading && <>Send All TX</>}
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-4 flex flex-col gap-2 items-center">
              <span className="text-sm leading-tight">Price:</span>
              <div className="badge badge-warning">{txValue} ETH + Gas</div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-row justify-center items-center bg-[url('/assets/gradient-bg.png')] bg-[length:100%_100%] py-96 px-5 sm:px-0 lg:py-auto max-w-[100vw] ">
        <div className={`flex flex-row max-w-md bg-base-200 bg-opacity-70 rounded-2xl shadow-lg px-5 py-4 w-full`}>
          <ul>
            {tokenList.length >= 1
              ? tokenList.map((token, idx) => {
                  return (
                    <li key={idx}>
                      {token}, {recipientList[idx]}, {tokenAmounts[idx]}
                    </li>
                  );
                })
              : `Enter a Token TX`}
          </ul>
        </div>
      </div>
    </div>
  );
};
