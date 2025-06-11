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
            name
            price
            type
            description 
            variants {
              id
              attributes
              priceAdjustment
            }
            images {
              url
            }
            event {
              eventType
              eventDetails {
                startDate
                endDate
              }
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
