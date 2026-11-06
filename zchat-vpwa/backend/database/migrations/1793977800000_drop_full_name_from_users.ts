import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    await this.db.rawQuery(`
      UPDATE users
      SET first_name = COALESCE(
            first_name,
            TRIM(SUBSTR(full_name, 1, INSTR(full_name || ' ', ' ') - 1))
          ),
          last_name = COALESCE(
            last_name,
            NULLIF(TRIM(SUBSTR(full_name, INSTR(full_name || ' ', ' ') + 1)), '')
          )
      WHERE full_name IS NOT NULL
    `)

    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('full_name')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('full_name').nullable()
    })

    await this.db.rawQuery(`
      UPDATE users
      SET full_name = NULLIF(
        TRIM(COALESCE(first_name, '') || ' ' || COALESCE(last_name, '')),
        ''
      )
    `)
  }
}
