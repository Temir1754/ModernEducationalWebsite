ALTER TABLE `document_folders` MODIFY COLUMN `id` varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE `document_folders` MODIFY COLUMN `parent_id` varchar(100);--> statement-breakpoint
ALTER TABLE `document_folders` MODIFY COLUMN `name` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `document_folders` MODIFY COLUMN `order` varchar(10) DEFAULT '0';--> statement-breakpoint
ALTER TABLE `document_folders` ADD `is_category` boolean DEFAULT false;