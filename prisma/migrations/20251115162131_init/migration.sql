-- CreateTable
CREATE TABLE "Item" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Requirement" (
    "id" TEXT NOT NULL,
    "processedSourceId" TEXT NOT NULL,
    "requiredItemId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "Requirement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gathered_item_sources" (
    "id" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,

    CONSTRAINT "gathered_item_sources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "processed_item_sources" (
    "id" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "time" INTEGER NOT NULL,

    CONSTRAINT "processed_item_sources_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Item_name_key" ON "Item"("name");

-- AddForeignKey
ALTER TABLE "Requirement" ADD CONSTRAINT "Requirement_processedSourceId_fkey" FOREIGN KEY ("processedSourceId") REFERENCES "processed_item_sources"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Requirement" ADD CONSTRAINT "Requirement_requiredItemId_fkey" FOREIGN KEY ("requiredItemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gathered_item_sources" ADD CONSTRAINT "gathered_item_sources_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "processed_item_sources" ADD CONSTRAINT "processed_item_sources_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
