"use client";

import React from "react";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-stark/useScaffoldWriteContract";

const IncreaseCounterButton: React.FC = () => {
  const { sendAsync, status, error } = useScaffoldWriteContract({
    contractName: "CounterContract",
    functionName: "increase_counter",
  });

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        className="btn btn-primary"
        onClick={() => sendAsync()}
        disabled={status === "pending"}
      >
        {status === "pending" ? "Sending..." : "Increase"}
      </button>
      {status === "error" && (
        <div className="text-error text-xs">
          {(error as any)?.message || "Transaction failed"}
        </div>
      )}
    </div>
  );
};

export default IncreaseCounterButton;
