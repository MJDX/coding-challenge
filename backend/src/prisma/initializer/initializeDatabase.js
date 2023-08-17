const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function initializeDatabase() {
  try {
    const filePath = path.join(__dirname, 'data.json');
    const jsonData = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(jsonData);

    for (const questionnaireData of data) {
      const { title,image,questionnaireName, questionPages,resultPage } = questionnaireData;

      const questionnaire = await prisma.questionnaire.create({
        data: {
          title,
          image,
          questionnaireName,
          questionPages: {
            create: questionPages,
          },
          resultPage
        },
        include: { questionPages: true },
      });

      console.log(`Questionnaire "${questionnaire.title}" created with ID: ${questionnaire.id}`);
    }

    console.log('Database initialization completed.');
  } catch (error) {
    console.error('Error initializing the database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

initializeDatabase();

// execute with : node initializeDatabase.js
