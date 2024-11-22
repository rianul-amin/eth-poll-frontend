import { WalletApiInstance } from "../api/WalletApi";

class WalletService {
  async connectWallet(): Promise<string | null> {
    try {
      return await WalletApiInstance.connectWallet();
    } catch (error) {
      console.error("Error connecting wallet:", error);
      return null;
    }
  }

  disconnectWallet(): void {
    WalletApiInstance.disconnectWallet();
  }

  getConnectedWallet(): string | null {
    return WalletApiInstance.getConnectedWallet();
  }

  async checkIfAdmin(account: string): Promise<boolean> {
    return await WalletApiInstance.checkIfAdmin(account);
  }

  async getAccountInfo(): Promise<{
    balance: string | null;
    balanceInUSD: string | null;
    priceChange: string | null;
  }> {
    return await WalletApiInstance.getAccountInfo();
  }
}

const WalletServiceInstance = new WalletService();
export { WalletService, WalletServiceInstance };
