-- CreateTable
CREATE TABLE "Questionnaire" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "questionnaireName" TEXT NOT NULL,
    "resultPage" JSONB NOT NULL,

    CONSTRAINT "Questionnaire_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestionPage" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "pageName" TEXT NOT NULL,
    "pageType" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "questionnaireId" INTEGER NOT NULL,

    CONSTRAINT "QuestionPage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Answer" (
    "id" SERIAL NOT NULL,
    "value" TEXT NOT NULL,
    "questionPageId" INTEGER NOT NULL,

    CONSTRAINT "Answer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Questionnaire_questionnaireName_key" ON "Questionnaire"("questionnaireName");

-- CreateIndex
CREATE UNIQUE INDEX "QuestionPage_pageName_key" ON "QuestionPage"("pageName");

-- CreateIndex
CREATE UNIQUE INDEX "Answer_questionPageId_key" ON "Answer"("questionPageId");

-- AddForeignKey
ALTER TABLE "QuestionPage" ADD CONSTRAINT "QuestionPage_questionnaireId_fkey" FOREIGN KEY ("questionnaireId") REFERENCES "Questionnaire"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_questionPageId_fkey" FOREIGN KEY ("questionPageId") REFERENCES "QuestionPage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
