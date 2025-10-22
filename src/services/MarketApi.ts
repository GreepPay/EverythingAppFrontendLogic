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

  public GetMarketShops = (page: number, count: number) => {
    const requestData = `
    query MarketShops(
      $page: Int!
      $count: Int!
    ) {
      MarketShops(
        first: $count,
        page: $page
      ) {
        paginatorInfo {
          count
          currentPage
          firstItem
          hasMorePages
          lastItem
          lastPage
          perPage
          total
        }
        data {
          id
          uuid
          business_name
          logo
          banner
          description
          default_currency
          user {
            id
            uuid
            first_name
            last_name
            email
            phone
          }
          website
          products {
            id
            uuid
            name
            price
            currency
            images
            description
          }
          eventProducts {
            id
            uuid
            name
            eventStartDate
            eventEndDate
            venueName
            price
            images
          } 
          featuredProduct {
            id
            uuid
            name
            price
            currency
            images
            description
          }
        }
      }
    }
  `

    const response: Promise<
      OperationResult<{
        MarketShops: BusinessPaginator
      }>
    > = this.query(requestData, {
      page,
      count,
    })

    return response
  }

  public GetFeaturedShops = (page: number, count: number) => {
    const requestData = `
    query FeaturedShops(
      $page: Int!
      $count: Int!
    ) {
      FeaturedShops(
        first: $count,
        page: $page
      ) {
        paginatorInfo {
          count
          currentPage
          firstItem
          hasMorePages
          lastItem
          lastPage
          perPage
          total
        }
        data {
          id
          uuid
          business_name
          logo
          banner
          description
          default_currency
          user {
            id
            uuid
            first_name
            last_name
            email
            phone
          }
          website
          products {
            id
            uuid
            name
            price
            currency
            images
            description
          }
          eventProducts {
            id
            uuid
            name
            eventStartDate
            eventEndDate
            venueName
            price
            images
          } 
          featuredProduct {
            id
            uuid
            name
            price
            currency
            images
            description
          }
        }
      }
    }
  `

    const response: Promise<
      OperationResult<{
        FeaturedShops: BusinessPaginator
      }>
    > = this.query(requestData, {
      page,
      count,
    })

    return response
  }

  // #endregion QUERIES
}
