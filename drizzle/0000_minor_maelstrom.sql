CREATE TABLE `events` (
	`day` text NOT NULL,
	`name` text NOT NULL,
	`count` integer NOT NULL,
	PRIMARY KEY(`day`, `name`)
);
--> statement-breakpoint
CREATE TABLE `rate_limits` (
	`key` text PRIMARY KEY NOT NULL,
	`count` integer NOT NULL,
	`expires` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `reminders` (
	`id` text PRIMARY KEY NOT NULL,
	`session_id` text NOT NULL,
	`slug` text NOT NULL,
	`date` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`session_id`) REFERENCES `sessions`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`slug`) REFERENCES `schemes`(`slug`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `reports` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`reason` text NOT NULL,
	`detail` text NOT NULL,
	`status` text DEFAULT 'open' NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`slug`) REFERENCES `schemes`(`slug`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `schemes` (
	`slug` text PRIMARY KEY NOT NULL,
	`data` text NOT NULL,
	`status` text NOT NULL,
	`next_review_at` text,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`expires_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `signals` (
	`session_id` text NOT NULL,
	`slug` text NOT NULL,
	PRIMARY KEY(`session_id`, `slug`),
	FOREIGN KEY (`session_id`) REFERENCES `sessions`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`slug`) REFERENCES `schemes`(`slug`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `verification_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`actor` text NOT NULL,
	`source` text NOT NULL,
	`changes` text NOT NULL,
	`created_at` text NOT NULL
);
