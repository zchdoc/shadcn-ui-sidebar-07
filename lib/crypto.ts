// /lib/crypto.ts
export function encrypt(text: string): string {
  // 这里使用一个简单的key，实际应用中应该使用更复杂的密钥管理
  const SECRET_KEY = 'zch0414'

  // 使用异或运算进行简单 enc
  const encrypted = Array.from(text)
    .map((char, index) => {
      const keyChar = SECRET_KEY[index % SECRET_KEY.length]
      return String.fromCharCode(char.charCodeAt(0) ^ keyChar.charCodeAt(0))
    })
    .join('')

  // 转为 Base64 编码
  return btoa(encrypted)
}

export function decrypt(encrypted: string): string {
  try {
    const SECRET_KEY = 'zch0414'

    // Base64 解码
    const decoded = atob(encrypted)

    // 使用相同的异或运算进行dec
    return Array.from(decoded)
      .map((char, index) => {
        const keyChar = SECRET_KEY[index % SECRET_KEY.length]
        return String.fromCharCode(char.charCodeAt(0) ^ keyChar.charCodeAt(0))
      })
      .join('')
  } catch {
    return ''
  }
}
