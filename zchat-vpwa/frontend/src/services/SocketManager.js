import { Socket } from '@rlanz/socket/client'

export const debug = (...a) => import.meta.env.DEV && console.info('[socket]', ...a)

class SocketManager {
  socket = null
  async connect() {
    if (!this.socket) {
      this.socket = new Socket({
        url: 'http://localhost:3333',
        onResubscribeError: ({ channel, error }) => console.error('[socket] resubscribe', channel, error),
      })
      this.socket.onStateChange((s) => debug(s))
    }
    await this.socket.connect()
    return this.socket
  }
  disconnect() {
    this.socket?.disconnect()
    this.socket = null
  }
}
export default new SocketManager()