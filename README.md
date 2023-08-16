
# Digital Product Selector Coding Challenge

A questionnaire-based product recommender

## Features
-   Questionnaire with multiple pages
-   Different input types supported dynamically
-   Tree-structure navigation
-   JSON configuration of questionnaire

## Stack
- Frontend : Vite + Vue3 + Typescript + Tailwindcss
- Backend : Apollo Server + Node + Express + Prisma + Postgresql + Graphql

# Installation
## Project
- clone repository:
```
git clone https://github.com/MJDX/coding-challenge.git
```
## Docker Compose for Postgresql
- make sure docker compose is installed ( you can install Docker Desktop which includes docker, CLI & docker compose [here](https://www.docker.com/products/docker-desktop/))
- at the root of the project (where docker-compose.yml exists) execute the following command to start the Postgresql container, then you can use pgAdmin to browse the database:
```
docker-compose up
```
## Backend
- navigate to /backend folder
```
cd backend
```
- install dependencies :
```
npm i
```
- generate prisma schema :
```
npx prisma generate --schema=./src/prisma/schema.prisma
```
- migrate prisma schema to database : 
```
npx prisma migrate dev --name init --schema=./src/prisma/schema.prisma
```
- initialize data with the initializeDatabase.js + data.json helper files :
```
node ./src/prisma/initializer/initializeDatabase.js
```
- database connection configuration can be done at "src\prisma\schema.prisma" file :
```
datasource db {
  provider = "postgresql"
  url      = "postgresql://foxbase:foxbaseRoot@localhost:5432/foxbase"
}
```


- and finally run the backend server :
```
npm run dev
```
- appolo sandbox should be accessible at localhost:4000
- full data structure in a json format is in the data.json file located at : "src\prisma\initializer\data.json"

## Frontend
- navigate to /frontend folder
```
cd frontend
```
- install dependencies :
```
npm i
```
- start the front end server with :
```
npm run dev
```
- frontend should be accessible at localhost:5173
- the backend url is configurable in the graphql.ts file located at "src\services\graphql.ts":
```
const httpLink = createHttpLink({
  uri: 'http://localhost:4000',
  fetch,
});
```

## Recommendation Logic
- the recommendation logic is based on a recommendation matrix, where each column of the matrix is linked to the product to be recommended where each cell of this column is mapped to each response of each question, the value of the cell signifies depending on the answer selected by the user : if the user selects this answer and the cell has **(1)** as the value it means the product can be recommended , but if the cell has **(0)** it means the product can't be recommended due to the fact the user selected this answer
- this logic is translated into the following json structure, an extract column from the matrix implemented in data.json file for the product named "Paint bucket 15L white" :
```
{
    "label": "Paint bucket 15L white",
    "value": "PaintBucket15LWhite",
    "image": "",
    "recommendationMatrixColumn": [
        {
            "pageName": "applicationScopePage",
            "answers": [
                "Outdoor",
                "Indoor"
            ]
        },
        {
            "pageName": "surfaceType",
            "answers": [
                "Wood",
                "Mat",
                "Facade",
                "Plaster"
            ]
        },
        {
            "pageName": "opacity",
            "answers": [
                "Yes",
                "No"
            ]
        },
        {
            "pageName": "opacity2",
            "answers": [
                "<95%",
                "95%",
                "98%",
                ">99.5%"
            ]
        },
        {
            "pageName": "undercoat",
            "answers": [
                "Brighter",
                "Darker"
            ]
        },
        {
            "pageName": "hue",
            "answers": [
                "White"
            ]
        }
    ]
}
```
- in recommendationMatrixColumn , each item represents the accepted possible answers for the specific question identified by pageName field, the presence of the possible answer in the "answers" field refers to the value **(1)** that we mentioned earlier,  and the absence is the value **(0)**
