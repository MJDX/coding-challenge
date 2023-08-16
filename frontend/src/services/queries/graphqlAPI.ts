import { apolloClient } from '../graphql';
import { gql } from 'graphql-tag';

export async function GetQuestionnaireByQuestionnaireName(questionnaireName: String)
    : Promise<any> {
    const response = await apolloClient.query({
        query: gql`
      query GetQuestionnaireByQuestionnaireName($questionnaireName: String!) {
        questionnaireByQuestionnaireName(questionnaireName: $questionnaireName) {
        id
        title
        questionPages {
            id
            title
            pageName
            pageType
            content
            answer {
            id
            value
            }
        },
        resultPage
    }
  }
    `,
        variables: {
            questionnaireName: questionnaireName,
        },
    });

    return response.data;
}

export async function AddAnswer(addAnswerInput: any)
    : Promise<any> {
    const response = await apolloClient.mutate({
        mutation: gql`
        mutation AddAnswer($addAnswerInput: AddAnswerInput!) {
          addAnswer(addAnswerInput: $addAnswerInput) {
              id
              value
          }
      }
      `,
        variables: {
            addAnswerInput: addAnswerInput,
        },
    });

    return response.data;
}

export async function EditAnswer(id: number, editAnswerInput: any)
    : Promise<any> {
    const response = await apolloClient.mutate({
        mutation: gql`
        mutation EditAnswer($id: Int!, $editAnswerInput: EditAnswerInput!) {
            editAnswer(id: $id, editAnswerInput: $editAnswerInput) {
            id
            value
            questionPage {
                id
            }
            }
        }
      `,
        variables: {
            id: id,
            editAnswerInput: editAnswerInput,
        },
    });

    return response.data;
}

export async function DeleteAnswer(id: number)
    : Promise<any> {
    const response = await apolloClient.mutate({
        mutation: gql`
        mutation DeleteAnswer($id: Int!) {
            deleteAnswer(id: $id) {
                id
                value
            }
        }
    `,
        variables: {
            id: id,
        },
    });

    return response.data;
}

export async function DeleteAnswersByQuestionnaireId(questionnaireId: number)
    : Promise<any> {
    const response = await apolloClient.mutate({
        mutation: gql`
        mutation deleteAnswersByQuestionnaireId($questionnaireId: Int!) {
            deleteAnswersByQuestionnaireId(questionnaireId: $questionnaireId)
        }
    `,
        variables: {
            questionnaireId: questionnaireId,
        },
    });

    return response.data;
}