import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'directed_tos'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
     table
        .integer("m_id")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("messages")
        .onDelete("CASCADE");
      table
        .integer("u_id")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("users")
        .onDelete("CASCADE");
      table.primary(['m_id', 'u_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}