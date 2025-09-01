import CryptoJS from "crypto-js";

class BlockchainEncryption {
  constructor() {

    this.encryptionKey = "my-super-secret-key-123"; 
  }

  encryptData(data) { 
    try {
      if (typeof data === "object") {
        data = JSON.stringify(data);
      }
      return CryptoJS.AES.encrypt(data, this.encryptionKey).toString();
    } catch (error) {
      console.error("Encryption error:", error);
      return data;
    }
  }

  decryptData(encryptedData) {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, this.encryptionKey);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      try {
        return JSON.parse(decrypted);
      } catch {
        return decrypted;
      }
    } catch (error) {
      console.error("Decryption error:", error);
      return encryptedData;
    }
  }

  generateHash(data) {
    return CryptoJS.SHA256(JSON.stringify(data)).toString();
  }

  async logToBlockchain(data, type = "LOGIN") {
    try {
      const timestamp = new Date().toISOString();
      const hash = this.generateHash({ data, timestamp, type });

      const transaction = {
        hash,
        type,
        timestamp,
        data: this.encryptData(data),
        verified: true,
      };

      const existingLogs = this.getBlockchainLogs();
      existingLogs.push(transaction);
      localStorage.setItem("blockchain_logs", JSON.stringify(existingLogs));

      console.log("Blockchain log created:", transaction);
      return transaction;
    } catch (error) {
      console.error("Blockchain logging error:", error);
      return null;
    }
  }

  getBlockchainLogs() {
    try {
      return JSON.parse(localStorage.getItem("blockchain_logs") || "[]");
    } catch {
      return [];
    }
  }

  clearLogs() {
    localStorage.removeItem("blockchain_logs");
  }
}

export default new BlockchainEncryption();