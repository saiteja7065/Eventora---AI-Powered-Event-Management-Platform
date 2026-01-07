-- Eventora Database Schema
-- Run this in Supabase SQL Editor

-- Create ENUM types
CREATE TYPE "SubscriptionTier" AS ENUM ('FREE', 'PRO');
CREATE TYPE "EventStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'CANCELLED', 'COMPLETED');
CREATE TYPE "TicketStatus" AS ENUM ('ACTIVE', 'USED', 'CANCELLED', 'EXPIRED');

-- ============================================
-- Users Table
-- ============================================
CREATE TABLE "users" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "email" VARCHAR(255) UNIQUE NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "avatar" TEXT,
    "location" JSONB,
    "interests" TEXT[],
    "subscriptionTier" "SubscriptionTier" NOT NULL DEFAULT 'FREE',
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX "users_email_idx" ON "users"("email");

-- ============================================
-- Events Table
-- ============================================
CREATE TABLE "events" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "creatorId" UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "categories" TEXT[],
    "coverImage" JSONB,
    "locationType" VARCHAR(50) NOT NULL,
    "address" TEXT,
    "city" VARCHAR(255) NOT NULL,
    "country" VARCHAR(255) NOT NULL,
    "coordinates" JSONB,
    "virtualLink" TEXT,
    "startTime" TIMESTAMP NOT NULL,
    "endTime" TIMESTAMP NOT NULL,
    "timezone" VARCHAR(100) NOT NULL DEFAULT 'UTC',
    "capacity" INTEGER,
    "ticketPrice" DECIMAL(10, 2) NOT NULL DEFAULT 0,
    "status" "EventStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX "events_creatorId_idx" ON "events"("creatorId");
CREATE INDEX "events_city_idx" ON "events"("city");
CREATE INDEX "events_status_idx" ON "events"("status");
CREATE INDEX "events_startTime_idx" ON "events"("startTime");

-- ============================================
-- Tickets Table
-- ============================================
CREATE TABLE "tickets" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "eventId" UUID NOT NULL REFERENCES "events"("id") ON DELETE CASCADE,
    "userId" UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "qrCode" VARCHAR(255) UNIQUE NOT NULL,
    "ticketNumber" VARCHAR(255) UNIQUE NOT NULL,
    "status" "TicketStatus" NOT NULL DEFAULT 'ACTIVE',
    "purchasePrice" DECIMAL(10, 2) NOT NULL,
    "attendeeName" VARCHAR(255) NOT NULL,
    "attendeeEmail" VARCHAR(255) NOT NULL,
    "checkedInAt" TIMESTAMP,
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX "tickets_eventId_idx" ON "tickets"("eventId");
CREATE INDEX "tickets_userId_idx" ON "tickets"("userId");
CREATE INDEX "tickets_qrCode_idx" ON "tickets"("qrCode");

-- ============================================
-- Event Analytics Table
-- ============================================
CREATE TABLE "event_analytics" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "eventId" UUID UNIQUE NOT NULL REFERENCES "events"("id") ON DELETE CASCADE,
    "views" INTEGER NOT NULL DEFAULT 0,
    "registrations" INTEGER NOT NULL DEFAULT 0,
    "checkIns" INTEGER NOT NULL DEFAULT 0,
    "revenue" DECIMAL(10, 2) NOT NULL DEFAULT 0,
    "engagementRate" DECIMAL(5, 2) NOT NULL DEFAULT 0,
    "demographics" JSONB,
    "timeSeriesData" JSONB,
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ============================================
-- Trigger to auto-update updatedAt
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON "users"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON "events"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tickets_updated_at BEFORE UPDATE ON "tickets"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_event_analytics_updated_at BEFORE UPDATE ON "event_analytics"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
