-- CreateTable
CREATE TABLE "SnippetVersion" (
    "id" TEXT NOT NULL,
    "snippetId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SnippetVersion_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SnippetVersion" ADD CONSTRAINT "SnippetVersion_snippetId_fkey" FOREIGN KEY ("snippetId") REFERENCES "CodeSnippet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
