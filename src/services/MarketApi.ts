import { BaseApiService } from "./common/BaseService"
import { OperationResult } from "urql"
import { BusinessPaginator } from "../gql/graphql"

export default class MarketApi extends BaseApiService {
  // #region QUERIES
  public GetMarkets = (first: number, page: number) => {
    const requestData = `
    query GetMarkets($first: Int!, $page: Int!) {
      GetMarkets(first: $first, page: $page) {
        paginatorInfo {
          firstItem
          lastItem
          currentPage
          lastPage
          perPage
          total
          hasMorePages
        }
        data {
          id
          business_name
          logo
          banner
          description
          website
          products {
            id
            sku
            name
            description
            type
            status
            price
            currency
            taxCode
            categoryIds
            tags
            createdAt
            updatedAt
            physical {
              // Include relevant fields if needed
            }
            digital {
              // Include relevant fields if needed
            }
            subscription {
              // Include relevant fields if needed
            }
            event {
              // Include relevant fields if needed
            }
            variants {
              id
              name
              price
              sku
              // Add more fields if necessary
            }
            images {
              url
              alt
              // Add more fields if necessary
            }
          }
        }
      }
    }
  `

    const response: Promise<
      OperationResult<{
        GetMarkets: BusinessPaginator
      }>
    > = this.query(requestData, { first, page })

    return response
  }
  // #endregion QUERIES
}
