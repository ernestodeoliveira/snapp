"use client";

import CounterValue from "~~/components/CounterValue";
import IncreaseCounterButton from "~~/components/IncreaseCounterButton";
import DecreaseCounterButton from "~~/components/DecreaseCounterButton";
import { useScaffoldReadContract } from "~~/hooks/scaffold-stark/useScaffoldReadContract";
import SetCounterForm from "~~/components/SetCounterForm";
import CounterEventsList from "~~/components/CounterEventsList";
import ResetCounterButton from "~~/components/ResetCounterButton";

const Home = () => {
  const { data, isLoading, error } = useScaffoldReadContract({
    contractName: "CounterContract",
    functionName: "get_counter",
  });
  const counterValue = Number(data ?? 0);

  return (
    <div className="flex items-center flex-col grow pt-10">
      <div className="w-full max-w-md flex flex-col gap-6 items-center">
        <CounterValue value={counterValue} isLoading={isLoading} error={error?.message} />
        <div className="flex gap-3 flex-wrap justify-center items-end">
          <IncreaseCounterButton />
          <DecreaseCounterButton value={counterValue} isReading={isLoading} />
          <ResetCounterButton />
        </div>
        <SetCounterForm current={counterValue} />
      </div>
      <div className="mt-10 w-full flex justify-center">
        <CounterEventsList />
      </div>
    </div>
  );
};

export default Home;
