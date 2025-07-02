import { BaseApiService } from "./common/BaseService"
import { OperationResult } from "urql"
import {
  Category,
  PaginatorInfo,
  Product,
  ProductPaginator,
} from "../gql/graphql"

export default class ProductApi extends BaseApiService {
  // #region QUERIES
  public GetProducts = (
    page: number,
    count: number,
    orderType = "CREATED_AT",
    order: "ASC" | "DESC",
    whereQuery = ""
  ) => {
    const requestData = `
      query GetProducts(
        $page: Int!,
        $count: Int!
      ){
        GetProducts(
          first: $count,
          page: $page,
          orderBy: {
            column: ${orderType ? orderType : "CREATED_AT"},
            order: ${order}
          }
          ${whereQuery ? `where: ${whereQuery}` : ""}
        ) {
          paginatorInfo {
            total
            perPage
            lastPage
            lastItem
            hasMorePages
            firstItem
            currentPage
            count
          }
          data { 
            id
            businessId
            sku
            name
            description
            type 
            price
            currency
            taxCode   
            physical {
              dimensions {
                length
                width
                height
              }
              inventory {
                stock
                lowStockThreshold
                isBackorderAllowed
              }
              shippingClass
              weight
            } 
            variants {
              id
              sku 
              priceAdjustment
              inventory
            } 
            images {
              url
              altText
              isPrimary
            }
            event {
              eventDetails {
                startDate
                endDate
                venueName
                onlineUrl
                capacity
                registeredCount
                waitlistEnabled 
              }
            }
          }
        }
      }
    `
    const response: Promise<
      OperationResult<{
        GetProducts: ProductPaginator
      }>
    > = this.query(requestData, {
      page,
      count,
    })

    return response
  }

  public GetProduct = (uuid: string) => {
    const requestData = `
      query GetProduct($uuid: String!) {
        GetProduct(uuid: $uuid) {
        uuid
        id
        businessId
        business {
          id
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
    `
    const response: Promise<
      OperationResult<{
        GetProduct: Product
      }>
    > = this.query(requestData, {
      uuid,
    })

    return response
  }

  public GetSingleProduct = (where: Record<string, any>) => {
    const requestData = `
    query GetSingleProduct($where: QueryGetSingleProductWhereWhereConditions) {
      GetSingleProduct(where: $where) {
        id
        businessId
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
          dimensions {
            length
            width
            height
          }
          inventory {
            stock
            lowStockThreshold
            isBackorderAllowed
          }
          shippingClass
          weight
        } 
        subscription {
          billing {
            interval
            trialDays
            gracePeriod
          }
          features
          renewal {
            price
            autoRenew
          }
        }
        event {
          eventType
          eventDetails { 
            startDate
            endDate
            venueName
            onlineUrl
            capacity
            registeredCount
            waitlistEnabled
            location {
              address
              city
              state
              country
              postalCode
              coordinates {
                lat
                lng
              }
            }
          }
        }
        variants {
          id
          sku
          attributes
          priceAdjustment
          inventory
        }
        images {
          url
          altText
          isPrimary
        }  
      }
    }
  `

    const response: Promise<
      OperationResult<{
        GetSingleProduct: Product
      }>
    > = this.query(requestData, { where })

    return response
  }

  public GetCategories = (
    first: number,
    page: number,
    orderBy: { column: "NAME"; order: "ASC" | "DESC" }[]
  ) => {
    const requestData = `
    query GetCategories(
      $first: Int!
      $page: Int
      $orderBy: [QueryGetCategoriesOrderByOrderByClause!]
    ) {
      GetCategories(orderBy: $orderBy, first: $first, page: $page) {
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
          name
          description
          parentId
        }
      }
    }
  `

    const response: Promise<
      OperationResult<{
        GetCategories: {
          paginatorInfo: PaginatorInfo
          data: Category[]
        }
      }>
    > = this.query(requestData, { orderBy, first, page })

    return response
  }
  // #endregion QUERIES
}
