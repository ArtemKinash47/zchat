import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'channel_users'

  async up() {
    this.schema.alterTable('channel_users', (table) => {
    table.boolean('is_banned').notNullable().defaultTo(false)
    })
  }
  async down() {
    this.schema.alterTable('channel_users', (table) => {
      table.dropColumn('is_banned')
    })
  }
}