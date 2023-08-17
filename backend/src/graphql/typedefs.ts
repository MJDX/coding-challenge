const typeDefs = `#graphql
  scalar JSON
  
  type User {
    id: Int
    username: String
    email: String
    questionnaireUserSessions: [QuestionnaireUserSession]
  }

  type Questionnaire {
    id: Int
    title: String
    image: String
    questionnaireName: String
    questionPages: [QuestionPage]
    questionnaireUserSessions: [QuestionnaireUserSession]
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
    questionPageId: Int
    value: String
  }

  type Query {
    questionnaires: [Questionnaire]
    questionnaireUserSessionsByUser(questionnaireId: Int, userId: Int): [QuestionnaireUserSession]
    sharableQuestionnaireUserSessions(questionnaireId: Int): [QuestionnaireUserSession]
    sharableQuestionnaireUserSessionsWithoutUserOwnedOnes(questionnaireId: Int, userId: Int): [QuestionnaireUserSession]
    getFullQuestionnaireUserSession(questionnaireUserSessionId: Int): QuestionnaireUserSession
  }

  type Mutation {
    refreshToken(refreshToken: String!): RefreshTokenResponse
    registerUser(username: String, email: String, password: String): AuthenticationResponse
    connectUser(username: String, password: String): AuthenticationResponse
    createQuestionnaireUserSession(userId: Int,questionnaireId: Int, title: String): QuestionnaireUserSession
    addOrUpdateAnswer(id: Int,questionnaireUserSessionId: Int!, questionPageId: Int!, value: String!): QuestionnaireUserSessionAnswer
    setSessionSharable(questionnaireUserSessionId: Int, sharable: Boolean): QuestionnaireUserSession
    removeQuestionnaireUserSessionAnswer(id: Int!): QuestionnaireUserSessionAnswer
    removeQuestionnaireUserSessionAnswersBySessionId(questionnaireUserSessionId: Int!): Int
  }
  
  type RefreshTokenResponse {
    accessToken: String
  }

  type AuthenticationResponse {
    id: Int
    username: String
    email: String
    accessToken: String
    refreshToken: String
  }

`;

export default typeDefs;
