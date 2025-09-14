"use client";

import React from "react";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-stark/useScaffoldWriteContract";
 
type Props = {
  value?: number;
  isReading?: boolean;
};

const DecreaseCounterButton: React.FC<Props> = ({ value, isReading }) => {
  const { sendAsync, status, error } = useScaffoldWriteContract({
    contractName: "CounterContract",
    functionName: "decrease_counter",
  });

  const counterValue = Number(value ?? 0);
  const isDisabled = isReading || status === "pending" || counterValue === 0;

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        className="btn btn-primary"
        onClick={() => sendAsync()}
        disabled={isDisabled}
        title={counterValue === 0 ? "Counter is already at zero" : undefined}
      >
        {status === "pending" ? "Sending..." : "Decrease"}
      </button>
      {status === "error" && (
        <div className="text-error text-xs">
          {(error as any)?.message || "Transaction failed"}
        </div>
      )}
    </div>
  );
};

export default DecreaseCounterButton;
