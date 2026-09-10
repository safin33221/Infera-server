/*
  Warnings:

  - You are about to drop the column `deletedAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `CareerField` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CareerGoal` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CareerRole` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Skill` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserBehaviorProfile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserCareerGoal` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserCareerInterest` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserPreference` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserProfile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserRecommendation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserSkillInterest` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserTopicInterest` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CareerRole" DROP CONSTRAINT "CareerRole_careerFieldId_fkey";

-- DropForeignKey
ALTER TABLE "UserBehaviorProfile" DROP CONSTRAINT "UserBehaviorProfile_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserCareerGoal" DROP CONSTRAINT "UserCareerGoal_careerGoalId_fkey";

-- DropForeignKey
ALTER TABLE "UserCareerGoal" DROP CONSTRAINT "UserCareerGoal_userProfileId_fkey";

-- DropForeignKey
ALTER TABLE "UserCareerInterest" DROP CONSTRAINT "UserCareerInterest_careerFieldId_fkey";

-- DropForeignKey
ALTER TABLE "UserCareerInterest" DROP CONSTRAINT "UserCareerInterest_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserPreference" DROP CONSTRAINT "UserPreference_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserProfile" DROP CONSTRAINT "UserProfile_careerFieldId_fkey";

-- DropForeignKey
ALTER TABLE "UserProfile" DROP CONSTRAINT "UserProfile_currentRoleId_fkey";

-- DropForeignKey
ALTER TABLE "UserProfile" DROP CONSTRAINT "UserProfile_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserRecommendation" DROP CONSTRAINT "UserRecommendation_newsId_fkey";

-- DropForeignKey
ALTER TABLE "UserRecommendation" DROP CONSTRAINT "UserRecommendation_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserSkillInterest" DROP CONSTRAINT "UserSkillInterest_skillId_fkey";

-- DropForeignKey
ALTER TABLE "UserSkillInterest" DROP CONSTRAINT "UserSkillInterest_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserTopicInterest" DROP CONSTRAINT "UserTopicInterest_topicId_fkey";

-- DropForeignKey
ALTER TABLE "UserTopicInterest" DROP CONSTRAINT "UserTopicInterest_userId_fkey";

-- DropIndex
DROP INDEX "User_createdAt_idx";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "deletedAt",
DROP COLUMN "firstName",
DROP COLUMN "lastName";

-- DropTable
DROP TABLE "CareerField";

-- DropTable
DROP TABLE "CareerGoal";

-- DropTable
DROP TABLE "CareerRole";

-- DropTable
DROP TABLE "Skill";

-- DropTable
DROP TABLE "UserBehaviorProfile";

-- DropTable
DROP TABLE "UserCareerGoal";

-- DropTable
DROP TABLE "UserCareerInterest";

-- DropTable
DROP TABLE "UserPreference";

-- DropTable
DROP TABLE "UserProfile";

-- DropTable
DROP TABLE "UserRecommendation";

-- DropTable
DROP TABLE "UserSkillInterest";

-- DropTable
DROP TABLE "UserTopicInterest";

-- DropEnum
DROP TYPE "EmploymentStatus";

-- DropEnum
DROP TYPE "ExperienceLevel";

-- DropEnum
DROP TYPE "InterestSource";

-- CreateTable
CREATE TABLE "ProfessionalProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "jobTitle" TEXT,
    "company" TEXT,
    "industry" TEXT,
    "location" TEXT,
    "yearsOfExperience" INTEGER,
    "linkedinUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProfessionalProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProfessionalProfile_userId_key" ON "ProfessionalProfile"("userId");

-- AddForeignKey
ALTER TABLE "ProfessionalProfile" ADD CONSTRAINT "ProfessionalProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
