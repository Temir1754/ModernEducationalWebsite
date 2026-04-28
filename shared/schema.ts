import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(), // UUIDs will be generated in app
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").default("user"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  role: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const events = sqliteTable("events", {
  id: text("id").primaryKey(),
  month: text("month").notNull(),
  title: text("title").notNull(),
  dateText: text("date_text").notNull(),
  description: text("description").notNull(),
  academicYear: text("academic_year").notNull().default("2025-2026"),
  mediaUrl: text("media_url"),
  mediaType: text("media_type"),
  createdAt: integer("created_at", { mode: 'timestamp' }).default(new Date()),
});

export const insertEventSchema = createInsertSchema(events).omit({
  id: true,
  createdAt: true,
}).extend({
  academicYear: z.string().optional(),
});

export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Event = typeof events.$inferSelect;

export const media = sqliteTable("media", {
  id: text("id").primaryKey(),
  type: text("type").notNull(),
  url: text("url").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  caption: text("caption"),
  eventId: text("event_id").references(() => events.id),
  section: text("section"),
  createdAt: integer("created_at", { mode: 'timestamp' }).default(new Date()),
});

export const insertMediaSchema = createInsertSchema(media).omit({
  id: true,
  createdAt: true,
});

export type InsertMedia = z.infer<typeof insertMediaSchema>;
export type Media = typeof media.$inferSelect;

export const documents = sqliteTable("documents", {
  id: text("id").primaryKey(),
  section: text("section").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  url: text("url").notNull(),
  scanUrl: text("scan_url"),
  color: text("color"),
  icon: text("icon"),
  academicYear: text("academic_year").default("2025-2026"),
  createdAt: integer("created_at", { mode: 'timestamp' }).default(new Date()),
});

export const insertDocumentSchema = createInsertSchema(documents).omit({
  id: true,
  createdAt: true,
}).extend({
  academicYear: z.string().optional(),
});

export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type Document = typeof documents.$inferSelect;

export const teachers = sqliteTable("teachers", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  position: text("position").notNull(),
  phone: text("phone"),
  email: text("email"),
  photoUrl: text("photo_url"),
  department: text("department"),
  createdAt: integer("created_at", { mode: 'timestamp' }).default(new Date()),
});

export const insertTeacherSchema = createInsertSchema(teachers).omit({
  id: true,
  createdAt: true,
});

export type InsertTeacher = z.infer<typeof insertTeacherSchema>;
export type Teacher = typeof teachers.$inferSelect;

export const news = sqliteTable("news", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  body: text("body").notNull(),
  coverUrl: text("cover_url"),
  dateText: text("date_text").notNull(),
  createdAt: integer("created_at", { mode: 'timestamp' }).default(new Date()),
});

export const insertNewsSchema = createInsertSchema(news).omit({
  id: true,
  createdAt: true,
});

export type InsertNews = z.infer<typeof insertNewsSchema>;
export type News = typeof news.$inferSelect;

export const siteContent = sqliteTable("site_content", {
  id: text("id").primaryKey(),
  key: text("key").notNull().unique(),
  lang: text("lang").notNull().default("kz"),
  value: text("value").notNull(),
  type: text("type").default("text"),
  createdAt: integer("created_at", { mode: 'timestamp' }).default(new Date()),
  updatedAt: integer("updated_at", { mode: 'timestamp' }).default(new Date()),
});

export const insertSiteContentSchema = createInsertSchema(siteContent).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertSiteContent = z.infer<typeof insertSiteContentSchema>;
export type SiteContent = typeof siteContent.$inferSelect;

export const sections = sqliteTable("sections", {
  id: text("id").primaryKey(),
  page: text("page").notNull(),
  slug: text("slug").notNull(),
  order: text("order").notNull(),
  isVisible: integer("is_visible", { mode: 'boolean' }).default(true),
  config: text("config"),
  createdAt: integer("created_at", { mode: 'timestamp' }).default(new Date()),
});

export const insertSectionSchema = createInsertSchema(sections).omit({
  id: true,
  createdAt: true,
});

export type InsertSection = z.infer<typeof insertSectionSchema>;
export type Section = typeof sections.$inferSelect;

export const documentFolders = sqliteTable("document_folders", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  parentId: text("parent_id"),
  isCategory: integer("is_category", { mode: 'boolean' }).default(false),
  order: text("order").default("0"),
  createdAt: integer("created_at", { mode: 'timestamp' }).default(new Date()),
});

export const insertDocumentFolderSchema = createInsertSchema(documentFolders).omit({
  id: true,
  createdAt: true,
});

export type InsertDocumentFolder = z.infer<typeof insertDocumentFolderSchema>;
export type DocumentFolder = typeof documentFolders.$inferSelect;

export const reviews = sqliteTable("reviews", {
  id: text("id").primaryKey(),
  authorName: text("author_name").notNull(),
  rating: integer("rating").notNull(),
  content: text("content").notNull(),
  source: text("source").notNull().default("site"), // site, 2gis, yandex
  isApproved: integer("is_approved", { mode: 'boolean' }).default(false),
  createdAt: integer("created_at", { mode: 'timestamp' }).default(new Date()),
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
}).extend({
  rating: z.number().min(1).max(5),
});

export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Review = typeof reviews.$inferSelect;

