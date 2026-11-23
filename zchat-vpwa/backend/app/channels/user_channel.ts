import { BaseChannel } from '@rlanz/socket'
import { onMessage } from '@rlanz/socket/decorators'
import type { AuthenticatedSocket } from '@rlanz/socket/types'
import type User from '#models/user'
import { sendMessage, type ChatType } from '#services/realtime'

export default class UserChannel extends BaseChannel<User> {
  static pattern = 'users/:id'

  @onMessage('sendMessage')
  async send(
    socket: AuthenticatedSocket<User>,
    data: { type: ChatType; chatId: number; content: string }
  ) {
    const me = socket.getUserOrFail()
    if (String(me.id) !== this.params.id) throw new Error('Forbidden')
    return sendMessage(me, data.type, Number(data.chatId), data.content)
  }
}