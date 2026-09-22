CREATE TABLE "events" (
	"day" text NOT NULL,
	"name" text NOT NULL,
	"count" integer NOT NULL,
	CONSTRAINT "events_day_name_pk" PRIMARY KEY("day","name")
);
--> statement-breakpoint
CREATE TABLE "schemes" (
	"slug" text PRIMARY KEY NOT NULL,
	"type" text DEFAULT 'scheme' NOT NULL,
	"data" text NOT NULL,
	"status" text NOT NULL,
	"next_review_at" text,
	"updated_at" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rate_limits" (
	"key" text PRIMARY KEY NOT NULL,
	"count" integer NOT NULL,
	"expires" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reminders" (
	"id" text PRIMARY KEY NOT NULL,
	"session_id" text NOT NULL,
	"slug" text NOT NULL,
	"date" text NOT NULL,
	"created_at" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reports" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"reason" text NOT NULL,
	"detail" text NOT NULL,
	"status" text DEFAULT 'open' NOT NULL,
	"created_at" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "signals" (
	"session_id" text NOT NULL,
	"slug" text NOT NULL,
	CONSTRAINT "signals_session_id_slug_pk" PRIMARY KEY("session_id","slug")
);
--> statement-breakpoint
CREATE TABLE "verification_logs" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"actor" text NOT NULL,
	"source" text NOT NULL,
	"changes" text NOT NULL,
	"created_at" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "reminders" ADD CONSTRAINT "reminders_session_id_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reminders" ADD CONSTRAINT "reminders_slug_schemes_slug_fk" FOREIGN KEY ("slug") REFERENCES "public"."schemes"("slug") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_slug_schemes_slug_fk" FOREIGN KEY ("slug") REFERENCES "public"."schemes"("slug") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "signals" ADD CONSTRAINT "signals_session_id_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "signals" ADD CONSTRAINT "signals_slug_schemes_slug_fk" FOREIGN KEY ("slug") REFERENCES "public"."schemes"("slug") ON DELETE no action ON UPDATE no action;