var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import "dotenv/config";
import express3 from "express";
import path4 from "path";
import fs3 from "fs";
import compression from "compression";

// server/routes.ts
import { createServer } from "http";
import express from "express";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  documentFolders: () => documentFolders,
  documents: () => documents,
  events: () => events,
  insertDocumentFolderSchema: () => insertDocumentFolderSchema,
  insertDocumentSchema: () => insertDocumentSchema,
  insertEventSchema: () => insertEventSchema,
  insertMediaSchema: () => insertMediaSchema,
  insertNewsSchema: () => insertNewsSchema,
  insertReviewSchema: () => insertReviewSchema,
  insertSectionSchema: () => insertSectionSchema,
  insertSiteContentSchema: () => insertSiteContentSchema,
  insertTeacherSchema: () => insertTeacherSchema,
  insertUserSchema: () => insertUserSchema,
  media: () => media,
  news: () => news,
  reviews: () => reviews,
  sections: () => sections,
  siteContent: () => siteContent,
  teachers: () => teachers,
  users: () => users
});
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
var users = sqliteTable("users", {
  id: text("id").primaryKey(),
  // UUIDs will be generated in app
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").default("user")
});
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  role: true
});
var events = sqliteTable("events", {
  id: text("id").primaryKey(),
  month: text("month").notNull(),
  title: text("title").notNull(),
  dateText: text("date_text").notNull(),
  description: text("description").notNull(),
  academicYear: text("academic_year").notNull().default("2025-2026"),
  mediaUrl: text("media_url"),
  mediaType: text("media_type"),
  createdAt: integer("created_at", { mode: "timestamp" }).default(/* @__PURE__ */ new Date())
});
var insertEventSchema = createInsertSchema(events).omit({
  id: true,
  createdAt: true
}).extend({
  academicYear: z.string().optional()
});
var media = sqliteTable("media", {
  id: text("id").primaryKey(),
  type: text("type").notNull(),
  url: text("url").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  caption: text("caption"),
  eventId: text("event_id").references(() => events.id),
  section: text("section"),
  createdAt: integer("created_at", { mode: "timestamp" }).default(/* @__PURE__ */ new Date())
});
var insertMediaSchema = createInsertSchema(media).omit({
  id: true,
  createdAt: true
});
var documents = sqliteTable("documents", {
  id: text("id").primaryKey(),
  section: text("section").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  url: text("url").notNull(),
  scanUrl: text("scan_url"),
  color: text("color"),
  icon: text("icon"),
  academicYear: text("academic_year").default("2025-2026"),
  createdAt: integer("created_at", { mode: "timestamp" }).default(/* @__PURE__ */ new Date())
});
var insertDocumentSchema = createInsertSchema(documents).omit({
  id: true,
  createdAt: true
}).extend({
  academicYear: z.string().optional()
});
var teachers = sqliteTable("teachers", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  position: text("position").notNull(),
  phone: text("phone"),
  email: text("email"),
  photoUrl: text("photo_url"),
  department: text("department"),
  createdAt: integer("created_at", { mode: "timestamp" }).default(/* @__PURE__ */ new Date())
});
var insertTeacherSchema = createInsertSchema(teachers).omit({
  id: true,
  createdAt: true
});
var news = sqliteTable("news", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  body: text("body").notNull(),
  coverUrl: text("cover_url"),
  dateText: text("date_text").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).default(/* @__PURE__ */ new Date())
});
var insertNewsSchema = createInsertSchema(news).omit({
  id: true,
  createdAt: true
});
var siteContent = sqliteTable("site_content", {
  id: text("id").primaryKey(),
  key: text("key").notNull().unique(),
  lang: text("lang").notNull().default("kz"),
  value: text("value").notNull(),
  type: text("type").default("text"),
  createdAt: integer("created_at", { mode: "timestamp" }).default(/* @__PURE__ */ new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(/* @__PURE__ */ new Date())
});
var insertSiteContentSchema = createInsertSchema(siteContent).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var sections = sqliteTable("sections", {
  id: text("id").primaryKey(),
  page: text("page").notNull(),
  slug: text("slug").notNull(),
  order: text("order").notNull(),
  isVisible: integer("is_visible", { mode: "boolean" }).default(true),
  config: text("config"),
  createdAt: integer("created_at", { mode: "timestamp" }).default(/* @__PURE__ */ new Date())
});
var insertSectionSchema = createInsertSchema(sections).omit({
  id: true,
  createdAt: true
});
var documentFolders = sqliteTable("document_folders", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  parentId: text("parent_id"),
  isCategory: integer("is_category", { mode: "boolean" }).default(false),
  order: text("order").default("0"),
  createdAt: integer("created_at", { mode: "timestamp" }).default(/* @__PURE__ */ new Date())
});
var insertDocumentFolderSchema = createInsertSchema(documentFolders).omit({
  id: true,
  createdAt: true
});
var reviews = sqliteTable("reviews", {
  id: text("id").primaryKey(),
  authorName: text("author_name").notNull(),
  rating: integer("rating").notNull(),
  content: text("content").notNull(),
  source: text("source").notNull().default("site"),
  // site, 2gis, yandex
  isApproved: integer("is_approved", { mode: "boolean" }).default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).default(/* @__PURE__ */ new Date())
});
var insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true
}).extend({
  rating: z.number().min(1).max(5)
});

// server/db.ts
import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
var sqlite = new Database("sqlite.db");
var db = drizzle(sqlite, { schema: schema_exports });

// server/storage.ts
import { eq } from "drizzle-orm";
import session from "express-session";
import createMemoryStore from "memorystore";
import crypto from "crypto";
var MemoryStore = createMemoryStore(session);
var DatabaseStorage = class {
  sessionStore;
  constructor() {
    this.sessionStore = new MemoryStore({
      checkPeriod: 864e5
    });
  }
  async getUser(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }
  async getUserByUsername(username) {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }
  async createUser(insertUser) {
    const id = crypto.randomUUID();
    await db.insert(users).values({ ...insertUser, id });
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }
  async getEvents(month) {
    if (month) {
      return db.select().from(events).where(eq(events.month, month));
    }
    return db.select().from(events);
  }
  async getEvent(id) {
    const [event] = await db.select().from(events).where(eq(events.id, id));
    return event;
  }
  async createEvent(insertEvent) {
    const id = crypto.randomUUID();
    await db.insert(events).values({ ...insertEvent, id });
    const [event] = await db.select().from(events).where(eq(events.id, id));
    return event;
  }
  async updateEvent(id, event) {
    await db.update(events).set(event).where(eq(events.id, id));
    return this.getEvent(id);
  }
  async deleteEvent(id) {
    await db.delete(events).where(eq(events.id, id));
  }
  async getMedia(eventId, section) {
    if (eventId) {
      return db.select().from(media).where(eq(media.eventId, eventId));
    }
    if (section) {
      return db.select().from(media).where(eq(media.section, section));
    }
    return db.select().from(media);
  }
  async createMedia(insertMedia) {
    const id = crypto.randomUUID();
    await db.insert(media).values({ ...insertMedia, id });
    const [m] = await db.select().from(media).where(eq(media.id, id));
    return m;
  }
  async updateMedia(id, mediaData) {
    await db.update(media).set(mediaData).where(eq(media.id, id));
    const [m] = await db.select().from(media).where(eq(media.id, id));
    return m;
  }
  async deleteMedia(id) {
    await db.delete(media).where(eq(media.id, id));
  }
  async getDocuments(section) {
    if (section) {
      return db.select().from(documents).where(eq(documents.section, section));
    }
    return db.select().from(documents);
  }
  async getDocument(id) {
    const [doc] = await db.select().from(documents).where(eq(documents.id, id));
    return doc;
  }
  async createDocument(insertDoc) {
    const id = crypto.randomUUID();
    await db.insert(documents).values({ ...insertDoc, id });
    const [doc] = await db.select().from(documents).where(eq(documents.id, id));
    return doc;
  }
  async updateDocument(id, doc) {
    await db.update(documents).set(doc).where(eq(documents.id, id));
    return this.getDocument(id);
  }
  async deleteDocument(id) {
    await db.delete(documents).where(eq(documents.id, id));
  }
  async getTeachers() {
    return db.select().from(teachers);
  }
  async getTeacher(id) {
    const [teacher] = await db.select().from(teachers).where(eq(teachers.id, id));
    return teacher;
  }
  async createTeacher(insertTeacher) {
    const id = crypto.randomUUID();
    await db.insert(teachers).values({ ...insertTeacher, id });
    const [t] = await db.select().from(teachers).where(eq(teachers.id, id));
    return t;
  }
  async updateTeacher(id, teacher) {
    await db.update(teachers).set(teacher).where(eq(teachers.id, id));
    return this.getTeacher(id);
  }
  async deleteTeacher(id) {
    await db.delete(teachers).where(eq(teachers.id, id));
  }
  async getNews() {
    return db.select().from(news);
  }
  async getNewsItem(id) {
    const [n] = await db.select().from(news).where(eq(news.id, id));
    return n;
  }
  async createNews(insertNews) {
    const id = crypto.randomUUID();
    await db.insert(news).values({ ...insertNews, id });
    const [n] = await db.select().from(news).where(eq(news.id, id));
    return n;
  }
  async updateNews(id, newsItem) {
    await db.update(news).set(newsItem).where(eq(news.id, id));
    return this.getNewsItem(id);
  }
  async deleteNews(id) {
    await db.delete(news).where(eq(news.id, id));
  }
  async getSiteContent(key, lang) {
    if (key && lang) {
      return db.select().from(siteContent).where(eq(siteContent.key, key));
    }
    if (key) {
      return db.select().from(siteContent).where(eq(siteContent.key, key));
    }
    if (lang) {
      return db.select().from(siteContent).where(eq(siteContent.lang, lang));
    }
    return db.select().from(siteContent);
  }
  async getSiteContentItem(id) {
    const [content] = await db.select().from(siteContent).where(eq(siteContent.id, id));
    return content;
  }
  async createSiteContent(insertContent) {
    const id = crypto.randomUUID();
    await db.insert(siteContent).values({ ...insertContent, id });
    const [content] = await db.select().from(siteContent).where(eq(siteContent.id, id));
    return content;
  }
  async updateSiteContent(id, content) {
    await db.update(siteContent).set(content).where(eq(siteContent.id, id));
    return this.getSiteContentItem(id);
  }
  async deleteSiteContent(id) {
    await db.delete(siteContent).where(eq(siteContent.id, id));
  }
  async getSections(page) {
    if (page) {
      return db.select().from(sections).where(eq(sections.page, page));
    }
    return db.select().from(sections);
  }
  async getSection(id) {
    const [section] = await db.select().from(sections).where(eq(sections.id, id));
    return section;
  }
  async createSection(insertSection) {
    const id = crypto.randomUUID();
    await db.insert(sections).values({ ...insertSection, id });
    const [section] = await db.select().from(sections).where(eq(sections.id, id));
    return section;
  }
  async updateSection(id, section) {
    await db.update(sections).set(section).where(eq(sections.id, id));
    return this.getSection(id);
  }
  async deleteSection(id) {
    await db.delete(sections).where(eq(sections.id, id));
  }
  async getFolders() {
    return db.select().from(documentFolders);
  }
  async getFolder(id) {
    const [folder] = await db.select().from(documentFolders).where(eq(documentFolders.id, id));
    return folder;
  }
  async createFolder(insertFolder) {
    const id = crypto.randomUUID();
    await db.insert(documentFolders).values({ ...insertFolder, id });
    const [folder] = await db.select().from(documentFolders).where(eq(documentFolders.id, id));
    return folder;
  }
  async updateFolder(id, folderData) {
    await db.update(documentFolders).set(folderData).where(eq(documentFolders.id, id));
    return this.getFolder(id);
  }
  async deleteFolder(id) {
    await db.delete(documentFolders).where(eq(documentFolders.id, id));
  }
  async getReviews(onlyApproved = true) {
    if (onlyApproved) {
      return db.select().from(reviews).where(eq(reviews.isApproved, true));
    }
    return db.select().from(reviews);
  }
  async createReview(insertReview) {
    const id = crypto.randomUUID();
    await db.insert(reviews).values({ ...insertReview, id });
    const [review] = await db.select().from(reviews).where(eq(reviews.id, id));
    return review;
  }
  async updateReview(id, reviewData) {
    await db.update(reviews).set(reviewData).where(eq(reviews.id, id));
    const [review] = await db.select().from(reviews).where(eq(reviews.id, id));
    return review;
  }
  async deleteReview(id) {
    await db.delete(reviews).where(eq(reviews.id, id));
  }
};
var storage = new DatabaseStorage();

// server/routes.ts
import session2 from "express-session";
import bcrypt from "bcrypt";
import multer from "multer";
import path from "path";
import fs from "fs";
var uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
var storage_multer = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  }
});
var upload = multer({
  storage: storage_multer,
  limits: { fileSize: 1024 * 1024 * 1024 },
  // 1 GB
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "video/mp4",
      "video/webm",
      "application/msword",
      // .doc
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      // .docx
      "application/vnd.ms-excel",
      // .xls
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      // .xlsx
      "application/vnd.ms-powerpoint",
      // .ppt
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      // .pptx
      "application/zip",
      // .zip
      "application/x-rar-compressed"
      // .rar
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("\u0420\u04B1\u049B\u0441\u0430\u0442 \u0435\u0442\u0456\u043B\u043C\u0435\u0433\u0435\u043D \u0444\u0430\u0439\u043B \u0444\u043E\u0440\u043C\u0430\u0442\u044B (File type not allowed)"));
    }
  }
});
var requireAdmin = (req, res, next) => {
  if (!req.session.userId || !req.session.isAdmin) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};
async function registerRoutes(app2) {
  app2.set("trust proxy", 1);
  app2.use(
    session2({
      store: storage.sessionStore,
      secret: process.env.SESSION_SECRET || "fgs-dev-secret-key-2024",
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === "production" ? "auto" : false,
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1e3,
        sameSite: "lax"
      }
    })
  );
  app2.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
      }
      console.log("Login attempt:", username);
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
      }
      console.log("Fetching user...");
      const user = await storage.getUserByUsername(username);
      if (!user) {
        console.log("User not found via storage");
        return res.status(401).json({ message: "Invalid credentials" });
      }
      console.log("Comparing password...");
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        console.log("Password invalid");
        return res.status(401).json({ message: "Invalid credentials" });
      }
      console.log("Setting session...", !!req.session);
      req.session.userId = user.id;
      req.session.isAdmin = user.role === "admin";
      console.log("Session set (isAdmin:", req.session.isAdmin, ")");
      res.json({
        message: "Login successful",
        user: {
          id: user.id,
          username: user.username,
          role: user.role
        }
      });
    } catch (error) {
      console.error("Login error details:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });
  app2.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.json({ message: "Logout successful" });
    });
  });
  app2.get("/api/auth/me", async (req, res) => {
    if (!req.session.userId) {
      return res.json({ user: null });
    }
    const user = await storage.getUser(req.session.userId);
    if (!user) {
      return res.json({ user: null });
    }
    res.json({ user: { id: user.id, username: user.username, role: user.role } });
  });
  app2.post("/api/auth/setup", async (req, res) => {
    try {
      const existingAdmin = await storage.getUserByUsername("admin");
      if (existingAdmin) {
        return res.status(400).json({ message: "Admin already exists" });
      }
      const { password } = req.body;
      if (!password || password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters" });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await storage.createUser({
        username: "admin",
        password: hashedPassword,
        role: "admin"
      });
      res.json({ message: "Admin created successfully", username: user.username });
    } catch (error) {
      console.error("Setup error:", error);
      res.status(500).json({ message: "Setup failed", error: String(error) });
    }
  });
  app2.use("/uploads", (req, res, next) => {
    res.setHeader("Cache-Control", "public, max-age=31536000");
    next();
  }, express.static(uploadDir));
  const attachedAssetsDir = path.join(process.cwd(), "client", "public", "attached_assets");
  const galleryDir = path.join(process.cwd(), "client", "public", "gallery");
  if (fs.existsSync(attachedAssetsDir)) {
    app2.use("/attached_assets", express.static(attachedAssetsDir));
  }
  if (fs.existsSync(galleryDir)) {
    app2.use("/gallery", express.static(galleryDir));
  }
  app2.post("/api/upload", requireAdmin, (req, res) => {
    console.log("[Upload API] Initiating upload...");
    upload.single("file")(req, res, (err) => {
      if (err) {
        console.error("[Upload API] Multer error:", err);
        return res.status(400).json({ message: err.message || "File upload error" });
      }
      try {
        if (!req.file) {
          console.error("[Upload API] No file in request");
          return res.status(400).json({ message: "No file uploaded" });
        }
        console.log(`[Upload API] File uploaded successfully: ${req.file.originalname} (${req.file.size} bytes)`);
        const url = `/uploads/${req.file.filename}`;
        res.json({ url, filename: req.file.filename, originalName: req.file.originalname });
      } catch (error) {
        console.error("[Upload API] Processing error:", error);
        res.status(500).json({ message: "Upload failed" });
      }
    });
  });
  app2.get("/api/events", async (req, res) => {
    try {
      const events2 = await storage.getEvents();
      res.json(events2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch events" });
    }
  });
  app2.get("/api/events/:id", async (req, res) => {
    try {
      const event = await storage.getEvent(req.params.id);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      res.json(event);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch event" });
    }
  });
  app2.post("/api/events", requireAdmin, async (req, res) => {
    try {
      const data = insertEventSchema.parse(req.body);
      const event = await storage.createEvent(data);
      res.json(event);
    } catch (error) {
      res.status(400).json({ message: "Invalid event data" });
    }
  });
  app2.patch("/api/events/:id", requireAdmin, async (req, res) => {
    try {
      const event = await storage.updateEvent(req.params.id, req.body);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      res.json(event);
    } catch (error) {
      res.status(400).json({ message: "Failed to update event" });
    }
  });
  app2.delete("/api/events/:id", requireAdmin, async (req, res) => {
    try {
      await storage.deleteEvent(req.params.id);
      res.json({ message: "Event deleted" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete event" });
    }
  });
  app2.get("/api/media", async (req, res) => {
    try {
      const { eventId, section } = req.query;
      const mediaItems = await storage.getMedia(
        eventId,
        section
      );
      res.json(mediaItems);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch media" });
    }
  });
  app2.post("/api/media", requireAdmin, async (req, res) => {
    try {
      const data = insertMediaSchema.parse(req.body);
      const mediaItem = await storage.createMedia(data);
      res.json(mediaItem);
    } catch (error) {
      res.status(400).json({ message: "Invalid media data" });
    }
  });
  app2.patch("/api/media/:id", requireAdmin, async (req, res) => {
    try {
      const mediaItem = await storage.updateMedia(req.params.id, req.body);
      if (!mediaItem) {
        return res.status(404).json({ message: "Media not found" });
      }
      res.json(mediaItem);
    } catch (error) {
      res.status(400).json({ message: "Failed to update media" });
    }
  });
  app2.delete("/api/media/:id", requireAdmin, async (req, res) => {
    try {
      await storage.deleteMedia(req.params.id);
      res.json({ message: "Media deleted" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete media" });
    }
  });
  app2.get("/api/documents", async (req, res) => {
    try {
      const { section } = req.query;
      const docs = await storage.getDocuments(section);
      res.json(docs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch documents" });
    }
  });
  app2.get("/api/documents/:id", async (req, res) => {
    try {
      const doc = await storage.getDocument(req.params.id);
      if (!doc) {
        return res.status(404).json({ message: "Document not found" });
      }
      res.json(doc);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch document" });
    }
  });
  app2.post("/api/documents", requireAdmin, async (req, res) => {
    try {
      const data = insertDocumentSchema.parse(req.body);
      const doc = await storage.createDocument(data);
      res.json(doc);
    } catch (error) {
      console.error("[Documents API Error]", error);
      res.status(400).json({ message: "Invalid document data", error: String(error) });
    }
  });
  app2.patch("/api/documents/:id", requireAdmin, async (req, res) => {
    try {
      const doc = await storage.updateDocument(req.params.id, req.body);
      if (!doc) {
        return res.status(404).json({ message: "Document not found" });
      }
      res.json(doc);
    } catch (error) {
      res.status(400).json({ message: "Failed to update document" });
    }
  });
  app2.delete("/api/documents/:id", requireAdmin, async (req, res) => {
    try {
      await storage.deleteDocument(req.params.id);
      res.json({ message: "Document deleted" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete document" });
    }
  });
  app2.get("/api/teachers", async (req, res) => {
    try {
      const teachers2 = await storage.getTeachers();
      res.json(teachers2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch teachers" });
    }
  });
  app2.get("/api/teachers/:id", async (req, res) => {
    try {
      const teacher = await storage.getTeacher(req.params.id);
      if (!teacher) {
        return res.status(404).json({ message: "Teacher not found" });
      }
      res.json(teacher);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch teacher" });
    }
  });
  app2.post("/api/teachers", requireAdmin, async (req, res) => {
    try {
      const data = insertTeacherSchema.parse(req.body);
      const teacher = await storage.createTeacher(data);
      res.json(teacher);
    } catch (error) {
      res.status(400).json({ message: "Invalid teacher data" });
    }
  });
  app2.patch("/api/teachers/:id", requireAdmin, async (req, res) => {
    try {
      const teacher = await storage.updateTeacher(req.params.id, req.body);
      if (!teacher) {
        return res.status(404).json({ message: "Teacher not found" });
      }
      res.json(teacher);
    } catch (error) {
      res.status(400).json({ message: "Failed to update teacher" });
    }
  });
  app2.delete("/api/teachers/:id", requireAdmin, async (req, res) => {
    try {
      await storage.deleteTeacher(req.params.id);
      res.json({ message: "Teacher deleted" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete teacher" });
    }
  });
  app2.get("/api/news", async (req, res) => {
    try {
      const newsItems = await storage.getNews();
      res.json(newsItems);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch news" });
    }
  });
  app2.get("/api/news/:id", async (req, res) => {
    try {
      const newsItem = await storage.getNewsItem(req.params.id);
      if (!newsItem) {
        return res.status(404).json({ message: "News item not found" });
      }
      res.json(newsItem);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch news item" });
    }
  });
  app2.post("/api/news", requireAdmin, async (req, res) => {
    try {
      const data = insertNewsSchema.parse(req.body);
      const newsItem = await storage.createNews(data);
      res.json(newsItem);
    } catch (error) {
      res.status(400).json({ message: "Invalid news data" });
    }
  });
  app2.patch("/api/news/:id", requireAdmin, async (req, res) => {
    try {
      const newsItem = await storage.updateNews(req.params.id, req.body);
      if (!newsItem) {
        return res.status(404).json({ message: "News item not found" });
      }
      res.json(newsItem);
    } catch (error) {
      res.status(400).json({ message: "Failed to update news item" });
    }
  });
  app2.delete("/api/news/:id", requireAdmin, async (req, res) => {
    try {
      await storage.deleteNews(req.params.id);
      res.json({ message: "News item deleted" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete news item" });
    }
  });
  app2.get("/api/content", async (req, res) => {
    try {
      const { key, lang } = req.query;
      const content = await storage.getSiteContent(
        key,
        lang
      );
      res.json(content);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch content" });
    }
  });
  app2.get("/api/content/:id", async (req, res) => {
    try {
      const content = await storage.getSiteContentItem(req.params.id);
      if (!content) {
        return res.status(404).json({ message: "Content not found" });
      }
      res.json(content);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch content" });
    }
  });
  app2.post("/api/content", requireAdmin, async (req, res) => {
    try {
      const data = insertSiteContentSchema.parse(req.body);
      const content = await storage.createSiteContent(data);
      res.json(content);
    } catch (error) {
      res.status(400).json({ message: "Invalid content data" });
    }
  });
  app2.patch("/api/content/:id", requireAdmin, async (req, res) => {
    try {
      const content = await storage.updateSiteContent(req.params.id, req.body);
      if (!content) {
        return res.status(404).json({ message: "Content not found" });
      }
      res.json(content);
    } catch (error) {
      res.status(400).json({ message: "Failed to update content" });
    }
  });
  app2.delete("/api/content/:id", requireAdmin, async (req, res) => {
    try {
      await storage.deleteSiteContent(req.params.id);
      res.json({ message: "Content deleted" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete content" });
    }
  });
  app2.get("/api/sections", async (req, res) => {
    try {
      const { page } = req.query;
      const sectionsList = await storage.getSections(page);
      res.json(sectionsList);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch sections" });
    }
  });
  app2.get("/api/sections/:id", async (req, res) => {
    try {
      const section = await storage.getSection(req.params.id);
      if (!section) {
        return res.status(404).json({ message: "Section not found" });
      }
      res.json(section);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch section" });
    }
  });
  app2.post("/api/sections", requireAdmin, async (req, res) => {
    try {
      const data = insertSectionSchema.parse(req.body);
      const section = await storage.createSection(data);
      res.json(section);
    } catch (error) {
      res.status(400).json({ message: "Invalid section data" });
    }
  });
  app2.patch("/api/sections/:id", requireAdmin, async (req, res) => {
    try {
      const section = await storage.updateSection(req.params.id, req.body);
      if (!section) {
        return res.status(404).json({ message: "Section not found" });
      }
      res.json(section);
    } catch (error) {
      res.status(400).json({ message: "Failed to update section" });
    }
  });
  app2.delete("/api/sections/:id", requireAdmin, async (req, res) => {
    try {
      await storage.deleteSection(req.params.id);
      res.json({ message: "Section deleted" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete section" });
    }
  });
  app2.get("/api/folders", async (req, res) => {
    try {
      const folders = await storage.getFolders();
      res.json(folders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch folders" });
    }
  });
  app2.get("/api/folders/:id", async (req, res) => {
    try {
      const folder = await storage.getFolder(req.params.id);
      if (!folder) {
        return res.status(404).json({ message: "Folder not found" });
      }
      res.json(folder);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch folder" });
    }
  });
  app2.post("/api/folders", requireAdmin, async (req, res) => {
    try {
      console.log("POST /api/folders payload:", req.body);
      const data = insertDocumentFolderSchema.parse(req.body);
      const folder = await storage.createFolder(data);
      res.json(folder);
    } catch (error) {
      console.error("Zod Validation Error on folders:", error.issues || error.message || error);
      res.status(400).json({ message: "Invalid folder data", details: error.issues || error.message });
    }
  });
  app2.patch("/api/folders/:id", requireAdmin, async (req, res) => {
    try {
      const folder = await storage.updateFolder(req.params.id, req.body);
      if (!folder) {
        return res.status(404).json({ message: "Folder not found" });
      }
      res.json(folder);
    } catch (error) {
      res.status(400).json({ message: "Failed to update folder" });
    }
  });
  app2.delete("/api/folders/:id", requireAdmin, async (req, res) => {
    try {
      await storage.deleteFolder(req.params.id);
      res.json({ message: "Folder deleted" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete folder" });
    }
  });
  app2.get("/api/reviews", async (req, res) => {
    try {
      const onlyApproved = req.query.all !== "true";
      const reviews2 = await storage.getReviews(onlyApproved);
      res.json(reviews2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });
  app2.post("/api/reviews", async (req, res) => {
    try {
      const data = insertReviewSchema.parse(req.body);
      const review = await storage.createReview({ ...data, isApproved: false });
      res.json(review);
    } catch (error) {
      res.status(400).json({ message: "Invalid review data" });
    }
  });
  app2.patch("/api/reviews/:id", requireAdmin, async (req, res) => {
    try {
      const review = await storage.updateReview(req.params.id, req.body);
      if (!review) {
        return res.status(404).json({ message: "Review not found" });
      }
      res.json(review);
    } catch (error) {
      res.status(400).json({ message: "Failed to update review" });
    }
  });
  app2.delete("/api/reviews/:id", requireAdmin, async (req, res) => {
    try {
      await storage.deleteReview(req.params.id);
      res.json({ message: "Review deleted" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete review" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express2 from "express";
import fs2 from "fs";
import path3 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path2 from "path";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path2.resolve(import.meta.dirname, "client", "src"),
      "@shared": path2.resolve(import.meta.dirname, "shared"),
      "@assets": path2.resolve(import.meta.dirname, "client", "src", "assets")
    }
  },
  root: path2.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path2.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path3.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs2.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path3.resolve(import.meta.dirname, "public");
  if (!fs2.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express2.static(distPath));
  app2.use("*", (req, res) => {
    if (req.path.startsWith("/api")) {
      return res.status(404).json({ message: "Not found" });
    }
    res.sendFile(path3.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express3();
app.use(compression());
app.use(express3.json({ limit: "1024mb" }));
app.use(express3.urlencoded({ limit: "1024mb", extended: false }));
app.use((req, res, next) => {
  if (req.header("Accept")?.includes("image/webp") && /\.(jpg|jpeg|png)$/i.test(req.path)) {
    const webpPath = req.path.replace(/\.(jpg|jpeg|png)$/i, ".webp");
    const fullPath = path4.join(process.cwd(), webpPath);
    if (fs3.existsSync(fullPath)) {
      req.url = webpPath;
    }
  }
  next();
});
app.use((req, res, next) => {
  if (req.path.includes(".env") || req.path.includes(".git")) {
    return res.status(403).json({ message: "Access forbidden" });
  }
  next();
});
app.use((req, res, next) => {
  const start = Date.now();
  const requestPath = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson) {
    capturedJsonResponse = bodyJson;
    return originalResJson.call(res, bodyJson);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (requestPath.startsWith("/api")) {
      let logLine = `${req.method} ${requestPath} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
app.use("/attached_assets", express3.static(path4.resolve(import.meta.dirname, "..", "attached_assets")));
app.use("/uploads", express3.static(path4.resolve(import.meta.dirname, "..", "uploads")));
app.use(express3.static(path4.resolve(import.meta.dirname, "..", "client", "public")));
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
