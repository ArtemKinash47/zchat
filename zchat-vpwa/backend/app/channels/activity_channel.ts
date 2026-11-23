import { BaseChannel } from '@rlanz/socket'
import type { AuthenticatedSocket, PresenceInfo } from '@rlanz/socket/types'
import type User from '#models/user'

export default class ActivityChannel extends BaseChannel<User> {
  static pattern = 'activity'
  static options = { presence: true }

  getPresenceInfo(socket: AuthenticatedSocket<User>): PresenceInfo {
    const user = socket.getUserOrFail()
    return { id: String(user.id), data: { nickname: user.nickname } }
  }
}