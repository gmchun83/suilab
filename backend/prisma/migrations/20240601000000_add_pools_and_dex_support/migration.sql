-- AlterTable
ALTER TABLE "Coin" ADD COLUMN "marketCap" TEXT,
                  ADD COLUMN "poolId" TEXT,
                  ADD COLUMN "dexPoolId" TEXT,
                  ADD COLUMN "dexListed" BOOLEAN NOT NULL DEFAULT false,
                  ADD COLUMN "holders" INTEGER NOT NULL DEFAULT 0,
                  ADD COLUMN "burnedSupply" BIGINT NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "Pool" (
  "id" TEXT NOT NULL,
  "objectId" TEXT NOT NULL,
  "coinId" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "suiBalance" TEXT NOT NULL,
  "tokenBalance" TEXT NOT NULL,
  "creatorAddress" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Pool_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Pool_objectId_key" ON "Pool"("objectId");

-- AddForeignKey
ALTER TABLE "Pool" ADD CONSTRAINT "Pool_coinId_fkey" FOREIGN KEY ("coinId") REFERENCES "Coin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
