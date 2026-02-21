import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import express from "express";
import { storage } from "./storage";
import session from "express-session";
import bcrypt from "bcrypt";
import multer from "multer";
import path from "path";
import fs from "fs";
import {
  insertEventSchema,
  insertMediaSchema,
  insertDocumentSchema,
  insertTeacherSchema,
  insertNewsSchema,
  insertSiteContentSchema,
  insertSectionSchema
} from "@shared/schema";
// import connectPgSimple from "connect-pg-simple";
import { Pool } from "@neondatabase/serverless";

const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage_multer = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage: storage_multer,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'video/mp4',
      'video/webm'
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('File type not allowed'));
    }
  }
});

// const PgSession = connectPgSimple(session);

declare module "express-session" {
  interface SessionData {
    userId: string;
    isAdmin: boolean;
  }
}

const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.userId || !req.session.isAdmin) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};

export async function registerRoutes(app: Express): Promise<Server> {
  // const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  app.use(
    session({
      store: storage.sessionStore,
      secret: process.env.SESSION_SECRET || "fgs-dev-secret-key-2024",
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: "lax",
      },
    })
  );

  app.post("/api/auth/login", async (req, res) => {
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

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.json({ message: "Logout successful" });
    });
  });

  app.get("/api/auth/me", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const user = await storage.getUser(req.session.userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    res.json({ user: { id: user.id, username: user.username, role: user.role } });
  });

  app.post("/api/auth/setup", async (req, res) => {
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
        role: "admin",
      });

      res.json({ message: "Admin created successfully", username: user.username });
    } catch (error) {
      console.error("Setup error:", error);
      res.status(500).json({ message: "Setup failed", error: String(error) });
    }
  });

  app.use("/uploads", (req, res, next) => {
    res.setHeader("Cache-Control", "public, max-age=31536000");
    next();
  }, express.static(uploadDir));

  app.post("/api/upload", requireAdmin, upload.single("file"), (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      const url = `/uploads/${req.file.filename}`;
      res.json({ url, filename: req.file.filename, originalName: req.file.originalname });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ message: "Upload failed" });
    }
  });

  app.get("/api/events", async (req, res) => {
    try {
      const events = await storage.getEvents();
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch events" });
    }
  });

  app.get("/api/events/:id", async (req, res) => {
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

  app.post("/api/events", requireAdmin, async (req, res) => {
    try {
      const data = insertEventSchema.parse(req.body);
      const event = await storage.createEvent(data);
      res.json(event);
    } catch (error) {
      res.status(400).json({ message: "Invalid event data" });
    }
  });

  app.patch("/api/events/:id", requireAdmin, async (req, res) => {
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

  app.delete("/api/events/:id", requireAdmin, async (req, res) => {
    try {
      await storage.deleteEvent(req.params.id);
      res.json({ message: "Event deleted" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete event" });
    }
  });

  app.get("/api/media", async (req, res) => {
    try {
      const { eventId, section } = req.query;
      const mediaItems = await storage.getMedia(
        eventId as string | undefined,
        section as string | undefined
      );
      res.json(mediaItems);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch media" });
    }
  });

  app.post("/api/media", requireAdmin, async (req, res) => {
    try {
      const data = insertMediaSchema.parse(req.body);
      const mediaItem = await storage.createMedia(data);
      res.json(mediaItem);
    } catch (error) {
      res.status(400).json({ message: "Invalid media data" });
    }
  });

  app.patch("/api/media/:id", requireAdmin, async (req, res) => {
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

  app.delete("/api/media/:id", requireAdmin, async (req, res) => {
    try {
      await storage.deleteMedia(req.params.id);
      res.json({ message: "Media deleted" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete media" });
    }
  });

  app.get("/api/documents", async (req, res) => {
    try {
      const { section } = req.query;
      const docs = await storage.getDocuments(section as string | undefined);
      res.json(docs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch documents" });
    }
  });

  app.get("/api/documents/:id", async (req, res) => {
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

  app.post("/api/documents", requireAdmin, async (req, res) => {
    try {
      const data = insertDocumentSchema.parse(req.body);
      const doc = await storage.createDocument(data);
      res.json(doc);
    } catch (error) {
      res.status(400).json({ message: "Invalid document data" });
    }
  });

  app.patch("/api/documents/:id", requireAdmin, async (req, res) => {
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

  app.delete("/api/documents/:id", requireAdmin, async (req, res) => {
    try {
      await storage.deleteDocument(req.params.id);
      res.json({ message: "Document deleted" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete document" });
    }
  });

  app.get("/api/teachers", async (req, res) => {
    try {
      const teachers = await storage.getTeachers();
      res.json(teachers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch teachers" });
    }
  });

  app.get("/api/teachers/:id", async (req, res) => {
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

  app.post("/api/teachers", requireAdmin, async (req, res) => {
    try {
      const data = insertTeacherSchema.parse(req.body);
      const teacher = await storage.createTeacher(data);
      res.json(teacher);
    } catch (error) {
      res.status(400).json({ message: "Invalid teacher data" });
    }
  });

  app.patch("/api/teachers/:id", requireAdmin, async (req, res) => {
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

  app.delete("/api/teachers/:id", requireAdmin, async (req, res) => {
    try {
      await storage.deleteTeacher(req.params.id);
      res.json({ message: "Teacher deleted" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete teacher" });
    }
  });

  app.get("/api/news", async (req, res) => {
    try {
      const newsItems = await storage.getNews();
      res.json(newsItems);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch news" });
    }
  });

  app.get("/api/news/:id", async (req, res) => {
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

  app.post("/api/news", requireAdmin, async (req, res) => {
    try {
      const data = insertNewsSchema.parse(req.body);
      const newsItem = await storage.createNews(data);
      res.json(newsItem);
    } catch (error) {
      res.status(400).json({ message: "Invalid news data" });
    }
  });

  app.patch("/api/news/:id", requireAdmin, async (req, res) => {
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

  app.delete("/api/news/:id", requireAdmin, async (req, res) => {
    try {
      await storage.deleteNews(req.params.id);
      res.json({ message: "News item deleted" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete news item" });
    }
  });

  // Site Content Routes
  app.get("/api/content", async (req, res) => {
    try {
      const { key, lang } = req.query;
      const content = await storage.getSiteContent(
        key as string | undefined,
        lang as string | undefined
      );
      res.json(content);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch content" });
    }
  });

  app.get("/api/content/:id", async (req, res) => {
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

  app.post("/api/content", requireAdmin, async (req, res) => {
    try {
      const data = insertSiteContentSchema.parse(req.body);
      const content = await storage.createSiteContent(data);
      res.json(content);
    } catch (error) {
      res.status(400).json({ message: "Invalid content data" });
    }
  });

  app.patch("/api/content/:id", requireAdmin, async (req, res) => {
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

  app.delete("/api/content/:id", requireAdmin, async (req, res) => {
    try {
      await storage.deleteSiteContent(req.params.id);
      res.json({ message: "Content deleted" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete content" });
    }
  });

  // Sections Routes
  app.get("/api/sections", async (req, res) => {
    try {
      const { page } = req.query;
      const sectionsList = await storage.getSections(page as string | undefined);
      res.json(sectionsList);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch sections" });
    }
  });

  app.get("/api/sections/:id", async (req, res) => {
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

  app.post("/api/sections", requireAdmin, async (req, res) => {
    try {
      const data = insertSectionSchema.parse(req.body);
      const section = await storage.createSection(data);
      res.json(section);
    } catch (error) {
      res.status(400).json({ message: "Invalid section data" });
    }
  });

  app.patch("/api/sections/:id", requireAdmin, async (req, res) => {
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

  app.delete("/api/sections/:id", requireAdmin, async (req, res) => {
    try {
      await storage.deleteSection(req.params.id);
      res.json({ message: "Section deleted" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete section" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
