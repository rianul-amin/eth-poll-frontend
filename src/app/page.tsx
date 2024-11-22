"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-210px)] flex items-center justify-center bg-gradient-to-r from-white via-[#f5fff5] to-[#e8f8e8] [background-position:70%] px-6 py-8 rounded-[30px] m-6 lg:m-10">
      <div className="max-w-8xl mx-auto flex flex-col lg:flex-row items-center gap-12 bg-white p-6 sm:p-8 lg:p-12 rounded-[30px] shadow-lg h-full">
        <div className="flex-1 text-center lg:text-left">
          <h1 className="text-4xl sm:text-7xl font-bold leading-tight text-gray-900">
            Empower your voice with{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-green-500 to-purple-500 bg-[length:200%_200%] animate-glow">
              EthPoll
            </span>
          </h1>
          <p className="mt-8 text-gray-700 text-lg">
            Participate in decentralized polls and ensure your opinion counts.
            Join us and vote on polls with full transparency, thanks to
            Ethereum's blockchain technology.
          </p>
          <div className="mt-10 flex flex-wrap justify-center lg:justify-start gap-4">
            <Link href="/polls">
              <button className="px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition">
                Start Voting
              </button>
            </Link>
            <button
              onClick={() => {
                window.open(
                  "https://sepolia.etherscan.io/address/0xF90dF81d6cFFd1469a1F91Ac633F2E40cE56dE99",
                  "_blank",
                );
              }}
              className="px-6 py-3 border border-black rounded-full hover:bg-[#061012] hover:text-white transition"
            >
              Visit Etherscan
            </button>
          </div>
        </div>
        <div className="flex-1">
          <div className="relative"></div>
        </div>
      </div>
    </div>
  );
}
