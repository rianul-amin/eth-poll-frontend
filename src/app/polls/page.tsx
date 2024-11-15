"use client";

import React, { useState, useEffect } from "react";
import Web3 from "web3";
import { contractAddress, contractABI } from "@/constants/constants";
import { useWallet } from "@/contexts/WalletContext";
import CreatePollModal from "@/components/polls/CreatePollModal";
import { Poll } from "@/interfaces/Poll";

const Polls = () => {
  const { walletAddress, isAdmin } = useWallet();
  const [polls, setPolls] = useState<Poll[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreatePollModal, setShowCreatePollModal] = useState(false);

  useEffect(() => {
    if (walletAddress) {
      fetchPolls();
    } else {
      setPolls([]);
      setIsLoading(false);
    }
  }, [walletAddress]);

  const fetchPolls = async () => {
    const web3 = new Web3(window.ethereum);
    const contract = new web3.eth.Contract(contractABI, contractAddress);

    try {
      const numberOfPolls = Number(await contract.methods.pollCount().call());
      const allPolls: Poll[] = [];

      for (let i = 0; i < numberOfPolls; i++) {
        const poll: Poll = await contract.methods.polls(i).call();
        if (poll) {
          const validPoll: Poll = {
            title: poll.title,
            description: poll.description,
            options: poll.options,
            votes: poll.votes,
            duration: poll.duration,
            endTime: poll.endTime,
            isClosed: poll.isClosed,
          };
          allPolls.push(validPoll);
        }
      }

      setPolls(allPolls);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching polls:", error);
      setIsLoading(false);
    }
  };

  const handleCreatePoll = () => {
    if (!isAdmin) {
      alert("Only admins can create polls");
    } else {
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-8 p-10 relative">
      <div className="mt-10">
        {isLoading ? (
          <p>Loading polls...</p>
        ) : polls.length > 0 ? (
          <ul>
            {polls.map((poll, index) => (
              <li key={index} className="mb-6">
                <h3 className="font-semibold">{poll.title}</h3>
                <p>{poll.description}</p>
                <p>Options: {poll.options.join(", ")}</p>
                <p>Status: {poll.isClosed ? "Closed" : "Open"}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No polls available.</p>
        )}
      </div>

      {isAdmin && walletAddress && (
        <div className="fixed bottom-40 right-40">
          <div className="w-[220px] h-[60px] rounded-[8px] p-[2px] bg-gradient-to-r from-[#2377FC] to-[#6962FE]">
            <button
              onClick={() => setShowCreatePollModal(true)}
              className="w-full h-full rounded-[6px] flex items-center justify-center gap-[10px] px-[12px] bg-white shadow-[0px_8px_16px_0px_#6962FE5E,0px_0px_4px_0px_#2377FC0A]"
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2377FC] to-[#6962FE] text-lg font-semibold">
                Create Poll
              </span>
            </button>
          </div>
        </div>
      )}

      {showCreatePollModal && (
        <CreatePollModal setShow={setShowCreatePollModal}></CreatePollModal>
      )}
    </div>
  );
};

export default Polls;
