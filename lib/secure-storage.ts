// /lib/secure-storage.ts
import { decrypt, encrypt } from "@/lib/crypto"

export class SecureStorage {
  private static readonly ENCRYPTION_KEY = "your-secure-key"

  static setItem(key: string, value: string): void {
    try {
      const encryptedValue = encrypt(value)
      localStorage.setItem(key, encryptedValue)
    } catch (error) {
      console.error("Error saving to secure storage:", error)
    }
  }

  static getItem(key: string): string | null {
    try {
      const encryptedValue = localStorage.getItem(key)
      if (!encryptedValue) return null
      return decrypt(encryptedValue)
    } catch (error) {
      console.error("Error reading from secure storage:", error)
      return null
    }
  }

  static removeItem(key: string): void {
    localStorage.removeItem(key)
  }
}
