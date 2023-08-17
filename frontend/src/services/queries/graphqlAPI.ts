import { apolloClient } from '../graphql';
import { gql } from 'graphql-tag';



export const GET_QUESTIONNAIRES = async () => {
    try {
        const response = await apolloClient.query({
            query: gql`
          query GetQuestionnaires {
            questionnaires {
              id
              title
              image
              questionnaireName
            }
          }
        `,
        });

        return response.data.questionnaires;
    } catch (error) {
        console.error("Error fetching questionnaires:");
        console.error(JSON.stringify(error, null, 2));
        throw error;
    }
};

export const GET_QUESTIONNAIRE_USER_SESSIONS_BY_USER = async (questionnaireId: number, userId: number) => {
    try {
      console.log("here");
      
        const response = await apolloClient.query({
            query: gql`
        query GetQuestionnaireUserSessionsByUser($questionnaireId: Int!, $userId: Int!) {
          questionnaireUserSessionsByUser(questionnaireId: $questionnaireId, userId: $userId) {
            id
            title
            user{
              id
              username
              email
            }
            sharable
            questionnaire {
              id
              title
              image
            }
          }
        }
      `,
            variables: { questionnaireId, userId },
        });
        console.log("then here");
        console.log(response);
        
        return response.data.questionnaireUserSessionsByUser
        ;
    } catch (error) {
        console.error("Error fetching questionnaire user sessions:");
        console.error(JSON.stringify(error, null, 2));
        throw error;
    }
};

export const GET_SHARABLE_QUESTIONNAIRE_USER_SESSIONS = async (questionnaireId: number) => {
    try {
        const response = await apolloClient.query({
            query: gql`
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
        `,
            variables: { questionnaireId },
        });

        return response.data.sharableQuestionnaireUserSessions;
    } catch (error) {
        console.error("Error fetching sharable questionnaire user sessions:");
        console.error(JSON.stringify(error, null, 2));
        throw error;
    }
};


export const GET_SHARABLE_QUESTIONNAIRE_USER_SESSIONS_WITHOUT_OWNED = async (questionnaireId: number, userId: number) => {
    try {
        const response = await apolloClient.query({
            query: gql`
          query GetSharableQuestionnaireUserSessionsWithoutOwned(
            $questionnaireId: Int!
            $userId: Int!
          ) {
            sharableQuestionnaireUserSessionsWithoutUserOwnedOnes(
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
        `,
            variables: { questionnaireId, userId },
        });

        return response.data.sharableQuestionnaireUserSessionsWithoutOwned;
    } catch (error) {
        console.error("Error fetching sharable questionnaire user sessions without owned:");
        console.error(JSON.stringify(error, null, 2));
        throw error;
    }
};

export const GET_FULL_QUESTIONNAIRE_USER_SESSION = async (questionnaireUserSessionId: number) => {
    try {
        const response = await apolloClient.query({
            query: gql`
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
                image
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
                questionPage {
                  id
                  pageName
                  pageType
                  title
                }
                questionPageId
                value
              }
            }
          }
        `,
            variables: { questionnaireUserSessionId },
        });

        return response.data.getFullQuestionnaireUserSession;
    } catch (error) {
        console.error("Error fetching full questionnaire user session:");
        console.error(JSON.stringify(error, null, 2));
        throw error;
    }
};


export const REFRESH_TOKEN = async (refreshToken: string) => {
    try {
        const response = await apolloClient.mutate({
            mutation: gql`
          mutation RefreshToken($refreshToken: String!) {
            refreshToken(refreshToken: $refreshToken) {
              accessToken
            }
          }
        `,
            variables: { refreshToken },
        });

        return response.data.refreshToken.accessToken;
    } catch (error) {
        console.error("Error refreshing token:");
        console.error(JSON.stringify(error, null, 2));
        throw error;
    }
};


export const REGISTER_USER = async (username: string, email: string, password: string) => {
    try {
        const response = await apolloClient.mutate({
            mutation: gql`
          mutation RegisterUser($username: String!, $email: String!, $password: String!) {
            registerUser(username: $username, email: $email, password: $password) {
              id
              username
              email
              accessToken
              refreshToken
            }
          }
        `,
            variables: { username, email, password },
        });

        return response.data.registerUser;
    } catch (error) {
        console.error("Error registering user:");
        console.error(JSON.stringify(error, null, 2));
        throw error;
    }
};


export const CONNECT_USER = async (username: string, password: string) => {
    try {
        const response = await apolloClient.mutate({
            mutation: gql`
          mutation ConnectUser($username: String!, $password: String!) {
            connectUser(username: $username, password: $password) {
              id
              username
              email
              accessToken
              refreshToken
            }
          }
        `,
            variables: { username, password },
        });
        
        return response.data.connectUser;
    } catch (error) {
        console.error("Error connecting user:");
        console.error(JSON.stringify(error, null, 2));
        throw error;
    }
};


export const CREATE_QUESTIONNAIRE_USER_SESSION = async (userId: number, title: string, questionnaireId: number) => {
    try {
        const response = await apolloClient.mutate({
            mutation: gql`
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
            }
          }
        `,
            variables: { userId, title, questionnaireId },
        });

        return response.data.createQuestionnaireUserSession;
    } catch (error) {
        console.error("Error creating questionnaire user session:");
        console.error(JSON.stringify(error, null, 2));
        throw error;
    }
};

export const ADD_OR_UPDATE_ANSWER = async (id: number | undefined, questionnaireUserSessionId: number, questionPageId: number, value: string) => {
    try {
        const response = await apolloClient.mutate({
            mutation: gql`
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
        `,
            variables: { id, questionnaireUserSessionId, questionPageId, value },
        });

        return response.data.addOrUpdateAnswer;
    } catch (error) {
        console.error("Error adding or updating answer:");
        console.error(JSON.stringify(error, null, 2));
        throw error;
    }
};

export const SET_SESSION_SHARABLE = async (questionnaireUserSessionId: number, sharable: boolean) => {
    try {
        const response = await apolloClient.mutate({
            mutation: gql`
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
            }
          }
        `,
            variables: { questionnaireUserSessionId, sharable },
        });

        return response.data.setSessionSharable;
    } catch (error) {
        console.error("Error setting session sharable:");
        console.error(JSON.stringify(error, null, 2));
        throw error;
    }
};

export const REMOVE_ANSWER = async (id: number) => {
    try {
        const response = await apolloClient.mutate({
            mutation: gql`
          mutation RemoveQuestionnaireUserSessionAnswer($id: Int!) {
            removeQuestionnaireUserSessionAnswer(id: $id) {
              id
              questionnaireUserSessionId
              questionPageId
              value
            }
          }
        `,
            variables: { id },
        });

        return response.data.removeQuestionnaireUserSessionAnswer;
    } catch (error) {
        console.error("Error removing answer:");
        console.error(JSON.stringify(error, null, 2));
        throw error;
    }
};


export const REMOVE_ANSWERS_BY_SESSION_ID = async (sessionId: number) => {
    try {
        const response = await apolloClient.mutate({
            mutation: gql`
          mutation RemoveQuestionnaireUserSessionAnswersBySessionId($sessionId: Int!) {
            removeQuestionnaireUserSessionAnswersBySessionId(sessionId: $sessionId) {
              count
            }
          }
        `,
            variables: { sessionId },
        });

        return response.data.removeQuestionnaireUserSessionAnswersBySessionId.count;
    } catch (error) {
        console.error("Error removing answers by session ID:");
        console.error(JSON.stringify(error, null, 2));
        throw error;
    }
};

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