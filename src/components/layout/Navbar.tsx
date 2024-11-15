"use client";

import MetaMaskIcon from "@/svg/MetaMaskIcon";
import ActionMenu from "../common/ActionMenu";
import ThreeDotIcon from "@/svg/ThreeDotIcon";
import { useWallet } from "@/contexts/WalletContext";

export default function Navbar() {
  const { walletAddress, connectWallet, disconnectWallet } = useWallet();

  const options = [
    {
      label: "Log Out",
      onClick: () => disconnectWallet(),
    },
  ];

  return (
    <div className="w-full flex justify-between">
      <div></div>
      <div className="w-[220px] h-[60px] rounded-[8px] p-[2px] bg-gradient-to-r from-purple-500 via-pink-500 to-red-500">
        {walletAddress ? (
          <div className="w-full h-full rounded-[6px] flex items-center justify-center gap-[10px] px-[12px] bg-white shadow-[0px_8px_16px_0px_#6962FE5E,0px_0px_4px_0px_#2377FC0A]">
            <MetaMaskIcon />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-lg font-semibold text-ellipsis overflow-hidden">
              {walletAddress}
            </span>
            <ActionMenu
              options={options}
              width="120px"
              svg={<ThreeDotIcon />}
            />
          </div>
        ) : (
          <button
            onClick={connectWallet}
            className="w-full h-full rounded-[6px] flex items-center justify-center gap-[10px] px-[12px] bg-white shadow-[0px_8px_16px_0px_#6962FE5E,0px_0px_4px_0px_#2377FC0A]"
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-lg font-semibold">
              Connect Wallet
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
