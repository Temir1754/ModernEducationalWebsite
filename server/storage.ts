import { users, events, media, documents, teachers, news, siteContent, sections, type User, type InsertUser, type Event, type InsertEvent, type Media, type InsertMedia, type Document, type InsertDocument, type Teacher, type InsertTeacher, type News, type InsertNews, type SiteContent, type InsertSiteContent, type Section, type InsertSection } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  getEvents(month?: string): Promise<Event[]>;
  getEvent(id: string): Promise<Event | undefined>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEvent(id: string, event: Partial<InsertEvent>): Promise<Event | undefined>;
  deleteEvent(id: string): Promise<void>;

  getMedia(eventId?: string, section?: string): Promise<Media[]>;
  createMedia(media: InsertMedia): Promise<Media>;
  updateMedia(id: string, media: Partial<InsertMedia>): Promise<Media | undefined>;
  deleteMedia(id: string): Promise<void>;

  getDocuments(section?: string): Promise<Document[]>;
  getDocument(id: string): Promise<Document | undefined>;
  createDocument(doc: InsertDocument): Promise<Document>;
  updateDocument(id: string, doc: Partial<InsertDocument>): Promise<Document | undefined>;
  deleteDocument(id: string): Promise<void>;

  getTeachers(): Promise<Teacher[]>;
  getTeacher(id: string): Promise<Teacher | undefined>;
  createTeacher(teacher: InsertTeacher): Promise<Teacher>;
  updateTeacher(id: string, teacher: Partial<InsertTeacher>): Promise<Teacher | undefined>;
  deleteTeacher(id: string): Promise<void>;

  getNews(): Promise<News[]>;
  getNewsItem(id: string): Promise<News | undefined>;
  createNews(news: InsertNews): Promise<News>;
  updateNews(id: string, news: Partial<InsertNews>): Promise<News | undefined>;
  deleteNews(id: string): Promise<void>;

  getSiteContent(key?: string, lang?: string): Promise<SiteContent[]>;
  getSiteContentItem(id: string): Promise<SiteContent | undefined>;
  createSiteContent(content: InsertSiteContent): Promise<SiteContent>;
  updateSiteContent(id: string, content: Partial<InsertSiteContent>): Promise<SiteContent | undefined>;
  deleteSiteContent(id: string): Promise<void>;

  getSections(page?: string): Promise<Section[]>;
  getSection(id: string): Promise<Section | undefined>;
  createSection(section: InsertSection): Promise<Section>;
  updateSection(id: string, section: Partial<InsertSection>): Promise<Section | undefined>;
  deleteSection(id: string): Promise<void>;

  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = crypto.randomUUID();
    await db.insert(users).values({ ...insertUser, id });
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getEvents(month?: string): Promise<Event[]> {
    if (month) {
      return db.select().from(events).where(eq(events.month, month));
    }
    return db.select().from(events);
  }

  async getEvent(id: string): Promise<Event | undefined> {
    const [event] = await db.select().from(events).where(eq(events.id, id));
    return event;
  }

  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const id = crypto.randomUUID();
    await db.insert(events).values({ ...insertEvent, id });
    const [event] = await db.select().from(events).where(eq(events.id, id));
    return event;
  }

  async updateEvent(id: string, event: Partial<InsertEvent>): Promise<Event | undefined> {
    await db.update(events).set(event).where(eq(events.id, id));
    return this.getEvent(id);
  }

  async deleteEvent(id: string): Promise<void> {
    await db.delete(events).where(eq(events.id, id));
  }

  async getMedia(eventId?: string, section?: string): Promise<Media[]> {
    if (eventId) {
      return db.select().from(media).where(eq(media.eventId, eventId));
    }
    if (section) {
      return db.select().from(media).where(eq(media.section, section));
    }
    return db.select().from(media);
  }

  async createMedia(insertMedia: InsertMedia): Promise<Media> {
    const id = crypto.randomUUID();
    await db.insert(media).values({ ...insertMedia, id });
    const [m] = await db.select().from(media).where(eq(media.id, id));
    return m;
  }

  async updateMedia(id: string, mediaData: Partial<InsertMedia>): Promise<Media | undefined> {
    await db.update(media).set(mediaData).where(eq(media.id, id));
    const [m] = await db.select().from(media).where(eq(media.id, id));
    return m;
  }

  async deleteMedia(id: string): Promise<void> {
    await db.delete(media).where(eq(media.id, id));
  }

  async getDocuments(section?: string): Promise<Document[]> {
    if (section) {
      return db.select().from(documents).where(eq(documents.section, section));
    }
    return db.select().from(documents);
  }

  async getDocument(id: string): Promise<Document | undefined> {
    const [doc] = await db.select().from(documents).where(eq(documents.id, id));
    return doc;
  }

  async createDocument(insertDoc: InsertDocument): Promise<Document> {
    const id = crypto.randomUUID();
    await db.insert(documents).values({ ...insertDoc, id });
    const [doc] = await db.select().from(documents).where(eq(documents.id, id));
    return doc;
  }

  async updateDocument(id: string, doc: Partial<InsertDocument>): Promise<Document | undefined> {
    await db.update(documents).set(doc).where(eq(documents.id, id));
    return this.getDocument(id);
  }

  async deleteDocument(id: string): Promise<void> {
    await db.delete(documents).where(eq(documents.id, id));
  }

  async getTeachers(): Promise<Teacher[]> {
    return db.select().from(teachers);
  }

  async getTeacher(id: string): Promise<Teacher | undefined> {
    const [teacher] = await db.select().from(teachers).where(eq(teachers.id, id));
    return teacher;
  }

  async createTeacher(insertTeacher: InsertTeacher): Promise<Teacher> {
    const id = crypto.randomUUID();
    await db.insert(teachers).values({ ...insertTeacher, id });
    const [t] = await db.select().from(teachers).where(eq(teachers.id, id));
    return t;
  }

  async updateTeacher(id: string, teacher: Partial<InsertTeacher>): Promise<Teacher | undefined> {
    await db.update(teachers).set(teacher).where(eq(teachers.id, id));
    return this.getTeacher(id);
  }

  async deleteTeacher(id: string): Promise<void> {
    await db.delete(teachers).where(eq(teachers.id, id));
  }

  async getNews(): Promise<News[]> {
    return db.select().from(news);
  }

  async getNewsItem(id: string): Promise<News | undefined> {
    const [n] = await db.select().from(news).where(eq(news.id, id));
    return n;
  }

  async createNews(insertNews: InsertNews): Promise<News> {
    const id = crypto.randomUUID();
    await db.insert(news).values({ ...insertNews, id });
    const [n] = await db.select().from(news).where(eq(news.id, id));
    return n;
  }

  async updateNews(id: string, newsItem: Partial<InsertNews>): Promise<News | undefined> {
    await db.update(news).set(newsItem).where(eq(news.id, id));
    return this.getNewsItem(id);
  }

  async deleteNews(id: string): Promise<void> {
    await db.delete(news).where(eq(news.id, id));
  }

  async getSiteContent(key?: string, lang?: string): Promise<SiteContent[]> {
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

  async getSiteContentItem(id: string): Promise<SiteContent | undefined> {
    const [content] = await db.select().from(siteContent).where(eq(siteContent.id, id));
    return content;
  }

  async createSiteContent(insertContent: InsertSiteContent): Promise<SiteContent> {
    const id = crypto.randomUUID();
    await db.insert(siteContent).values({ ...insertContent, id });
    const [content] = await db.select().from(siteContent).where(eq(siteContent.id, id));
    return content;
  }

  async updateSiteContent(id: string, content: Partial<InsertSiteContent>): Promise<SiteContent | undefined> {
    await db.update(siteContent).set(content).where(eq(siteContent.id, id));
    return this.getSiteContentItem(id);
  }

  async deleteSiteContent(id: string): Promise<void> {
    await db.delete(siteContent).where(eq(siteContent.id, id));
  }

  async getSections(page?: string): Promise<Section[]> {
    if (page) {
      return db.select().from(sections).where(eq(sections.page, page));
    }
    return db.select().from(sections);
  }

  async getSection(id: string): Promise<Section | undefined> {
    const [section] = await db.select().from(sections).where(eq(sections.id, id));
    return section;
  }

  async createSection(insertSection: InsertSection): Promise<Section> {
    const id = crypto.randomUUID();
    await db.insert(sections).values({ ...insertSection, id });
    const [section] = await db.select().from(sections).where(eq(sections.id, id));
    return section;
  }

  async updateSection(id: string, section: Partial<InsertSection>): Promise<Section | undefined> {
    await db.update(sections).set(section).where(eq(sections.id, id));
    return this.getSection(id);
  }

  async deleteSection(id: string): Promise<void> {
    await db.delete(sections).where(eq(sections.id, id));
  }
}

export const storage = new DatabaseStorage();
