"use client";

import React from "react";

type Props = {
  value?: number;
  isLoading?: boolean;
  error?: string;
};

export const CounterValue: React.FC<Props> = ({ value, isLoading, error }) => {
  if (isLoading) {
    return <div className="text-sm opacity-70">Loading counter…</div>;
  }

  if (error) {
    return (
      <div className="text-error text-sm">
        Failed to read counter: {error}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 bg-base-100 px-4 py-3 rounded-xl border border-base-300">
      <span className="font-semibold">Counter:</span>
      <span className="text-base-content text-lg">{Number(value ?? 0)}</span>
    </div>
  );
};

export default CounterValue;
