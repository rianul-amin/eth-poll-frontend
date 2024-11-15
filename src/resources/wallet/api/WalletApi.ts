import { contractABI, contractAddress } from "@/constants/constants";
import { Web3 } from "web3";

class WalletApi {
  async connectWallet(): Promise<string | null> {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = (await window.ethereum.request({
          method: "eth_requestAccounts",
        })) as string[];

        if (accounts && accounts.length > 0) {
          const account = accounts[0];
          localStorage.setItem("connectedWalletAddress", account);
          return account;
        } else {
          console.error("No accounts found.");
          return null;
        }
      } catch (error) {
        console.error("Connection to MetaMask failed:", error);
        return null;
      }
    } else {
      console.error("MetaMask is not installed.");
      return null;
    }
  }

  disconnectWallet() {
    localStorage.removeItem("connectedWalletAddress");
  }

  getConnectedWallet(): string | null {
    const storedAddress = localStorage.getItem("connectedWalletAddress");
    return storedAddress ? storedAddress : null;
  }

  async checkIfAdmin(account: string): Promise<boolean> {
    const web3 = new Web3(window.ethereum);
    const contract = new web3.eth.Contract(contractABI, contractAddress);
    try {
      const adminAddress = (await contract.methods.admin().call()) as string;
      return account.toLowerCase() === adminAddress.toLowerCase();
    } catch (error) {
      console.error("Error checking admin status:", error);
      return false;
    }
  }
}

const WalletApiInstance = new WalletApi();
export { WalletApi, WalletApiInstance };
