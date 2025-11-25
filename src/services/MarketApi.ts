import { BaseApiService } from "./common/BaseService"
import { OperationResult } from "urql"
import {
  BusinessPaginator,
  Business,
  CommerceSection,
  CreateOrderInput,
  Order,
  BusinessFollowers,
} from "../gql/graphql"

export default class MarketApi extends BaseApiService {
  // #region MUTATIONS
  public FollowBusiness = (business_uuid: string) => {
    const requestData = `
    mutation FollowBusiness($business_uuid: String!) {
      FollowBusiness(business_uuid: $business_uuid) { 
        id
        uuid  
      }
    }
  `
    return this.mutation(requestData, { business_uuid }) as Promise<
      OperationResult<{ FollowBusiness: BusinessFollowers }>
    >
  }

  public UnfollowBusiness = (business_uuid: string) => {
    const requestData = `
    mutation UnfollowBusiness($business_uuid: String!) {
      UnfollowBusiness(business_uuid: $business_uuid)
    }
  `
    return this.mutation(requestData, { business_uuid }) as Promise<
      OperationResult<{ UnfollowBusiness: any }>
    >
  }

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

  public GetMarketShops = (
    page: number,
    count: number,
    orderType = "CREATED_AT",
    order: "ASC" | "DESC" = "DESC",
    whereQuery = ""
  ) => {
    const requestData = `
    query MarketShops(
      $page: Int!
      $count: Int!
    ) {
      MarketShops(
        first: $count,
        page: $page
        orderBy: {
          column: ${orderType ? orderType : "CREATED_AT"},
          order: ${order}
        }
        ${whereQuery ? `where: ${whereQuery}` : ""}
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
          category
          default_currency
          website 
          user {
            id
            uuid
            first_name
            last_name
            email
            phone
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
          category
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

  public GetSingleBusiness = (uuid: string) => {
    const requestData = `
        query GetSingleBusiness($uuid: String!) {
          GetSingleBusiness(uuid: $uuid) {
            id
            uuid
            business_name
            auth_user_id
            logo
            banner
            description
            category
            default_currency
            user {
              id
              uuid
              first_name
              last_name
              username
              email
              phone
              email_verified_at
              phone_verified_at
              status 
              created_at
              updated_at
            } 
            website   
            customers
            business_type
            is_customer
          }
        }
      `
    const response: Promise<
      OperationResult<{
        GetSingleBusiness: Business
      }>
    > = this.query(requestData, {
      uuid,
    })

    return response
  }

  public GetCommerceSections = (type: string, limit: number) => {
    const requestData = `
      query CommerceSections  ($type: String!, $limit: Int!) {
        CommerceSections(type: $type, limit: $limit) {
          label
          type
          variant
          categories
          businesses {
            id
            uuid
            business_name
            logo
            banner
            description
            category
            default_currency
            website 
            user {
              id
              uuid
              first_name
              last_name
              email
              phone
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
          products {
            uuid
            id
            businessId
            business {
              id
              uuid
              business_name
              auth_user_id
              logo
              banner
              description
            }
            sku
            name
            slug
            description
            price
            currency
            taxCode
            type
            status
            variants
            inventoryCount
            stockThreshold
            isBackorderAllowed
            downloadUrl
            downloadLimit
            license
            fileInfo
            dimensions
            weight
            billingInterval
            trialPeriodDays
            gracePeriod
            renewal
            national_cuisine
            national_cuisine_country
            features
            eventType
            eventStartDate
            eventEndDate
            venueName
            eventOnlineUrl
            eventLocation
            eventCapacity
            eventRegisteredCount
            eventWaitlistEnabled
            metaTitle
            metaDescription
            isVisible
            images
            createdAt
            updatedAt
          }
        } 
      }
    `

    const response: Promise<
      OperationResult<{ CommerceSections: CommerceSection }>
    > = this.query(requestData, {
      type,
      limit,
    })

    return response
  }

  // #endregion QUERIES
}
