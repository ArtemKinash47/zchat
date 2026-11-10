import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import DirectChat from '#models/direct_chat'
import User from '#models/user'
import Channel from '#models/channel'
import Message from '#models/message'

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

    const other = await User.query()
      .whereRaw('LOWER(nickname) = ?', [nickname.toLowerCase()])
      .first()
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

  async searchUsers({ auth, request }: HttpContext) {
    const me = auth.use('api').getUserOrFail()
    const search = String(request.input('search', '')).trim().slice(0, 20)
    if (!search) return { nicknames: [] }

    const users = await User.query()
      .whereNot('id', me.id)
      .whereNotNull('nickname')
      .whereRaw('LOWER(nickname) LIKE ?', [`%${search.toLowerCase()}%`])
      .orderBy('nickname')
      .limit(50)

    return {
      nicknames: users
        .map((user) => user.nickname)
        .filter((nickname): nickname is string => nickname !== null),
    }
  }

  async storeChannel({ auth, request, response }: HttpContext) {
    const me = auth.use('api').getUserOrFail()
    const name = String(request.input('name', '')).trim()
    const isPrivate = request.input('isPrivate') === true
    const membersInput: unknown = request.input('members', [])

    if (!name) {
      return response.badRequest({ message: 'Channel name is required' })
    }

    if (
      !Array.isArray(membersInput) ||
      membersInput.some((member: unknown) => typeof member !== 'string')
    ) {
      return response.badRequest({ message: 'Members must be a list of nicknames' })
    }

    const memberNicknames = [
      ...new Set(
        membersInput
          .map((nickname: string) => nickname.trim().replace(/^@/, '').toLowerCase())
          .filter(Boolean)
      ),
    ]

    if (memberNicknames.length > 50) {
      return response.badRequest({ message: 'A channel can have at most 50 invited members' })
    }

    const existingChannel = await Channel.query()
      .whereRaw('LOWER(name) = ?', [name.toLowerCase()])
      .first()

    if (existingChannel) {
      return response.conflict({ message: 'A channel with this name already exists' })
    }

    const members = memberNicknames.length
      ? await User.query().whereRaw(
          `LOWER(nickname) IN (${memberNicknames.map(() => '?').join(', ')})`,
          memberNicknames.map((nickname) => nickname.toLowerCase())
        )
      : []

    if (members.length !== memberNicknames.length) {
      return response.notFound({ message: 'One or more members were not found' })
    }

    const channel = await db.transaction(async (trx) => {
      const createdChannel = await Channel.create({ name, isPrivate }, { client: trx })

      await trx.table('channel_users').insert([
        { channel_id: createdChannel.id, user_id: me.id, is_admin: true },
        ...members.map((member) => ({
          channel_id: createdChannel.id,
          user_id: member.id,
          is_admin: false,
        })),
      ])

      return createdChannel
    })

    return {
      channel: {
        id: channel.id,
        name: channel.name,
        isPrivate: channel.isPrivate,
        unreadCount: 0,
        onlineCount: 1,
        new: false,
        usersList: [
          { id: me.id, name: me.nickname ?? me.email, isOnline: 1, admin: true },
          ...members.map((member) => ({
            id: member.id,
            name: member.nickname ?? member.email,
            isOnline: 0,
            admin: false,
          })),
        ],
      },
    }
  }
  async addChannelMember({auth, params, request, response}: HttpContext){
    const user = auth.use('api').getUserOrFail()
    const channelId = Number(params.id)
    const nickname = String(request.input('nickname', '')).trim().replace(/^@/, '')

    if (!Number.isInteger(channelId) || channelId <= 0){
      return response.badRequest({message: 'invalid channel id'})
    }

    if (!nickname) {
      return response.badRequest({message: 'no nickname, nickname is required'})
    }

    const channel = await Channel.find(channelId)
    if(!channel) return response.badRequest({message: 'no channel found'})

    const inviterMembership = await db.from('channel_users').where('channel_id', channelId).where('user_id', user.id).first()

    if (!inviterMembership) return response.forbidden({message: 'must be a channel member to invite another user'})
    if (channel.isPrivate && !inviterMembership.is_admin) return response.forbidden({message: 'only admins can invite another user'})

    const newUser = await User.query().whereRaw('LOWER(nickname) = ?', [nickname.toLowerCase()]).first()

    if (!newUser) return response.notFound({message: 'user not found'})

    const existingMembership = await db
      .from('channel_users')
      .where('channel_id', channelId)
      .where('user_id', newUser.id)
      .first()

    if (existingMembership) {
      return response.conflict({ message: 'User is already a channel member' })
    }

    await db.table('channel_users').insert({ channel_id: channelId, user_id: newUser.id, is_admin: false,})
    const systemMessage = await Message.create({
      channelId,
      chatType: false,
      content: `${newUser.nickname ?? newUser.email} was added to the channel ${channel.name}`,
      createdBy: user.id,
      isSystem: true,
    })

    return {
      member: {
        id: newUser.id,
        name: newUser.nickname ?? newUser.email,
        isOnline: 0,
        admin: false,
      },
      systemMessage: {
        id: systemMessage.id,
        content: systemMessage.content,
        createdAt: systemMessage.createdAt?.toISO(),
        mine: false,
        sender: 'ZCHAT SYSTEM',
        isSystem: true,
      }
    }
  }

  async revokeUser({ auth, response, params, request}: HttpContext){
    const user = auth.use('api').getUserOrFail()
    const channelId = Number(params.id)
    const nickname = String(request.input('nickname', '')).trim().replace(/^@/, '')

    if (!Number.isInteger(channelId) || channelId <= 0){
      return response.badRequest({message: 'invalid channel id'})
    }

    if (!nickname) {
      return response.badRequest({message: 'no nickname, nickname is required'})
    }

    const channel = await Channel.find(channelId)
    if(!channel) return response.badRequest({message: 'no channel found'})

    const isAdminInChannelCheck = await db
      .from('channel_users')
      .where('channel_id', channelId)
      .where('user_id', user.id)
      .first()

    if (!isAdminInChannelCheck?.is_admin) {
      return response.forbidden({ message: 'only channel admins can revoke members' })
    }

     const target = await User.query()
      .whereRaw('LOWER(nickname) = ?', [nickname.toLowerCase()])
      .first()

    if (!target) {
      return response.notFound({ message: 'user not found' })
    }
    if (target.id === user.id) {
      return response.badRequest({ message: 'use /cancel to delete/leave your own channel' })
    }

    const targetUser = await db.from('channel_users').where('channel_id', channelId).where('user_id', target.id).first()

    if (!targetUser) return response.notFound({message: 'user has not been found'})

    await db
      .from('channel_users')
      .where('channel_id', channelId)
      .where('user_id', target.id)
      .delete()

    const systemMessage = await db.transaction(async (trx) => {
      await trx
        .from('channel_users')
        .where('channel_id', channelId)
        .where('user_id', target.id)
        .delete()

      return Message.create(
        {
          channelId,
          chatType: false,
          content: `${target.nickname ?? target.email} was removed from the channel ${channel.name}`,
          createdBy: user.id,
          isSystem: true,
        },
        { client: trx },
      )
    })

    return {
      member: {
        id: target.id,
        name: target.nickname ?? target.email,
      },
      systemMessage: {
        id: systemMessage.id,
        content: systemMessage.content,
        createdAt: systemMessage.createdAt?.toISO(),
        mine: false,
        sender: 'ZCHAT SYSTEM',
        isSystem: true,
      },
  }
}

  async destroyChannel({ auth, response, params }: HttpContext){
    const user = auth.use('api').getUserOrFail()
    const channelId = Number(params.id)

    if (!Number.isInteger(channelId) || channelId <= 0) return response.badRequest({message: 'invalid channel id'})
    
    const channel = await Channel.find(channelId)
    if (!channel) return response.notFound({message: 'channel is not found'})

    const isInChat = await db.from('channel_users').where('channel_id', channelId).where('user_id', user.id).first()

    if(!isInChat || !isInChat.is_admin) {
      return response.forbidden({message: 'only admins can delete channel'})
    }

    await db.transaction(async (trx) => {
      await trx.from('messages').where('channel_id', channelId).where('chat_type', false).delete()
      await trx.from('channel_users').where('channel_id', channelId).delete()
      await trx.from('channels').where('id', channelId).delete()
    })

    return {message: 'channel closed/deleted successfully'}
  }

  async cancelSub ({auth, response, params}: HttpContext) {
    const user = auth.use('api').getUserOrFail()
    const channelId = Number(params.id)

    if (!Number.isInteger(channelId) || channelId <= 0) return response.badRequest({message: 'invalid channel id'})
    
    const channel = await Channel.find(channelId)
    if (!channel) return response.notFound({message: 'channel is not found'})

    const sub = await db.from('channel_users').where('user_id', user.id).where('channel_id', channelId).first()
    if(!sub) return response.forbidden({message: 'you are not a member'})

    if (sub.is_admin) {
      await db.transaction(async (trx) => {
        await trx
          .from('messages')
          .where('channel_id', channelId)
          .where('chat_type', false)
          .delete()

        await trx.from('channel_users').where('channel_id', channelId).delete()
        await trx.from('channels').where('id', channelId).delete()
      })

      return {message: 'channel deleted successfully'}
    }

    await db.from('channel_users').where('channel_id', channelId).where('user_id', user.id).delete()

    return {message: 'you left the channel'}
  }


}
