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
}

const WalletServiceInstance = new WalletService();
export { WalletService, WalletServiceInstance };
