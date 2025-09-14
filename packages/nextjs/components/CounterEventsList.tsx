"use client";

import React from "react";
import { useScaffoldEventHistory } from "~~/hooks/scaffold-stark/useScaffoldEventHistory";

const CounterEventsList: React.FC = () => {
  const { data, isLoading, error } = useScaffoldEventHistory({
    contractName: "CounterContract",
    eventName: "CounterChanged",
    fromBlock: 0n,
    watch: true,
    blockData: false,
    transactionData: false,
    receiptData: false,
    format: true,
  });

  if (isLoading) {
    return <div className="text-sm opacity-70">Loading events…</div>;
  }

  if (error) {
    return (
      <div className="text-error text-sm">Failed to load events: {String(error)}</div>
    );
  }

  return (
    <div className="w-full max-w-xl">
      <h3 className="text-lg font-semibold mb-2">CounterChanged events</h3>
      {(!data || data.length === 0) && (
        <div className="opacity-70 text-sm">No events found yet.</div>
      )}
      <ul className="flex flex-col gap-2">
        {data?.map((ev: any, idx: number) => {
          // Prefer parsedArgs if available
          const a = ev.parsedArgs || ev.args || {};
          const caller = a.caller ?? a["caller"];
          const oldCounter = a.old_counter ?? a["old_counter"];
          const newCounter = a.new_counter ?? a["new_counter"];
          const reason = a.reason ?? a["reason"];
          const reasonDisplay = (() => {
            const canonical = (s: string) => {
              const v = s.toLowerCase();
              if (v === "increase") return "Increase";
              if (v === "decrease") return "Decrease";
              if (v === "reset") return "Reset";
              if (v === "set") return "Set";
              return undefined;
            };

            if (!reason) return "";
            if (typeof reason === "string") return canonical(reason) ?? reason;

            // Shapes we expect for enums: { name: "Increase" } | { variant: "Increase" } | { variant: { Increase: {} } } | { Increase: {} }
            if (typeof reason === "object") {
              const r: any = reason;
              if (typeof r.name === "string") return canonical(r.name) ?? r.name;
              if (typeof r.variant === "string") return canonical(r.variant) ?? r.variant;
              if (r.variant && typeof r.variant === "object") {
                const keys = Object.keys(r.variant);
                if (keys.length === 1) return canonical(keys[0]) ?? keys[0];
              }
              const keys = Object.keys(r).filter((k) => k !== "variant" && k !== "name");
              if (keys.length === 1) return canonical(keys[0]) ?? keys[0];
            }
            // Fallback heuristic using counter values
            const o = Number(oldCounter);
            const n = Number(newCounter);
            if (!Number.isNaN(o) && !Number.isNaN(n)) {
              if (n === 0 && o !== 0) return "Reset";
              if (n === o + 1) return "Increase";
              if (n === o - 1) return "Decrease";
              if (n !== o) return "Set";
            }
            return "";
          })();
          const txHash = ev?.log?.transaction_hash;

          return (
            <li key={idx} className="bg-base-100 border border-base-300 rounded-xl px-4 py-3">
              <div className="text-sm">
                <span className="opacity-70">Caller:</span>{" "}
                <span className="break-all">{String(caller)}</span>
              </div>
              <div className="text-sm">
                <span className="opacity-70">Old:</span> {String(oldCounter)}
                {"  "}
                <span className="opacity-70 ml-4">New:</span> {String(newCounter)}
              </div>
              <div className="text-sm">
                <span className="opacity-70">Reason:</span> {reasonDisplay}
              </div>
              {txHash && (
                <div className="text-xs opacity-70 mt-1 break-all">
                  Tx: {String(txHash)}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default CounterEventsList;
