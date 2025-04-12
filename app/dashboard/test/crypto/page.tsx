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
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>加密/解密测试</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="inputText" className="block text-sm font-medium text-gray-700 mb-1">
              输入文本:
            </label>
            <Input
              id="inputText"
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="输入要加密的字符串"
            />
          </div>

          <div className="flex space-x-2">
            <Button onClick={handleEncrypt}>加密</Button>
            <Button onClick={handleDecrypt} disabled={!encryptedText}>解密</Button>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          {encryptedText && (
            <div>
              <h3 className="text-lg font-semibold">加密结果:</h3>
              <p className="break-all bg-gray-100 p-2 rounded">{encryptedText}</p>
            </div>
          )}

          {decryptedText && (
            <div>
              <h3 className="text-lg font-semibold">解密结果:</h3>
              <p className="break-all bg-gray-100 p-2 rounded">{decryptedText}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 