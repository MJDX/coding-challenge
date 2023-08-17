-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Questionnaire" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "image" TEXT NOT NULL,
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
CREATE TABLE "QuestionnaireUserSession" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "sharable" BOOLEAN NOT NULL,
    "questionnaireId" INTEGER NOT NULL,

    CONSTRAINT "QuestionnaireUserSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestionnaireUserSessionAnswer" (
    "id" SERIAL NOT NULL,
    "questionnaireUserSessionId" INTEGER NOT NULL,
    "questionPageId" INTEGER NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "QuestionnaireUserSessionAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Questionnaire_questionnaireName_key" ON "Questionnaire"("questionnaireName");

-- CreateIndex
CREATE UNIQUE INDEX "QuestionPage_pageName_key" ON "QuestionPage"("pageName");

-- CreateIndex
CREATE UNIQUE INDEX "QuestionnaireUserSession_title_userId_key" ON "QuestionnaireUserSession"("title", "userId");

-- AddForeignKey
ALTER TABLE "QuestionPage" ADD CONSTRAINT "QuestionPage_questionnaireId_fkey" FOREIGN KEY ("questionnaireId") REFERENCES "Questionnaire"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionnaireUserSession" ADD CONSTRAINT "QuestionnaireUserSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionnaireUserSession" ADD CONSTRAINT "QuestionnaireUserSession_questionnaireId_fkey" FOREIGN KEY ("questionnaireId") REFERENCES "Questionnaire"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionnaireUserSessionAnswer" ADD CONSTRAINT "QuestionnaireUserSessionAnswer_questionnaireUserSessionId_fkey" FOREIGN KEY ("questionnaireUserSessionId") REFERENCES "QuestionnaireUserSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionnaireUserSessionAnswer" ADD CONSTRAINT "QuestionnaireUserSessionAnswer_questionPageId_fkey" FOREIGN KEY ("questionPageId") REFERENCES "QuestionPage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
