-- CreateTable
CREATE TABLE "File" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "path" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Component" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    "propsSpread" BOOLEAN NOT NULL,
    "importType" TEXT,
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

-- CreateTable
CREATE TABLE "Prop" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "componentId" INTEGER,
    CONSTRAINT "Prop_componentId_fkey" FOREIGN KEY ("componentId") REFERENCES "Component" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "File_path_key" ON "File"("path");
