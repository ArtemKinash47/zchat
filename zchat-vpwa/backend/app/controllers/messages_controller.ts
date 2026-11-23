import type { HttpContext } from '@adonisjs/core/http'
import Message from '#models/message'
import { sendMessage, messageToJson, recipientIds, type ChatType } from '#services/realtime'

export default class MessagesController {
  async index({ auth, params, request, response }: HttpContext) {
    const me = auth.use('api').getUserOrFail()
    const type: ChatType = request.input('type') === 'channel' ? 'channel' : 'direct'
    const id = Number(params.id)
    if (!(await recipientIds(type, id)).includes(me.id)) return response.forbidden({ message: 'Access denied' })

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
    return { messages: page.map((m) => messageToJson(m, me)), hasMore }
  }

  async store({ auth, params, request, response }: HttpContext) {
    const me = auth.use('api').getUserOrFail()
    const type: ChatType = request.input('type') === 'channel' ? 'channel' : 'direct'
    try {
      return { message: await sendMessage(me, type, Number(params.id), request.input('content')) }
    } catch (e) {
      return response.badRequest({ message: (e as Error).message })
    }
  }
  
}