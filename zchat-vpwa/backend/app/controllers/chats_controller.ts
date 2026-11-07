import type { HttpContext } from '@adonisjs/core/http'
import DirectChat from '#models/direct_chat'
import User from '#models/user'

export default class ChatsController {
async index({ auth }: HttpContext) {
    const me = auth.use('api').getUserOrFail()

    await me.load('channels', (q) => q.preload('users'))

    const directChats = await DirectChat.query()
      .where('userId1', me.id)
      .orWhere('userId2', me.id)
      .preload('chatter1')
      .preload('chatter2')

    return {
      directChats: directChats.map((chat) => {
        const other = chat.userId1 === me.id ? chat.chatter2 : chat.chatter1
        return {
          id: chat.id,
          name: [other.firstName, other.lastName].filter(Boolean).join(' ') || other.nickname,
          hasNickname: true,
          nickname: other.nickname,
          avatar: null,
          isOnline: 0,
          unreadCount: 0,
          new: chat.new ?? false,
        }
      }),
      channels: me.channels.map((channel) => ({
        id: channel.id,
        name: channel.name,
        isPrivate: channel.isPrivate,
        unreadCount: 0,
        onlineCount: 0,
        new: false,
        usersList: channel.users.map((u) => ({
          id: u.id,
          name: u.nickname ?? u.email,
          isOnline: 0,
          admin: u.$extras.pivot_is_admin ?? false,
        })),
      })),
    }
  }
    async storeDirect({ auth, request, response }: HttpContext) {
    const me = auth.use('api').getUserOrFail()
    const nickname = String(request.input('nickname', '')).trim().replace(/^@/, '')
    if (!nickname) return response.badRequest({ message: 'Nickname is required' })

    const other = await User.query().whereRaw('LOWER(nickname) = ?', [nickname.toLowerCase()]).first()
    if (!other) return response.notFound({ message: 'User not found' })
    if (other.id === me.id) return response.badRequest({ message: 'You cannot chat with yourself' })


    const [u1, u2] = me.id < other.id ? [me.id, other.id] : [other.id, me.id]
    const chat = await DirectChat.firstOrCreate({ userId1: u1, userId2: u2 }, { new: true })

    return {
        chat: {
        id: chat.id,
        name: [other.firstName, other.lastName].filter(Boolean).join(' ') || other.nickname,
        hasNickname: true,
        nickname: other.nickname,
        avatar: null,
        isOnline: 0,
        unreadCount: 0,
        new: Boolean(chat.new),
        },
    }
    }
}
