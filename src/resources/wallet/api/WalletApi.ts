import axios from "axios";
import { contractABI, contractAddress } from "@/constants/constants";
import Web3 from "web3";

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

  async getAccountInfo(): Promise<{
    balance: string | null;
    balanceInUSD: string | null;
    priceChange: string | null;
  }> {
    if (typeof window.ethereum !== "undefined") {
      const web3 = new Web3(window.ethereum);

      const sepoliaNetwork = "https://rpc.sepolia.org";
      web3.setProvider(sepoliaNetwork);

      try {
        const accounts = (await window.ethereum.request({
          method: "eth_accounts",
        })) as string[] | null;

        if (accounts && accounts.length > 0) {
          const account = accounts[0];

          const balance = await web3.eth.getBalance(account);
          const balanceInEther = web3.utils.fromWei(balance, "ether");

          const ethPrice = await this.getEthereumPrice();
          const balanceInUSD = (parseFloat(balanceInEther) * ethPrice).toFixed(
            2,
          );

          const priceChange = await this.getPriceChangePercentage();

          return { balance: balanceInEther, balanceInUSD, priceChange };
        } else {
          console.error("No connected account found.");
          return { balance: null, balanceInUSD: null, priceChange: null };
        }
      } catch (error) {
        console.error("Error fetching account info:", error);
        return { balance: null, balanceInUSD: null, priceChange: null };
      }
    } else {
      console.error("MetaMask is not installed.");
      return { balance: null, balanceInUSD: null, priceChange: null };
    }
  }

  async getEthereumPrice(): Promise<number> {
    const url =
      "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd";

    try {
      const response = await axios.get(url, {
        timeout: 5000,
      });
      return response.data.ethereum.usd || 0;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Network error fetching Ethereum price:", error.message);
      } else {
        console.error("Unexpected error fetching Ethereum price:", error);
      }
      return 0;
    }
  }

  async getPriceChangePercentage(): Promise<string> {
    const url = "https://api.coingecko.com/api/v3/coins/ethereum";

    try {
      const response = await axios.get(url, {
        timeout: 5000,
      });

      const priceChange24h =
        response.data.market_data?.price_change_percentage_24h || 0;

      return `${priceChange24h > 0 ? "+" : ""}${priceChange24h.toFixed(2)}%`;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Network error fetching price change:", error.message);
      } else {
        console.error("Unexpected error fetching price change:", error);
      }
      return "N/A";
    }
  }
}

const WalletApiInstance = new WalletApi();
export { WalletApi, WalletApiInstance };
