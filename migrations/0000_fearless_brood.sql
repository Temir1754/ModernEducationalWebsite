CREATE TABLE `document_folders` (
	`id` varchar(36) NOT NULL,
	`parent_id` varchar(36),
	`name` text NOT NULL,
	`order` int DEFAULT 0,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `document_folders_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `documents` (
	`id` varchar(36) NOT NULL,
	`section` varchar(100) NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`url` text NOT NULL,
	`scan_url` text,
	`color` varchar(50),
	`icon` varchar(50),
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `documents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `events` (
	`id` varchar(36) NOT NULL,
	`month` varchar(50) NOT NULL,
	`title` text NOT NULL,
	`date_text` text NOT NULL,
	`description` text NOT NULL,
	`media_url` text,
	`media_type` varchar(20),
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `media` (
	`id` varchar(36) NOT NULL,
	`type` varchar(20) NOT NULL,
	`url` text NOT NULL,
	`thumbnail_url` text,
	`caption` text,
	`event_id` varchar(36),
	`section` varchar(100),
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `media_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `news` (
	`id` varchar(36) NOT NULL,
	`title` text NOT NULL,
	`body` text NOT NULL,
	`cover_url` text,
	`date_text` text NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `news_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sections` (
	`id` varchar(36) NOT NULL,
	`page` varchar(100) NOT NULL,
	`slug` varchar(100) NOT NULL,
	`order` varchar(10) NOT NULL,
	`is_visible` boolean DEFAULT true,
	`config` text,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `sections_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `site_content` (
	`id` varchar(36) NOT NULL,
	`key` varchar(255) NOT NULL,
	`lang` varchar(10) NOT NULL DEFAULT 'kz',
	`value` text NOT NULL,
	`type` varchar(50) DEFAULT 'text',
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `site_content_id` PRIMARY KEY(`id`),
	CONSTRAINT `site_content_key_unique` UNIQUE(`key`)
);
--> statement-breakpoint
CREATE TABLE `teachers` (
	`id` varchar(36) NOT NULL,
	`name` varchar(255) NOT NULL,
	`position` varchar(255) NOT NULL,
	`phone` varchar(50),
	`email` varchar(255),
	`photo_url` text,
	`department` varchar(100),
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `teachers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` varchar(36) NOT NULL,
	`username` varchar(255) NOT NULL,
	`password` text NOT NULL,
	`role` varchar(50) DEFAULT 'user',
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_username_unique` UNIQUE(`username`)
);
--> statement-breakpoint
ALTER TABLE `media` ADD CONSTRAINT `media_event_id_events_id_fk` FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON DELETE no action ON UPDATE no action;