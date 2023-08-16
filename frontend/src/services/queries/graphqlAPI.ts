import { apolloClient } from '../graphql';
import { gql } from 'graphql-tag';


export const GET_QUESTIONNAIRES = gql`
  query GetQuestionnaires {
    questionnaires {
      id
      title
      image
      questionnaireName
    }
  }
`;

export const GET_QUESTIONNAIRE_USER_SESSIONS_BY_USER = gql`
  query GetQuestionnaireUserSessionsByUser($questionnaireId: Int!, $userId: Int!) {
    questionnaireUserSessions(questionnaireId: $questionnaireId, userId: $userId) {
      id
      title
      userId
      sharable
      questionnaire {
        id
        title
      }
    }
  }
`;

export const GET_SHARABLE_QUESTIONNAIRE_USER_SESSIONS = gql`
  query GetSharableQuestionnaireUserSessions($questionnaireId: Int!) {
    sharableQuestionnaireUserSessions(questionnaireId: $questionnaireId) {
      id
      title
      userId
      sharable
      questionnaire {
        id
        title
      }
    }
  }
`;

export const GET_SHARABLE_QUESTIONNAIRE_USER_SESSIONS_WITHOUT_OWNED = gql`
  query GetSharableQuestionnaireUserSessionsWithoutOwned(
    $questionnaireId: Int!
    $userId: Int!
  ) {
    sharableQuestionnaireUserSessionsWithoutOwned(
      questionnaireId: $questionnaireId
      userId: $userId
    ) {
      id
      title
      userId
      sharable
      questionnaire {
        id
        title
      }
    }
  }
`;

export const GET_FULL_QUESTIONNAIRE_USER_SESSION = gql`
  query GetFullQuestionnaireUserSession($questionnaireUserSessionId: Int!) {
    getFullQuestionnaireUserSession(questionnaireUserSessionId: $questionnaireUserSessionId) {
      id
      title
      userId
      sharable
      user {
        id
        username
        email
      }
      questionnaire {
        id
        title
        questionnaireName
        questionPages {
          id
          title
          pageName
          pageType
          content
        }
        resultPage
      }
      questionnaireUserSessionAnswers {
        id
        questionnaireUserSessionId
        questionPageId
        value
      }
    }
  }
`;


export const REFRESH_TOKEN = gql`
  mutation RefreshToken($refreshToken: String!) {
    refreshToken(refreshToken: $refreshToken) {
      accessToken
    }
  }
`;


export const REGISTER_USER = gql`
  mutation RegisterUser($username: String!, $email: String!, $password: String!) {
    registerUser(username: $username, email: $email, password: $password) {
      id
      username
      email
      accessToken
      refreshToken
    }
  }
`;


export const CONNECT_USER = gql`
  mutation ConnectUser($username: String!, $password: String!) {
    connectUser(username: $username, password: $password) {
      id
      username
      email
      accessToken
      refreshToken
    }
  }
`;


export const CREATE_QUESTIONNAIRE_USER_SESSION = gql`
  mutation CreateQuestionnaireUserSession(
    $userId: Int!
    $title: String!
    $questionnaireId: Int!
  ) {
    createQuestionnaireUserSession(
      userId: $userId
      title: $title
      questionnaireId: $questionnaireId
    ) {
      id
      title
      userId
      sharable
      # Include other fields you need
    }
  }
`;

export const ADD_OR_UPDATE_ANSWER = gql`
  mutation AddOrUpdateAnswer(
    $id: Int
    $questionnaireUserSessionId: Int!
    $questionPageId: Int!
    $value: String!
  ) {
    addOrUpdateAnswer(
      id: $id
      questionnaireUserSessionId: $questionnaireUserSessionId
      questionPageId: $questionPageId
      value: $value
    ) {
      id
      questionnaireUserSessionId
      questionPageId
      value
    }
  }
`;


export const SET_SESSION_SHARABLE = gql`
  mutation SetSessionSharable(
    $questionnaireUserSessionId: Int!
    $sharable: Boolean!
  ) {
    setSessionSharable(
      questionnaireUserSessionId: $questionnaireUserSessionId
      sharable: $sharable
    ) {
      id
      title
      userId
      sharable
      # Include other fields you need
    }
  }
`;

export const REMOVE_ANSWER = gql`
  mutation RemoveQuestionnaireUserSessionAnswer($id: Int!) {
    removeQuestionnaireUserSessionAnswer(id: $id) {
      id
      questionnaireUserSessionId
      questionPageId
      value
      # Include other fields you need
    }
  }
`;


export const REMOVE_ANSWERS_BY_SESSION_ID = gql`
  mutation RemoveQuestionnaireUserSessionAnswersBySessionId($sessionId: Int!) {
    removeQuestionnaireUserSessionAnswersBySessionId(sessionId: $sessionId) {
      count
    }
  }
`;


// export async function GetQuestionnaireByQuestionnaireName(questionnaireName: String)
//     : Promise<any> {
//     const response = await apolloClient.query({
//         query: gql`
//       query GetQuestionnaireByQuestionnaireName($questionnaireName: String!) {
//         questionnaireByQuestionnaireName(questionnaireName: $questionnaireName) {
//         id
//         title
//         questionPages {
//             id
//             title
//             pageName
//             pageType
//             content
//             answer {
//             id
//             value
//             }
//         },
//         resultPage
//     }
//   }
//     `,
//         variables: {
//             questionnaireName: questionnaireName,
//         },
//     });

//     return response.data;
// }

// export async function AddAnswer(addAnswerInput: any)
//     : Promise<any> {
//     const response = await apolloClient.mutate({
//         mutation: gql`
//         mutation AddAnswer($addAnswerInput: AddAnswerInput!) {
//           addAnswer(addAnswerInput: $addAnswerInput) {
//               id
//               value
//           }
//       }
//       `,
//         variables: {
//             addAnswerInput: addAnswerInput,
//         },
//     });

//     return response.data;
// }

// export async function EditAnswer(id: number, editAnswerInput: any)
//     : Promise<any> {
//     const response = await apolloClient.mutate({
//         mutation: gql`
//         mutation EditAnswer($id: Int!, $editAnswerInput: EditAnswerInput!) {
//             editAnswer(id: $id, editAnswerInput: $editAnswerInput) {
//             id
//             value
//             questionPage {
//                 id
//             }
//             }
//         }
//       `,
//         variables: {
//             id: id,
//             editAnswerInput: editAnswerInput,
//         },
//     });

//     return response.data;
// }

// export async function DeleteAnswer(id: number)
//     : Promise<any> {
//     const response = await apolloClient.mutate({
//         mutation: gql`
//         mutation DeleteAnswer($id: Int!) {
//             deleteAnswer(id: $id) {
//                 id
//                 value
//             }
//         }
//     `,
//         variables: {
//             id: id,
//         },
//     });

//     return response.data;
// }

// export async function DeleteAnswersByQuestionnaireId(questionnaireId: number)
//     : Promise<any> {
//     const response = await apolloClient.mutate({
//         mutation: gql`
//         mutation deleteAnswersByQuestionnaireId($questionnaireId: Int!) {
//             deleteAnswersByQuestionnaireId(questionnaireId: $questionnaireId)
//         }
//     `,
//         variables: {
//             questionnaireId: questionnaireId,
//         },
//     });

//     return response.data;
// }