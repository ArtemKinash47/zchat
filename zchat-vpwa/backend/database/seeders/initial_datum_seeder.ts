import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'
import Channel from '#models/channel'
import DirectChat from '#models/direct_chat'
import Message from '#models/message'

export default class extends BaseSeeder {
  async run() {
    const [admin, alex, den, leybron] = await User.updateOrCreateMany('email', [
      { email: 'admin@zchat.test', password: 'admin1234', firstName: 'Admin', lastName: 'User', nickname: 'admin' },
      { email: 'alex@zchat.test', password: 'password123', firstName: 'Alex', lastName: 'Morgan', nickname: 'alexmorgan' },
      { email: 'den@zchat.test', password: 'password123', firstName: 'Den', lastName: 'Verstappen', nickname: 'KuniLina' },
      { email: 'leybron@zchat.test', password: 'password123', firstName: 'Leybron', lastName: 'Jahames', nickname: 'LeybronJahames' },
    ])
    const design = await Channel.firstOrCreate({ name: 'Design Team' }, { isPrivate: true })
    await design.related('users').sync({
      [admin.id]: { is_admin: true },
      [alex.id]: { is_admin: false },
      [den.id]: { is_admin: false },
    })
    const infinity = await Channel.firstOrCreate({ name: 'Infinity Chat' }, { isPrivate: false })
    await infinity.related('users').sync({
      [admin.id]: { is_admin: true },
      [den.id]: { is_admin: false },
      [leybron.id]: { is_admin: false },
    })
    const pairs = [
      [admin, alex],
      [admin, den],
      [admin, leybron],
    ]
    for (const [a, b] of pairs) {
      const [u1, u2] = a.id < b.id ? [a, b] : [b, a]
      const chat = await DirectChat.firstOrCreate(
        { userId1: u1.id, userId2: u2.id },
        { new: true }
      )
      const count = await Message.query()
        .where('channelId', chat.id)
        .where('chatType', true)
        .count('* as total')
      if (Number(count[0].$extras.total) === 0) {
        await Message.createMany([
          { channelId: chat.id, chatType: true, content: 'Ahoj!', createdBy: a.id },
          { channelId: chat.id, chatType: true, content: 'Čau, ako sa máš?', createdBy: b.id },
        ])
      }
    }
    const chCount = await Message.query()
      .where('channelId', design.id)
      .where('chatType', false)
      .count('* as total')
    if (Number(chCount[0].$extras.total) === 0) {
      await Message.createMany([
        { channelId: design.id, chatType: false, content: 'Vitajte v Design Team!', createdBy: admin.id },
        { channelId: design.id, chatType: false, content: 'Super, díky.', createdBy: alex.id },
      ])
    }
    const token = await User.accessTokens.create(admin)
    console.log('\nTOKEN pre admin@zchat.test:\n' + token.value!.release() + '\n')
  }
}