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
  public GetProducts = (first: number, page: number) => {
    const requestData = `
    query GetProducts($first: Int!, $page: Int) {
      GetProducts(first: $first, page: $page) {
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
          businessId
          sku
          name
          description
          type 
          price
          currency
          taxCode   
          event {
            eventType
            eventDetails {
              startDate
              endDate
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
    }
  `

    const response: Promise<
      OperationResult<{
        GetProducts: ProductPaginator
      }>
    > = this.query(requestData, { first, page })

    return response
  }

  public GetSingleProduct = (where: Record<string, any>) => {
  

    const requestData = `
    query GetSingleProduct($where: QueryGetSingleProductWhereWhereConditions) {
      GetSingleProduct(where: $where) {
        id
        sku
        name
        description
        type 
        price
        currency
        taxCode   
        physical {
          weight
          dimensions {
            length
            width
            height
          }
          shippingClass 
        } 
        subscription {
          billing {
            interval
            trialDays
            gracePeriod
          }
          features 
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
