-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Component" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    "propsSpread" BOOLEAN NOT NULL,
    "importType" TEXT NOT NULL,
    "imported" TEXT,
    "local" TEXT,
    "moduleName" TEXT,
    "locationEndColumn" INTEGER NOT NULL,
    "locationEndLine" INTEGER NOT NULL,
    "locationStartColumn" INTEGER NOT NULL,
    "locationStartLine" INTEGER NOT NULL,
    "fileId" INTEGER,
    CONSTRAINT "Component_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Component" ("fileId", "id", "importType", "imported", "local", "locationEndColumn", "locationEndLine", "locationStartColumn", "locationStartLine", "moduleName", "name", "propsSpread") SELECT "fileId", "id", "importType", "imported", "local", "locationEndColumn", "locationEndLine", "locationStartColumn", "locationStartLine", "moduleName", "name", "propsSpread" FROM "Component";
DROP TABLE "Component";
ALTER TABLE "new_Component" RENAME TO "Component";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
