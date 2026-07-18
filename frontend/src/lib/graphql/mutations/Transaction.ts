import { gql } from "@apollo/client"

export const CREATE_TRANSACTION = gql`
mutation CreateTransaction($data: CreateTransactionInput!) {
  createTransaction(data: $data) {
    id
    transactionType
    description
    transactionDate
    transactionValue
    userId
    categoryId
    user {
      id
      name
    }
    category {
      id
      title
      description
      icon
      color
    }
    createdAt
    updatedAt
  }
}
`

export const UPDATE_TRANSACTION = gql`
mutation UpdateTransaction($data: UpdateTransactionInput!, $updateTransactionId: String!) {
  updateTransaction(data: $data, id: $updateTransactionId) {
    id
    transactionType
    description
    transactionDate
    transactionValue
    userId
    categoryId
    user {
      id
      name
      email
    }
    category {
      id
      title
      description
      icon
      color
    }
    createdAt
    updatedAt
  }
}
`


export const DELETE_TRANSACTION = gql`
mutation DeleteTransaction($deleteTransactionId: String!) {
  deleteTransaction(id: $deleteTransactionId)
}
`