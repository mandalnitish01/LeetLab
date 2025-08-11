/*
  Warnings:

  - You are about to drop the column `compiledOutput` on the `TestCaseResult` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "TestCaseResult" DROP COLUMN "compiledOutput",
ADD COLUMN     "compileOutput" TEXT;
