import { gql } from "@apollo/client"

export const LIST_TRANSACTIONS = gql`
query ListTransactions($filters: TransactionFiltersInput, $limit: Int) {
    listTransactions(filters: $filters, limit: $limit) {
      id
      transactionType
      description
      transactionDate
      transactionValue
      userId
      categoryId
      createdAt
      updatedAt
      user {
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
    }
  }
`