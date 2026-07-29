-- V3.1: Add image_url column to recipes table
-- Run this in Supabase SQL Editor before deploying V3.1

ALTER TABLE recipes ADD COLUMN IF NOT EXISTS image_url TEXT;
