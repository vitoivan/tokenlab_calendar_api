-- CreateTable
CREATE TABLE "events" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "start" TIMESTAMP(3) NOT NULL,
    "end" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_user" (
    "id" BIGSERIAL NOT NULL,
    "eventId" BIGINT NOT NULL,
    "userId" BIGINT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "event_user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "event_start_end_idx" ON "events"("start", "end");

-- CreateIndex
CREATE INDEX "event_name_idx" ON "events"("name");

-- CreateIndex
CREATE INDEX "event_user_event_id_user_id_idx" ON "event_user"("eventId", "userId");

-- CreateIndex
CREATE INDEX "user_name_idx" ON "users"("name");

-- AddForeignKey
ALTER TABLE "event_user" ADD CONSTRAINT "event_user_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_user" ADD CONSTRAINT "event_user_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "email" RENAME TO "user_email_idx";
