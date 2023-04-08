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
  const initAmounts: string[] = [];
  const [newToken, setNewToken] = useState("");
  const [newRecipient, setNewRecipient] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [tokenList, setTokenList] = useState(initTokens);
  const [recipientList, setRecipientList] = useState(initRecipients);
  const [tokenAmounts, setTokenAmounts] = useState(initAmounts);
  

  function clearFields() {
    const _token = document.getElementById("token");
    const _recipient = document.getElementById("recipient");
    const _amount = document.getElementById("amount");
    _token.value = "";
    _recipient.value = "";
    _amount.value = "";
    setNewToken("");
    setNewRecipient("");
    setNewAmount("");
  } 

  const handleAdd = (e: any) => {
    e.preventDefault();
    // eslint-disable-next-line prettier/prettier
    setTokenList([
      ...tokenList,
      newToken
      ]);
    // eslint-disable-next-line prettier/prettier
    setRecipientList([
      ...recipientList,
      newRecipient
      ]);
    // eslint-disable-next-line prettier/prettier
    setTokenAmounts([
      ...tokenAmounts,
      newAmount
      ]);
    
    clearFields();
    console.log(tokenList);
  };

  const { writeAsync, isLoading } = useScaffoldContractWrite({
    contractName: "YourContract",
    functionName: "multiSend",
    args: [recipientList, tokenList, tokenAmounts],
  });

  const clearLastTx = () => {
    tokenList.pop();
    recipientList.pop();
    tokenAmounts.pop();
    setTokenList(tokenList);
    setRecipientList(recipientList);
    setTokenAmounts(tokenAmounts);
  };

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
                id="token"
                placeholder="Token Address"
                className="input font-bai-jamjuree w-full px-5 bg-[url('/assets/gradient-bg.png')] bg-[length:100%_100%] border border-primary text-lg sm:text-2xl placeholder-white uppercase"
                onChange={e => setNewToken(e.target.value)}
              />
              <input
                type="text"
                id="recipient"
                placeholder="Recipient Address"
                className="input font-bai-jamjuree w-full px-5 bg-[url('/assets/gradient-bg.png')] bg-[length:100%_100%] border border-primary text-lg sm:text-2xl placeholder-white uppercase"
                onChange={e => setNewRecipient(e.target.value)}
              />
              <input
                type="text"
                id="amount"
                placeholder="Amount to Send"
                className="input font-bai-jamjuree w-full px-5 bg-[url('/assets/gradient-bg.png')] bg-[length:100%_100%] border border-primary text-lg sm:text-2xl placeholder-white uppercase"
                onChange={e => setNewAmount(e.target.value)}
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
              <span className="text-sm leading-tight">Enter Amount in Wei</span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-center items-center bg-[url('/assets/gradient-bg.png')] bg-[length:100%_100%] py-96 px-5 sm:px-0 lg:py-auto max-w-[100vw] ">
        <div className={`flex flex-col justify-center items-center max-w-fit bg-base-200 bg-opacity-70 rounded-2xl shadow-lg px-5 py-4 w-full`}>
          <ul>
            {tokenList.length >= 1
              ? tokenList.map((token, idx) => {
                  return (
                    <li key={idx}>
                      <small>Token:</small> <b>{token.substring(0,6)}...{token.substring(token.length - 3)}  </b> 
                      <small>Recipient:</small> <b>{recipientList[idx].substring(0,6)}...{recipientList[idx].substring(recipientList[idx].length - 3)}  </b> 
                      <small>Amount:</small> <b>{tokenAmounts[idx]}</b>
                    </li>
                  );
                })
              : `Enter a Token TX`}
          </ul>
        </div>
        <div className="py-5">
          <div className="flex rounded-full border border-primary p-1 flex-shrink-0">
            <div className="flex rounded-full border-2 border-primary p-1">
              <button
                className={`btn btn-primary rounded-full capitalize font-normal font-white w-24 flex items-center gap-1 hover:gap-2 transition-all tracking-widest ${
                  isLoading ? "loading" : ""
                }`}
                onClick={clearLastTx}
              >
                {!isLoading && <>Clear Last Tx</>}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
