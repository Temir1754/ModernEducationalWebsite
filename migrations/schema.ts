import { mysqlTable, mysqlSchema, AnyMySqlColumn, varchar, text, timestamp, int, foreignKey, unique } from "drizzle-orm/mysql-core"
import { sql } from "drizzle-orm"

export const documents = mysqlTable("documents", {
	id: varchar({ length: 36 }).notNull(),
	section: varchar({ length: 100 }).notNull(),
	title: text().notNull(),
	description: text().default('NULL'),
	url: text().notNull(),
	color: varchar({ length: 50 }).default('NULL'),
	icon: varchar({ length: 50 }).default('NULL'),
	createdAt: timestamp("created_at", { mode: 'string' }).default('current_timestamp()').notNull(),
	scanUrl: text("scan_url").default('NULL'),
});

export const documentFolders = mysqlTable("document_folders", {
	id: varchar({ length: 36 }).notNull(),
	parentId: varchar("parent_id", { length: 36 }).default('NULL'),
	name: text().notNull(),
	order: int().default(0),
	createdAt: timestamp("created_at", { mode: 'string' }).default('current_timestamp()').notNull(),
});

export const events = mysqlTable("events", {
	id: varchar({ length: 36 }).notNull(),
	month: varchar({ length: 50 }).notNull(),
	title: text().notNull(),
	dateText: text("date_text").notNull(),
	description: text().notNull(),
	mediaUrl: text("media_url").default('NULL'),
	mediaType: varchar("media_type", { length: 20 }).default('NULL'),
	createdAt: timestamp("created_at", { mode: 'string' }).default('current_timestamp()').notNull(),
});

export const media = mysqlTable("media", {
	id: varchar({ length: 36 }).notNull(),
	type: varchar({ length: 20 }).notNull(),
	url: text().notNull(),
	thumbnailUrl: text("thumbnail_url").default('NULL'),
	caption: text().default('NULL'),
	eventId: varchar("event_id", { length: 36 }).default('NULL').references(() => events.id),
	section: varchar({ length: 100 }).default('NULL'),
	createdAt: timestamp("created_at", { mode: 'string' }).default('current_timestamp()').notNull(),
});

export const news = mysqlTable("news", {
	id: varchar({ length: 36 }).notNull(),
	title: text().notNull(),
	body: text().notNull(),
	coverUrl: text("cover_url").default('NULL'),
	dateText: text("date_text").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default('current_timestamp()').notNull(),
});

export const sections = mysqlTable("sections", {
	id: varchar({ length: 36 }).notNull(),
	page: varchar({ length: 100 }).notNull(),
	slug: varchar({ length: 100 }).notNull(),
	order: varchar({ length: 10 }).notNull(),
	isVisible: tinyint("is_visible").default(1),
	config: text().default('NULL'),
	createdAt: timestamp("created_at", { mode: 'string' }).default('current_timestamp()').notNull(),
});

export const siteContent = mysqlTable("site_content", {
	id: varchar({ length: 36 }).notNull(),
	key: varchar({ length: 255 }).notNull(),
	lang: varchar({ length: 10 }).default('\'kz\'').notNull(),
	value: text().notNull(),
	type: varchar({ length: 50 }).default('\'text\''),
	createdAt: timestamp("created_at", { mode: 'string' }).default('current_timestamp()').notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default('current_timestamp()').notNull(),
},
(table) => [
	unique("site_content_key_unique").on(table.key),
]);

export const teachers = mysqlTable("teachers", {
	id: varchar({ length: 36 }).notNull(),
	name: varchar({ length: 255 }).notNull(),
	position: varchar({ length: 255 }).notNull(),
	phone: varchar({ length: 50 }).default('NULL'),
	email: varchar({ length: 255 }).default('NULL'),
	photoUrl: text("photo_url").default('NULL'),
	department: varchar({ length: 100 }).default('NULL'),
	createdAt: timestamp("created_at", { mode: 'string' }).default('current_timestamp()').notNull(),
});

export const users = mysqlTable("users", {
	id: varchar({ length: 36 }).notNull(),
	username: varchar({ length: 255 }).notNull(),
	password: text().notNull(),
	role: varchar({ length: 50 }).default('\'user\''),
},
(table) => [
	unique("users_username_unique").on(table.username),
]);
