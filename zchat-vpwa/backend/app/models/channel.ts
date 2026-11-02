import { ChannelSchema } from "#database/schema";
import { hasMany } from "@adonisjs/lucid/orm";
import type { HasMany } from "@adonisjs/lucid/types/relations";
import Message from "#models/message";

export default class Channel extends ChannelSchema {
  @hasMany(() => Message, {
    foreignKey: "channelId",
  })
  declare messages: HasMany<typeof Message>;
}