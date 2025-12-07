/**
 * MascotChat Component
 * Chat interface for conversing with Dory the dolphin
 */

'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Sparkles, TrendingUp, Award } from 'lucide-react'
import { useMascotStore } from '@/stores/mascotStore'
import { DolphinAvatar } from './DolphinAvatar'
import { generateMascotResponse, type ConversationContext } from '@/services/mascot.service'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'

interface MascotChatProps {
  context?: ConversationContext
}

export function MascotChat({ context }: MascotChatProps) {
  const { messages, userStats, currentMood, addMessage, setMood } = useMascotStore()
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Handle send message
  const handleSend = async () => {
    if (!inputValue.trim()) return

    const userMessage = inputValue.trim()
    setInputValue('')

    // Add user message
    addMessage(userMessage, 'user')

    // Show typing indicator
    setIsTyping(true)
    setMood('thinking')

    // Simulate delay for AI response
    setTimeout(async () => {
      try {
        const response = await generateMascotResponse(userMessage, {
          ...context,
          userStats: userStats || undefined,
        } as ConversationContext)

        // Add mascot response
        addMessage(response.text, 'mascot', context?.page)
        setMood(response.mood)
      } catch (error) {
        console.error('Error generating response:', error)
        addMessage(
          'Ối! Mình bị lỗi rồi. Bạn thử hỏi lại nhé! 😅',
          'mascot',
          context?.page
        )
        setMood('concerned')
      } finally {
        setIsTyping(false)
      }
    }, 1000)
  }

  // Quick action buttons
  const quickActions = [
    { icon: Sparkles, label: 'Gợi ý bài test', query: 'Gợi ý bài test cho mình' },
    { icon: TrendingUp, label: 'Tiến độ', query: 'Tiến độ của mình thế nào?' },
    { icon: Award, label: 'Thành tích', query: 'Cho mình xem thành tích' },
  ]

  return (
    <motion.div
      className="w-80 sm:w-96 h-[500px] bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-4 flex items-center gap-3">
        <DolphinAvatar mood={currentMood} size="sm" />
        <div className="flex-1">
          <h3 className="font-bold text-white text-lg">Dory 🐬</h3>
          <p className="text-xs text-blue-100">
            {isTyping ? 'Đang nhập...' : 'Luôn sẵn sàng hỗ trợ bạn!'}
          </p>
        </div>
        {/* Stats badge */}
        <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
          <p className="text-xs font-semibold text-white">
            Level {userStats.level}
          </p>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.length === 0 && (
            <motion.div
              className="text-center py-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className="text-gray-500 text-sm mb-4">
                Chào bạn! Mình là Dory 🐬
              </p>
              <p className="text-gray-400 text-xs">
                Hãy hỏi mình bất cứ điều gì về các bài test, sức khỏe tinh thần, hoặc cách phát triển bản thân nhé!
              </p>
            </motion.div>
          )}

          {messages.map((msg, index) => (
            <motion.div
              key={msg.id}
              className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              {msg.type === 'mascot' && (
                <div className="flex gap-2 max-w-[80%]">
                  <DolphinAvatar mood={msg.mood || 'idle'} size="sm" />
                  <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-2">
                    <p className="text-sm text-gray-800">{msg.text}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(msg.timestamp).toLocaleTimeString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              )}

              {msg.type === 'user' && (
                <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl rounded-tr-sm px-4 py-2 max-w-[80%]">
                  <p className="text-sm text-white">{msg.text}</p>
                  <p className="text-xs text-blue-100 mt-1 text-right">
                    {new Date(msg.timestamp).toLocaleTimeString('vi-VN', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              )}
            </motion.div>
          ))}

          {/* Typing Indicator */}
          <AnimatePresence>
            {isTyping && (
              <motion.div
                className="flex gap-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <DolphinAvatar mood="thinking" size="sm" />
                <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3">
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 bg-gray-400 rounded-full"
                        animate={{
                          y: [0, -6, 0],
                        }}
                        transition={{
                          repeat: Infinity,
                          duration: 0.6,
                          delay: i * 0.1,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </ScrollArea>

      {/* Quick Actions */}
      {messages.length === 0 && (
        <div className="px-4 pb-2">
          <p className="text-xs text-gray-500 mb-2">Câu hỏi gợi ý:</p>
          <div className="flex flex-wrap gap-2">
            {quickActions.map((action) => (
              <button
                key={action.label}
                onClick={() => {
                  setInputValue(action.query)
                  inputRef.current?.focus()
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 rounded-full text-xs font-medium text-gray-700 transition-colors"
              >
                <action.icon className="w-3 h-3" />
                {action.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 border-t border-gray-100 bg-gray-50">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Nhập tin nhắn..."
            className="flex-1 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isTyping}
          />
          <Button
            onClick={handleSend}
            disabled={!inputValue.trim() || isTyping}
            className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 flex items-center justify-center"
            size="icon"
          >
            <Send className="w-4 h-4 text-white" />
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
