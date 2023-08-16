const typeDefs = `#graphql
  scalar JSON
  
  type Questionnaire {
    id: Int!
    title: String
    questionnaireName: String!
    questionPages: [QuestionPage!]!
    resultPage: JSON
  }

  type QuestionPage {
    id: Int!
    title: String
    pageName: String!
    pageType: String!
    content: JSON
    questionnaire: Questionnaire!
    answer: Answer
  } 

  type Answer {
    id: Int!
    value: String!
    questionPage: QuestionPage!
  }

  type Query {
    questionnaire(id: Int!): Questionnaire!
    questionnaireByQuestionnaireName(questionnaireName: String!): Questionnaire!
    questionPagesByQuestionnaireId(questionnaireId: Int!): [QuestionPage!]!
    questionPageById(id: Int!): QuestionPage!
    questionPageByPageName(pageName: String!): QuestionPage!
    answerByQuestionPageId(questionPageId: Int!): Answer
    answerById(id: Int!): Answer
  }

  type Mutation {
    addQuestionnaire(questionnaireName: String!, questionPages: [QuestionPageInput!]!, resultPage : JSON): Questionnaire!
    addAnswer(addAnswerInput: AddAnswerInput!): Answer!
    editAnswer(id: Int!, editAnswerInput: EditAnswerInput): Answer!
    deleteAnswer(id: Int!): Answer!
    deleteAnswersByQuestionnaireId(questionnaireId: Int!): Int
  }
  
  input QuestionPageInput {
    title: String!
    pageName: String!
    content: JSON
  }
  
  input AddAnswerInput {
    value: String!
    questionPageId: Int!
  }
  
  input EditAnswerInput {
    value: String!
    questionPageId: Int!
  }
`;

export default typeDefs;
