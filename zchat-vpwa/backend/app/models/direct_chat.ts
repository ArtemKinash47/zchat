import { DirectChatSchema } from '#database/schema'
import { belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Message from '#models/message'
import User from '#models/user'

export default class DirectChat extends DirectChatSchema {
  @hasMany(() => Message, { foreignKey: 'channelId' })
  declare messages: HasMany<typeof Message>

  @belongsTo(() => User, { foreignKey: 'userId1' })
  declare chatter1: BelongsTo<typeof User>

  @belongsTo(() => User, { foreignKey: 'userId2' })
  declare chatter2: BelongsTo<typeof User>
}