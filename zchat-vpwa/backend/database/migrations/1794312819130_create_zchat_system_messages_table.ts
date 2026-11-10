import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'zchat_system_messages'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.boolean('is_system').notNullable().defaultTo(false)
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('is_system')
    })
  }
}