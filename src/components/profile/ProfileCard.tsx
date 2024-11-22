import { useWallet } from "@/contexts/WalletContext";
import React from "react";

const ProfileCard = () => {
  const { balance, balanceInUSD, priceChange } = useWallet();
  const formattedDate = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date());

  const formatBalance = (balance: string): string => {
    const numBalance = parseFloat(balance);
    return numBalance.toFixed(3);
  };

  const isPriceChangePositive = priceChange?.startsWith("+");

  return (
    <div className="w-full mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="flex">
        <div className="bg-gradient-to-b from-blue-500 via-green-500 to-purple-500 bg-[length:200%_200%] animate-verticalGradientShift text-white flex items-center justify-center w-12 h-auto rounded-l-xl overflow-hidden">
          <p className="text-sm font-bold transform -rotate-90 whitespace-nowrap">
            {formattedDate}
          </p>
        </div>
        <div className="flex-1 px-6 py-4">
          <p className="text-gray-500 text-sm mb-2">Available Balance</p>
          <h1 className="text-black text-4xl font-bold mb-4">
            {formatBalance(balance!)} SepoliaETH
          </h1>
          <div className="flex items-center justify-between">
            <p className="text-black text-lg font-semibold">
              {balanceInUSD} USD
            </p>
            <p
              className={`text-sm font-semibold ${isPriceChangePositive ? "text-green-500" : "text-red-500"}`}
            >
              {priceChange ?? "N/A"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
