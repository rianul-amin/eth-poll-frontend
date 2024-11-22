import Web3 from "web3";
import { contractABI, contractAddress } from "@/constants/constants";
import { PollInputs } from "@/types/PollInputs";

class PollsApi {
  web3: Web3 | null = null;
  contract: any | null = null;

  constructor() {
    if (
      typeof window !== "undefined" &&
      typeof window.ethereum !== "undefined"
    ) {
      this.web3 = new Web3(window.ethereum);
      this.contract = new this.web3.eth.Contract(contractABI, contractAddress);
    } else {
      console.warn("Ethereum provider not found. Please install MetaMask.");
    }
  }

  async createPoll(
    { title, description, options, endTime }: PollInputs,
    account: string,
  ) {
    if (!this.contract) {
      throw new Error(
        "Contract is not initialized. Ensure MetaMask is installed.",
      );
    }

    try {
      const currentTime = Math.floor(Date.now() / 1000);
      const duration = endTime - currentTime;

      if (duration <= 0) {
        throw new Error("End time must be in the future");
      }
      console.log(options);
      const gas = await this.contract.methods
        .createPoll(title, description, options, duration)
        .estimateGas({ from: account });

      const tx = await this.contract.methods
        .createPoll(title, description, options, duration)
        .send({ from: account, gas });

      console.log("Poll created successfully:", tx);
      return tx;
    } catch (error) {
      console.error("Error creating poll:", error);
      throw error;
    }
  }

  async vote(pollId: number, optionIndex: number, account: string) {
    if (!this.contract) {
      throw new Error(
        "Contract is not initialized. Ensure MetaMask is installed.",
      );
    }

    try {
      const gas = await this.contract.methods
        .vote(pollId, optionIndex)
        .estimateGas({ from: account });

      const tx = await this.contract.methods
        .vote(pollId, optionIndex)
        .send({ from: account, gas });

      console.log("Vote submitted successfully:", tx);
      return tx;
    } catch (error) {
      console.error("Error voting:", error);
      throw error;
    }
  }

  async closePoll(pollId: number, account: string) {
    if (!this.contract) {
      throw new Error(
        "Contract is not initialized. Ensure MetaMask is installed.",
      );
    }

    try {
      const gas = await this.contract.methods
        .closePoll(pollId)
        .estimateGas({ from: account });

      const tx = await this.contract.methods
        .closePoll(pollId)
        .send({ from: account, gas });

      console.log("Poll closed successfully:", tx);
      return tx;
    } catch (error) {
      console.error("Error closing poll:", error);
      throw error;
    }
  }
}

let PollsApiInstance: PollsApi | null = null;

if (typeof window !== "undefined") {
  PollsApiInstance = new PollsApi();
}

export { PollsApi, PollsApiInstance };
