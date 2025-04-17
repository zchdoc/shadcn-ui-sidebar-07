'use client'

import { useState } from 'react'
import { encrypt, decrypt } from '@/lib/crypto' // 确认 crypto.ts 的路径
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function CryptoTestPage() {
  const [inputText, setInputText] = useState('')
  const [encryptedText, setEncryptedText] = useState('')
  const [decryptedText, setDecryptedText] = useState('')
  const [error, setError] = useState('')

  const handleEncrypt = () => {
    if (!inputText) {
      setError('请输入要加密的文本')
      return
    }
    try {
      const encrypted = encrypt(inputText)
      setEncryptedText(encrypted)
      setDecryptedText('') // 清除之前的解密结果
      setError('')
    } catch (err) {
      setError('加密失败')
      console.error(err)
    }
  }

  const handleDecrypt = () => {
    if (!encryptedText) {
      setError('请先加密文本')
      return
    }
    try {
      const decrypted = decrypt(encryptedText)
      if (decrypted === '') {
        setError('解密失败或密文无效')
      } else {
        setDecryptedText(decrypted)
        setError('')
      }
    } catch (err) {
      setError('解密失败')
      console.error(err)
    }
  }

  return (
    <div className="w-full mx-auto p-4">
      <Card className="w-full shadow-lg">
        <CardHeader className="dark:bg-gray-800 bg-gray-50">
          <CardTitle className="text-xl dark:text-white">加密/解密测试</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <div>
            <label htmlFor="inputText" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              输入文本:
            </label>
            <Input
              id="inputText"
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="输入要加密的字符串"
              className="w-full text-base py-2"
            />
          </div>

          <div className="flex space-x-4">
            <Button onClick={handleEncrypt} className="px-6 py-2 text-base">加密</Button>
            <Button onClick={handleDecrypt} disabled={!encryptedText} className="px-6 py-2 text-base">解密</Button>
          </div>

          {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

          {encryptedText && (
            <div className="border rounded-md p-4 bg-gray-50 dark:bg-gray-800">
              <h3 className="text-lg font-semibold mb-2 dark:text-white">加密结果:</h3>
              <div className="max-h-64 overflow-y-auto">
                <pre className="break-all whitespace-pre-wrap bg-white dark:bg-gray-700 p-4 rounded border text-base font-mono dark:text-gray-200">{encryptedText}</pre>
              </div>
            </div>
          )}

          {decryptedText && (
            <div className="border rounded-md p-4 bg-gray-50 dark:bg-gray-800">
              <h3 className="text-lg font-semibold mb-2 dark:text-white">解密结果:</h3>
              <div className="max-h-64 overflow-y-auto">
                <pre className="break-all whitespace-pre-wrap bg-white dark:bg-gray-700 p-4 rounded border text-base font-mono dark:text-gray-200">{decryptedText}</pre>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 