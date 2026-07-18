import { gql } from "@apollo/client"

export const LIST_TRANSACTIONS = gql`
query ListTransactions($filters: TransactionFiltersInput, $limit: Int, $page: Int) {
  listTransactions(filters: $filters, limit: $limit, page: $page) {
    data {
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
    total
  }
}
`