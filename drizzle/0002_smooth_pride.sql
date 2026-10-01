CREATE TABLE "samachar" (
	"slug" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"summary" text NOT NULL,
	"category" text NOT NULL,
	"image_url" text,
	"body" text NOT NULL,
	"status" text DEFAULT 'DRAFT' NOT NULL,
	"published_at" text,
	"created_at" text NOT NULL,
	"updated_at" text NOT NULL
);
