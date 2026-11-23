import db from '@adonisjs/lucid/services/db'
import socket from '@rlanz/socket/services/main'
import DirectChat from '#models/direct_chat'
import Message from '#models/message'
import User from '#models/user'

export type ChatType = 'direct' | 'channel'

export function emitToUsers(ids: number[], event: string, build: (userId: number) => unknown) {
  for (const id of new Set(ids)) socket.to(`users/${id}`).emit(event, build(id))
}

export async function channelMemberIds(channelId: number) {
  const rows = await db.from('channel_users')
    .where('channel_id', channelId).where('is_banned', false).select('user_id')
  return rows.map((r) => r.user_id as number)
}

export async function recipientIds(type: ChatType, chatId: number) {
  if (type === 'direct') {
    const chat = await DirectChat.find(chatId)
    return chat ? [chat.userId1, chat.userId2] : []
  }
  return channelMemberIds(chatId)
}

function mentionsUser(content: string, nickname: string | null) {
  if (!nickname) return false
  const escaped = nickname.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return new RegExp(`(^|\\s)@${escaped}(?![A-Za-z0-9_])`, 'i').test(content)
}

export function messageToJson(m: Message, me: { id: number; nickname: string | null }) {
  const a = m.author
  return {
    id: m.id,
    content: m.content,
    createdAt: m.createdAt?.toISO(),
    mine: m.createdBy === me.id,
    isSystem: m.isSystem,
    mentionsMe: !m.isSystem && m.createdBy !== me.id && mentionsUser(m.content, me.nickname),
    sender: a ? [a.firstName, a.lastName].filter(Boolean).join(' ') || a.nickname || a.email : 'Unknown',
  }
}
export async function sendMessage(me: User, type: ChatType, chatId: number, raw: unknown) {
  const content = String(raw ?? '').trim()
  if (!content) throw new Error('Empty message')
  if (type !== 'direct' && type !== 'channel') throw new Error('Invalid chat type')

  const ids = await recipientIds(type, chatId)
  if (!ids.includes(me.id)) throw new Error('Access denied')

  const message = await Message.create({
    channelId: chatId, chatType: type === 'direct', content, createdBy: me.id,
  })
  await message.load('author')

  const users = await User.query().whereIn('id', ids)
  emitToUsers(ids, 'message:new', (uid) => ({
    type, chatId, message: messageToJson(message, users.find((u) => u.id === uid)!),
  }))
  return messageToJson(message, me)
}