/*
  Warnings:

  - Added the required column `service_duration` to the `agenda` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "agenda" ADD COLUMN     "service_duration" INTEGER NOT NULL;
