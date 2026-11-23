import socketManager, { debug } from './SocketManager'

const EVENTS = ['message:new', 'chats:changed']

class RealtimeService {
  channel = null
  activity = null
  handlers = new Map()

  on(event, fn) {
    if (!this.handlers.has(event)) this.handlers.set(event, new Set())
    this.handlers.get(event).add(fn)
    return () => this.handlers.get(event)?.delete(fn)
  }

  async join(userId, presence) {
    if (this.channel) return
    const socket = await socketManager.connect()

    const channel = socket.channel(`users/${userId}`)
    for (const event of EVENTS) {
      channel.listen(event, (data) => {
        debug('<-', event, data)
        this.handlers.get(event)?.forEach((fn) => fn(data))
      })
    }
    await channel.subscribe()
    this.channel = channel

    const activity = socket.channel('activity')
    activity
      .here((users) => presence.here(users.map((u) => Number(u.id))))
      .joining((u) => presence.joining(Number(u.id)))
      .leaving((u) => presence.leaving(Number(u.id)))
    await activity.subscribe()
    this.activity = activity
  }

  async sendMessage(type, chatId, content) {
    debug('->', 'sendMessage', { type, chatId, content })
    return this.channel.sendWithAck('sendMessage', { type, chatId, content })
  }

  async leave() {
    await this.channel?.unsubscribe()
    await this.activity?.unsubscribe()
    this.channel = this.activity = null
    socketManager.disconnect()
  }
}
export default new RealtimeService()