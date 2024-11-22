"use client";

import React, { useState, useEffect } from "react";
import Web3 from "web3";
import { contractAddress, contractABI } from "@/constants/constants";
import { useWallet } from "@/contexts/WalletContext";
import CreatePollModal from "@/components/polls/CreatePollModal";
import ProfileCard from "@/components/profile/ProfileCard";
import ActionMenu from "@/components/common/ActionMenu";
import ThreeDotIcon from "@/svg/ThreeDotIcon";
import { PollsServiceInstance } from "@/resources/polls/service/PollsService";
import VotingHistory from "@/components/polls/VotingHistory";

const Polls = () => {
  const { walletAddress, isAdmin } = useWallet();
  const [polls, setPolls] = useState<Poll[]>([]);
  const [expandedCards, setExpandedCards] = useState<number[]>([]);
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
    try {
      setIsLoading(true);
      const web3 = new Web3((window as any).ethereum);
      const contract = new web3.eth.Contract(contractABI, contractAddress);
      const pollCount = parseInt(await contract.methods.pollCount().call(), 10);
      const allPolls: Poll[] = [];

      for (let i = 0; i < pollCount; i++) {
        const pollData = (await contract.methods
          .getPollInfo(i)
          .call()) as unknown as PollInfo;

        const poll: Poll = {
          title: pollData[0],
          description: pollData[1],
          options: pollData[2],
          votes: pollData[3].map((vote: number) => Number(vote)),
          duration: Number(pollData[4]),
          endTime: Number(pollData[5]),
          isClosed: pollData[6],
          status: pollData[7],
          remainingTime: Number(pollData[8]),
        };

        allPolls.push(poll);
      }

      setPolls(allPolls);
    } catch (error) {
      console.error("Error fetching polls:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleExpand = (index: number) => {
    setExpandedCards((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  const handleVote = async (pollIndex: number, optionIndex: number) => {
    try {
      if (!walletAddress) {
        throw new Error("Wallet not connected");
      }

      const poll = polls[pollIndex];
      if (poll.isClosed || poll.status !== "Open") {
        throw new Error("Poll is closed");
      }

      console.log(`Voting on poll ${pollIndex}, option ${optionIndex}`);
      const tx = await PollsServiceInstance?.vote(
        pollIndex,
        optionIndex,
        walletAddress,
      );

      console.log("Vote successful:", tx);
      fetchPolls();
    } catch (error) {
      console.error("Error voting:", error);
    }
  };

  const handleClosePoll = async (pollId: number) => {
    try {
      if (!walletAddress) {
        throw new Error("Wallet not connected");
      }

      const tx = await PollsServiceInstance?.closePoll(pollId, walletAddress);
      console.log("Poll closed successfully:", tx);

      fetchPolls();
    } catch (error) {
      console.error("Error closing poll:", error);
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="flex-[1.5] min-h-[calc(100vh-210px)] mt-8 mb-8 ml-16 mr-6 pt-10 space-y-16">
        <ProfileCard />
        { !isAdmin && (
          <div>
           <VotingHistory />
          </div>
        )}
      </div>

      <div className="flex-[3] min-h-[calc(100vh-210px)] p-10 rounded-[30px] mt-8 mb-8">
        {isLoading ? (
          <p className="text-left text-white">Loading polls...</p>
        ) : polls.length > 0 ? (
          <div className="space-y-6">
            {polls.map((poll, index) => (
              <div
                key={index}
                className={`relative p-[2px] rounded-2xl ${
                  poll.remainingTime > 0
                    ? "bg-gradient-to-r from-green-900 via-green-500 to-green-900"
                    : "bg-gradient-to-r from-red-900 via-red-500 to-red-900"
                } bg-[length:200%_200%] animate-gradientShift`}
              >
                <div
                  className="bg-[#061012] rounded-2xl p-6 space-y-4"
                  onClick={() => toggleExpand(index)}
                >
                  <div className="flex items-start justify-between">
                    <h3 className="text-xl font-semibold text-white truncate">
                      {poll.title}
                    </h3>
                    {poll.remainingTime > 0 && isAdmin && (
                      <div onClick={(e) => e.stopPropagation()}>
                        <ActionMenu
                          options={[
                            {
                              label: "Close Poll",
                              onClick: () => handleClosePoll(index),
                            },
                          ]}
                          svg={<ThreeDotIcon />}
                          width="120px"
                        />
                      </div>
                    )}
                  </div>
                  <p
                    className={`text-sm text-white ${
                      expandedCards.includes(index)
                        ? "whitespace-normal"
                        : "line-clamp-3"
                    }`}
                  >
                    {poll.description}
                  </p>
                  {expandedCards.includes(index) && (
                    <div className="text-sm text-white space-y-2">
                      <p>
                        <strong>Status:</strong> {poll.status}
                      </p>
                      <p>
                        <strong>Options:</strong> {poll.options.join(", ")}
                      </p>
                      <p>
                        <strong>Votes:</strong> {poll.votes.join(", ")}
                      </p>
                      <p>
                        <strong>Remaining Time:</strong> {poll.remainingTime}{" "}
                        seconds
                      </p>
                      <br />
                      {poll.remainingTime > 0 &&
                        !isAdmin &&
                        poll.status === "Open" && (
                          <div>
                            {poll.options.map((option, optionIndex) => (
                              <button
                                key={optionIndex}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleVote(index, optionIndex);
                                }}
                                className="px-4 py-2 bg-white text-black rounded-full mb-4 w-full mb-4"
                              >
                                Vote for "{option}"
                              </button>
                            ))}
                          </div>
                        )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-left text-white">No polls available.</p>
        )}
      </div>
      <div className="flex-[1.5] min-h-[calc(100vh-210px)] mt-8 mb-8 ml-6 mr-16 pt-10"></div>
      {isAdmin && walletAddress && (
        <button
          onClick={() => setShowCreatePollModal(true)}
          className="fixed bottom-40 right-40 w-16 h-16 rounded-full bg-white text-black text-xl font-bold flex items-center justify-center shadow-lg hover:scale-105 transition"
        >
          +
        </button>
      )}
      {showCreatePollModal && (
        <CreatePollModal setShow={setShowCreatePollModal} />
      )}
    </div>
  );
};

export default Polls;
