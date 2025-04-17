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
      setError('请输入文本')
      return
    }
    try {
      const encrypted = encrypt(inputText)
      setEncryptedText(encrypted)
      setDecryptedText('') // 清除之前的结果
      setError('')
    } catch (err) {
      setError('失败')
      console.error(err)
    }
  }

  const handleDecrypt = () => {
    if (!encryptedText) {
      setError('请先文本')
      return
    }
    try {
      const decrypted = decrypt(encryptedText)
      if (decrypted === '') {
        setError('失败或文本无效')
      } else {
        setDecryptedText(decrypted)
        setError('')
      }
    } catch (err) {
      setError('失败')
      console.error(err)
    }
  }

  return (
    <div className="flex justify-center w-full py-8">
      <div className="w-full max-w-5xl px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="w-full shadow-md min-h-[300px]">
            <CardHeader className="border-b">
              <CardTitle className="text-xl">测试</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="mb-6">
                <label
                  htmlFor="inputText"
                  className="block text-sm font-medium mb-2"
                >
                  输入文本:
                </label>
                <Input
                  id="inputText"
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="输入要处理的字符串"
                  className="w-full text-base py-2"
                />
              </div>
              <div className="grid grid-cols-2 gap-4 w-full">
                <Button onClick={handleEncrypt} className="w-full px-6 py-2">
                  ENC
                </Button>
                <Button
                  onClick={handleDecrypt}
                  disabled={!encryptedText}
                  variant={!encryptedText ? 'outline' : 'default'}
                  className="w-full px-6 py-2"
                >
                  DEC
                </Button>
              </div>
              {error && (
                <p className="text-red-500 text-sm font-medium mt-4">{error}</p>
              )}
            </CardContent>
          </Card>
          <Card className="w-full shadow-md min-h-[300px]">
            <CardHeader className="border-b">
              <CardTitle className="text-xl">结果</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {encryptedText && (
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2">结果:</h3>
                  <div className="p-4 rounded max-h-32 overflow-y-auto">
                    <pre className="break-all whitespace-pre-wrap text-sm">
                      {encryptedText}
                    </pre>
                  </div>
                </div>
              )}
              {decryptedText && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">结果:</h3>
                  <div className="bg-muted p-4 rounded max-h-32 overflow-y-auto">
                    <pre className="break-all whitespace-pre-wrap text-sm">
                      {decryptedText}
                    </pre>
                  </div>
                </div>
              )}
              {!encryptedText && !decryptedText && (
                <div className="flex items-center justify-center py-16 text-muted-foreground">
                  请先输入文本
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
