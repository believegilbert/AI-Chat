import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core"

export const chats = pgTable('chats', {
id: serial('id').primaryKey(),
userId: text('user_id').notNull(),
message: text('message').notNull(),
reply: text('reply').notNull(),
createdAt:timestamp('createdAt').defaultNow().notNull()
});

export const users = pgTable('users', {
    userId: text('user_id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull()
});

//type inference for drizzle query
export type ChatInsert = typeof chats.$inferInsert;
export type ChatSelect = typeof chats.$inferSelect;
export type UserInsert = typeof chats.$inferInsert;
export type UserSelect = typeof chats.$inferSelect;