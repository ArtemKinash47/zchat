import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import DirectChat from '#models/direct_chat'
import Message from '#models/message'

export default class MessagesController {
  private async canAccess(userId: number, type: string, id: number) {
    if (type === 'direct') {
      const chat = await DirectChat.find(id)
      return !!chat && (chat.userId1 === userId || chat.userId2 === userId)
    }
    const row = await db.from('channel_users').where('channel_id', id).where('user_id', userId).first()
    return !!row
  }

  private toJson(m: Message, meId: number) {
    const a = m.author
    return {
      id: m.id,
      content: m.content,
      createdAt: m.createdAt?.toISO(),
      mine: m.createdBy === meId,
      sender: a ? [a.firstName, a.lastName].filter(Boolean).join(' ') || a.nickname || a.email : 'Unknown',
    }
  }

  async index({ auth, params, request, response }: HttpContext) {
    const me = auth.use('api').getUserOrFail()
    const type = request.input('type') === 'channel' ? 'channel' : 'direct'
    const id = Number(params.id)
    if (!(await this.canAccess(me.id, type, id))) return response.forbidden({ message: 'Access denied' })

    const limit = Math.min(Number(request.input('limit')) || 20, 50)
    const before = Number(request.input('before')) || null

    const rows = await Message.query()
      .where('channelId', id)
      .where('chatType', type === 'direct')
      .if(before, (q) => q.where('id', '<', before!))
      .preload('author')
      .orderBy('id', 'desc')
      .limit(limit + 1)

    const hasMore = rows.length > limit
    const page = rows.slice(0, limit).reverse()
    return { messages: page.map((m) => this.toJson(m, me.id)), hasMore }
  }

  async store({ auth, params, request, response }: HttpContext) {
    const me = auth.use('api').getUserOrFail()
    const type = request.input('type') === 'channel' ? 'channel' : 'direct'
    const id = Number(params.id)
    const content = String(request.input('content', '')).trim()
    if (!content) return response.badRequest({ message: 'Empty message' })
    if (!(await this.canAccess(me.id, type, id))) return response.forbidden({ message: 'Access denied' })

    const message = await Message.create({
      channelId: id,
      chatType: type === 'direct',
      content,
      createdBy: me.id,
    })
    await message.load('author')
    return { message: this.toJson(message, me.id) }
  }
}