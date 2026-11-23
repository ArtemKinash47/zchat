import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    this.schema.alterTable('channel_users', (table) => {
      table.boolean('is_new').notNullable().defaultTo(false)
    })

    this.schema.createTable('direct_chat_users', (table) => {
      table.increments('id')
      table
        .integer('direct_chat_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('direct_chats')
        .onDelete('CASCADE')
      table
        .integer('user_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
      table.boolean('is_new').notNullable().defaultTo(false)
      table.timestamp('created_at')
      table.timestamp('updated_at')
      table.unique(['direct_chat_id', 'user_id'])
    })
  }

  async down() {
    this.schema.dropTable('direct_chat_users')
    this.schema.alterTable('channel_users', (table) => {
      table.dropColumn('is_new')
    })
  }
}
