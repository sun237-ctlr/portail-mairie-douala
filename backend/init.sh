#!/bin/sh
set -e

echo "Initializing database..."

# Create database if it doesn't exist
echo "Creating database if it doesn't exist..."
mysql -h192.168.1.176 -uroot -proot -e "CREATE DATABASE IF NOT EXISTS portail_mairie CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>/dev/null || echo "Could not create database directly, will try via Prisma..."

# Try to run migrations
echo "Attempting Prisma migrations..."
npx prisma migrate deploy || echo "Warning: Migrations may have failed"

echo "Generating Prisma Client..."
npx prisma generate

echo "Starting Node.js server..."
exec node src/index.js
