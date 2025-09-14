"use client";

import React, { useCallback } from "react";
import predeployedContracts from "~~/contracts/predeployedContracts";
import { useDeployedContractInfo } from "~~/hooks/scaffold-stark";
import { Abi, useAccount } from "@starknet-react/core";
import { Contract } from "starknet";
import { useTransactor } from "~~/hooks/scaffold-stark/useTransactor";

const DECIMALS = 18n;
const ONE_STRK = 1n * 10n ** DECIMALS;

const ResetCounterButton: React.FC = () => {
  const { data: counter } = useDeployedContractInfo("CounterContract");
  const { account } = useAccount();
  const { writeTransaction, sendTransactionInstance } = useTransactor();
  const isPending = sendTransactionInstance.status === "pending";
  const strk = predeployedContracts.devnet.Strk;

  const handleReset = useCallback(async () => {
    if (!counter || !account) return;
    // Build approve( counter.address, 1e18 ) call
    const erc20 = new Contract(strk.abi as Abi, strk.address, account);
    const approveCall = erc20.populate("approve", [counter.address, ONE_STRK]);
    // Build reset_counter() call
    const counterContract = new Contract(counter.abi as Abi, counter.address, account);
    const resetCall = counterContract.populate("reset_counter", []);

    await writeTransaction([approveCall, resetCall]);
  }, [account, counter, writeTransaction, strk.abi, strk.address]);

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        className="btn btn-warning"
        onClick={handleReset}
        disabled={isPending}
        title="Approves 1 STRK and resets the counter"
      >
        {isPending ? "Resetting..." : "Reset"}
      </button>
    </div>
  );
};

export default ResetCounterButton;
