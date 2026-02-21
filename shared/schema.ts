import { mysqlTable, serial, varchar, text, timestamp, boolean } from "drizzle-orm/mysql-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = mysqlTable("users", {
  id: varchar("id", { length: 36 }).primaryKey(), // UUIDs will be generated in app
  username: varchar("username", { length: 255 }).notNull().unique(),
  password: text("password").notNull(),
  role: varchar("role", { length: 50 }).default("user"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  role: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const events = mysqlTable("events", {
  id: varchar("id", { length: 36 }).primaryKey(),
  month: varchar("month", { length: 50 }).notNull(),
  title: text("title").notNull(),
  dateText: text("date_text").notNull(),
  description: text("description").notNull(),
  mediaUrl: text("media_url"),
  mediaType: varchar("media_type", { length: 20 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertEventSchema = createInsertSchema(events).omit({
  id: true,
  createdAt: true,
});

export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Event = typeof events.$inferSelect;

export const media = mysqlTable("media", {
  id: varchar("id", { length: 36 }).primaryKey(),
  type: varchar("type", { length: 20 }).notNull(),
  url: text("url").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  caption: text("caption"),
  eventId: varchar("event_id", { length: 36 }).references(() => events.id),
  section: varchar("section", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertMediaSchema = createInsertSchema(media).omit({
  id: true,
  createdAt: true,
});

export type InsertMedia = z.infer<typeof insertMediaSchema>;
export type Media = typeof media.$inferSelect;

export const documents = mysqlTable("documents", {
  id: varchar("id", { length: 36 }).primaryKey(),
  section: varchar("section", { length: 100 }).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  url: text("url").notNull(),
  scanUrl: text("scan_url"),
  color: varchar("color", { length: 50 }),
  icon: varchar("icon", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertDocumentSchema = createInsertSchema(documents).omit({
  id: true,
  createdAt: true,
});

export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type Document = typeof documents.$inferSelect;

export const teachers = mysqlTable("teachers", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  position: varchar("position", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  email: varchar("email", { length: 255 }),
  photoUrl: text("photo_url"),
  department: varchar("department", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertTeacherSchema = createInsertSchema(teachers).omit({
  id: true,
  createdAt: true,
});

export type InsertTeacher = z.infer<typeof insertTeacherSchema>;
export type Teacher = typeof teachers.$inferSelect;

export const news = mysqlTable("news", {
  id: varchar("id", { length: 36 }).primaryKey(),
  title: text("title").notNull(),
  body: text("body").notNull(),
  coverUrl: text("cover_url"),
  dateText: text("date_text").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertNewsSchema = createInsertSchema(news).omit({
  id: true,
  createdAt: true,
});

export type InsertNews = z.infer<typeof insertNewsSchema>;
export type News = typeof news.$inferSelect;

export const siteContent = mysqlTable("site_content", {
  id: varchar("id", { length: 36 }).primaryKey(),
  key: varchar("key", { length: 255 }).notNull().unique(),
  lang: varchar("lang", { length: 10 }).notNull().default("kz"),
  value: text("value").notNull(),
  type: varchar("type", { length: 50 }).default("text"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertSiteContentSchema = createInsertSchema(siteContent).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertSiteContent = z.infer<typeof insertSiteContentSchema>;
export type SiteContent = typeof siteContent.$inferSelect;

export const sections = mysqlTable("sections", {
  id: varchar("id", { length: 36 }).primaryKey(),
  page: varchar("page", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull(),
  order: varchar("order", { length: 10 }).notNull(),
  isVisible: boolean("is_visible").default(true),
  config: text("config"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertSectionSchema = createInsertSchema(sections).omit({
  id: true,
  createdAt: true,
});

export type InsertSection = z.infer<typeof insertSectionSchema>;
export type Section = typeof sections.$inferSelect;
