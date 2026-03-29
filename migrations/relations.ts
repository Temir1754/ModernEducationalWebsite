import { relations } from "drizzle-orm/relations";
import { events, media } from "./schema";

export const mediaRelations = relations(media, ({one}) => ({
	event: one(events, {
		fields: [media.eventId],
		references: [events.id]
	}),
}));

export const eventsRelations = relations(events, ({many}) => ({
	media: many(media),
}));