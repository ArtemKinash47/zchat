import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    this.schema.alterTable('messages', (table) => {
      table.boolean('is_system').notNullable().defaultTo(false)
    })

    this.schema.dropTable('zchat_system_messages')
  }

  async down() {
    this.schema.createTable('zchat_system_messages', (table) => {
      table.boolean('is_system').notNullable().defaultTo(false)
    })

    this.schema.alterTable('messages', (table) => {
      table.dropColumn('is_system')
    })
  }
}