"use client";

import React, { useEffect, useState } from "react";
import Web3 from "web3";
import { contractAddress, contractABI } from "@/constants/constants";
import { useWallet } from "@/contexts/WalletContext";

interface PollDetails {
  pollId: number;
  title: string;
  description: string;
  options: string[];
  userVotedOption: string | null;
}

interface VotingHistoryDetails {
  pollIds: string[];
  votedOptions: string[];
}

const VotingHistory = () => {
  const { walletAddress } = useWallet();
  const [polls, setPolls] = useState<PollDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (walletAddress) {
      fetchPollsAndUserVotes();
    } else {
      setPolls([]);
    }
  }, [walletAddress]);

  const fetchPollsAndUserVotes = async () => {
    try {
      setIsLoading(true);
      const web3 = new Web3((window as any).ethereum);
      const contract = new web3.eth.Contract(contractABI, contractAddress);

      const userHistory = (await contract.methods.getUserVotingHistory(walletAddress).call()) as VotingHistoryDetails;

      const pollIds = userHistory.pollIds.map((id) => id.toString());
      const votedOptions = userHistory.votedOptions || [];

      const fetchedPolls: (PollDetails | null)[] = await Promise.all(
        pollIds.map(async (pollIdStr, index) => {
          const pollId = parseInt(pollIdStr, 10);
          const pollData = await contract.methods.getPollInfo(pollId).call();

          if (pollData && typeof pollData === "object") {
            return {
              pollId: pollId,
              title: pollData[0],
              description: pollData[1],
              options: pollData[2],
              userVotedOption: votedOptions[index] || null,
            };
          } else {
            return null;
          }
        }),
      );

      const validPolls = fetchedPolls.filter(
        (poll): poll is PollDetails => poll !== null,
      );
      setPolls(validPolls);
    } catch (error) {
      setPolls([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <h2 className="text-3xl font-semibold text-white mb-6">Voting History</h2>
      {isLoading ? (
        <p className="text-gray-400">Loading voting history...</p>
      ) : polls.length > 0 ? (
        <div className="space-y-6">
          {polls.map((poll) => (
            <div
              key={poll.pollId}
              className="p-[2px] bg-gradient-to-r from-blue-500 via-green-500 to-purple-500 rounded-xl bg-[length:200%_200%] animate-gradientShift transition"
            >
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex flex-col">
                    <h3 className="text-lg font-bold text-white truncate">
                      {poll.title}
                    </h3>
                  </div>
                </div>
                <p className="text-sm text-gray-400 mb-4">{poll.description}</p>
                <div className="text-sm text-gray-500">
                  <ul className="space-y-2 mt-2">
                    {poll.options.map((option, idx) => (
                      <li
                        key={idx}
                        className={`${
                          poll.userVotedOption === option
                            ? "text-green-500 font-semibold"
                            : "text-gray-500"
                        }`}
                      >
                        {option}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400">No voting history available.</p>
      )}
    </div>
  );
};

export default VotingHistory;
