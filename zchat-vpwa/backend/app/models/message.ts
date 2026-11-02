import { MessageSchema } from "#database/schema";
import { belongsTo } from "@adonisjs/lucid/orm";
import type { BelongsTo } from "@adonisjs/lucid/types/relations";
import Channel from "#models/channel";
import User from "#models/user";

export default class Message extends MessageSchema {
  @belongsTo(() => User, {
    foreignKey: "createdBy",
  })
  declare author: BelongsTo<typeof User>;

  @belongsTo(() => Channel, {
    foreignKey: "channelId",
  })
  declare channel: BelongsTo<typeof Channel>;
}