CREATE TABLE IF NOT EXISTS "blogs" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"image" varchar(255) NOT NULL,
	"status" varchar(20) DEFAULT 'Published' NOT NULL,
	"invited_at" timestamp DEFAULT now() NOT NULL
);
