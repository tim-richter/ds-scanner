-- CreateTable
CREATE TABLE "File" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "path" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Component" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "fileId" INTEGER,
    CONSTRAINT "Component_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Instance" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "propsSpread" BOOLEAN NOT NULL,
    "componentId" INTEGER,
    "importType" TEXT NOT NULL,
    "imported" TEXT NOT NULL,
    "local" TEXT NOT NULL,
    "moduleName" TEXT NOT NULL,
    "locationEndColumn" INTEGER NOT NULL,
    "locationEndLine" INTEGER NOT NULL,
    "locationStartColumn" INTEGER NOT NULL,
    "locationStartLine" INTEGER NOT NULL,
    CONSTRAINT "Instance_componentId_fkey" FOREIGN KEY ("componentId") REFERENCES "Component" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Prop" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "instanceId" INTEGER,
    CONSTRAINT "Prop_instanceId_fkey" FOREIGN KEY ("instanceId") REFERENCES "Instance" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "File_path_key" ON "File"("path");
