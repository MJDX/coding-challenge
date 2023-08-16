const typeDefs = `#graphql
  scalar JSON
  
  type User {
    id: Int
    username: String
    email: String
    questionnaireSessions: [QuestionnaireUserSession]
  }

  type Questionnaire {
    id: Int
    title: String
    questionnaireName: String
    questionPages: [QuestionPage]
    questionnaireSessions: [QuestionnaireUserSession]
    resultPage: JSON
  }

  type QuestionPage {
    id: Int
    title: String
    pageName: String
    pageType: String
    content: JSON
  }

  type QuestionnaireUserSession {
    id: Int
    title: String
    userId: Int
    sharable: Boolean
    user: User
    questionnaire: Questionnaire
    questionnaireUserSessionAnswers: [QuestionnaireUserSessionAnswer]
  }

  type QuestionnaireUserSessionAnswer {
    id: Int
    questionnaireUserSessionId: Int
    questionnaireUserSession: QuestionnaireUserSession
    questionPage: QuestionPage
    value: String
  }

  type Query {
    questionnaires: [Questionnaire]
    questionnaireUserSessions(questionnaireId: Int, userId: Int): [QuestionnaireUserSession]
    sharableQuestionnaireUserSessions(questionnaireId: Int): [QuestionnaireUserSession]
  }

  type Mutation {
    refreshToken(refreshToken: String!): RefreshTokenResponse
    registerUser(username: String, email: String, password: String): User
    connectUser(username: String, password: String): User
    createQuestionnaireUserSession(userId: Int, title: String): QuestionnaireUserSession
    addOrUpdateAnswer(sessionId: Int, questionPageId: Int, value: String): QuestionnaireUserSessionAnswer
    setSessionSharable(sessionId: Int, sharable: Boolean): QuestionnaireUserSession
  }
  
  type RefreshTokenResponse {
    accessToken: String
  }
`;

export default typeDefs;
