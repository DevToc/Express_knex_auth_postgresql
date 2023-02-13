/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
        .createTable('users', function(table) {
            table.increments('user_id').primary()
            table.string('email', 255)
            table.string('password', 255)
            table.string('first_name', 255)
            table.string('last_name',255)
            table.boolean('suspended')
            table.string('role',3)
            table.boolean('verified')
            table.timestamp('created_at').defaultTo(knex.fn.now())
            table.timestamp('updated_at').defaultTo(knex.fn.now())
        })
        .createTable('numbers', function(table) {
            table.increments('number_id').primary()
            table.string('number', 255)
            table.integer('user_id', 255)
              .references('user_id')
              .inTable('users')
            table.timestamp('created_at').defaultTo(knex.fn.now())
            table.timestamp('updated_at').defaultTo(knex.fn.now())
        })
        .createTable('messages', function(table) {
            table.increments('message_id').primary()
            table.string('message', 255)      
              table.timestamp('created_at').defaultTo(knex.fn.now())
            table.timestamp('updated_at').defaultTo(knex.fn.now())
            table
                .integer('number_id')
                .references('number_id')
                .inTable('numbers')
        })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('users').dropTable('numbers').dropTable('messages')
};
