-- Add topic column to Task
ALTER TABLE "Task" ADD COLUMN "topic" TEXT;

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Task_topic_idx" ON "Task"("topic");
