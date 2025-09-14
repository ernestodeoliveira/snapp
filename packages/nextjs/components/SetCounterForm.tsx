"use client";

import React, { useMemo, useState } from "react";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-stark/useScaffoldWriteContract";
import { useScaffoldReadContract } from "~~/hooks/scaffold-stark/useScaffoldReadContract";
import { useAccount } from "~~/hooks/useAccount";

const U32_MAX = 4294967295;

type Props = {
  current?: number;
};

const SetCounterForm: React.FC<Props> = ({ current }) => {
  const [input, setInput] = useState<string>(current?.toString() ?? "");

  const { sendAsync, status, error } = useScaffoldWriteContract({
    contractName: "CounterContract",
    functionName: "set_counter",
    // provide a placeholder arg to satisfy typing; real value is passed on submit
    args: [0],
  });

  // Connected wallet address
  const { address } = useAccount();
  // Read contract owner
  const { data: ownerAddress, isLoading: isLoadingOwner } = useScaffoldReadContract({
    contractName: "CounterContract",
    functionName: "owner",
  });
  const isOwner = Boolean(
    ownerAddress && address && String(ownerAddress).toLowerCase() === BigInt(address ?? 0).toString(),
  );

  const parsedValue = useMemo(() => {
    if (input === "") return undefined;
    const n = Number(input);
    if (!Number.isFinite(n) || n < 0 || !Number.isInteger(n)) return NaN;
    return n;
  }, [input]);

  const isValid =
    parsedValue !== undefined && !Number.isNaN(parsedValue) && parsedValue <= U32_MAX;

  const handleSubmit = async () => {
    if (!isValid) return;
    await sendAsync({ args: [parsedValue] as any });
  };

  return (
    <div className="w-full flex flex-col items-center gap-2">
      <label className="text-sm opacity-80 text-center">Set counter</label>
      <div className="flex items-center gap-2">
        <input
          type="number"
          inputMode="numeric"
          min={0}
          max={U32_MAX}
          step={1}
          className="input input-bordered w-14"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={current !== undefined ? String(current) : "New value"}
        />
        <button
          className="btn btn-accent"
          onClick={handleSubmit}
          disabled={status === "pending" || !isValid || isLoadingOwner || !isOwner}
          title={
            !isValid
              ? "Enter an integer between 0 and 4,294,967,295"
              : !isOwner
              ? "Only the owner can set the counter"
              : undefined
          }
        >
          {status === "pending" ? "Setting..." : "Set"}
        </button>
      </div>
      {error && (
        <div className="text-error text-xs">
          {(error as any)?.message || "Transaction failed"}
        </div>
      )}
    </div>
  );
};

export default SetCounterForm;
