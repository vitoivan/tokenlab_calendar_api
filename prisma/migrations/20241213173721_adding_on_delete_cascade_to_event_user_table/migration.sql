-- DropForeignKey
ALTER TABLE "event_user" DROP CONSTRAINT "event_user_eventId_fkey";

-- AddForeignKey
ALTER TABLE "event_user" ADD CONSTRAINT "event_user_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;
