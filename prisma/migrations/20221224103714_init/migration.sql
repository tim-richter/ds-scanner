/*
  Warnings:

  - You are about to drop the `Instance` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `instanceId` on the `Prop` table. All the data in the column will be lost.
  - Added the required column `importType` to the `Component` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imported` to the `Component` table without a default value. This is not possible if the table is not empty.
  - Added the required column `local` to the `Component` table without a default value. This is not possible if the table is not empty.
  - Added the required column `locationEndColumn` to the `Component` table without a default value. This is not possible if the table is not empty.
  - Added the required column `locationEndLine` to the `Component` table without a default value. This is not possible if the table is not empty.
  - Added the required column `locationStartColumn` to the `Component` table without a default value. This is not possible if the table is not empty.
  - Added the required column `locationStartLine` to the `Component` table without a default value. This is not possible if the table is not empty.
  - Added the required column `moduleName` to the `Component` table without a default value. This is not possible if the table is not empty.
  - Added the required column `propsSpread` to the `Component` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Instance";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Component" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "propsSpread" BOOLEAN NOT NULL,
    "importType" TEXT NOT NULL,
    "imported" TEXT NOT NULL,
    "local" TEXT NOT NULL,
    "moduleName" TEXT NOT NULL,
    "locationEndColumn" INTEGER NOT NULL,
    "locationEndLine" INTEGER NOT NULL,
    "locationStartColumn" INTEGER NOT NULL,
    "locationStartLine" INTEGER NOT NULL,
    "fileId" INTEGER,
    CONSTRAINT "Component_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Component" ("fileId", "id", "name") SELECT "fileId", "id", "name" FROM "Component";
DROP TABLE "Component";
ALTER TABLE "new_Component" RENAME TO "Component";
CREATE TABLE "new_Prop" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "componentId" INTEGER,
    CONSTRAINT "Prop_componentId_fkey" FOREIGN KEY ("componentId") REFERENCES "Component" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Prop" ("id", "name", "value") SELECT "id", "name", "value" FROM "Prop";
DROP TABLE "Prop";
ALTER TABLE "new_Prop" RENAME TO "Prop";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
