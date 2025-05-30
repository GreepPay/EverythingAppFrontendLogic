import { BaseApiService } from "./common/BaseService"
import { OperationResult } from "urql"
import {
  Category,
  PaginatorInfo,
  Product,
  ProductPaginator,
  QueryGetProductsOrderByOrderByClause,
  QueryGetProductsWhereWhereConditions,
} from "../gql/graphql"

export default class ProductApi extends BaseApiService {
  // #region QUERIES
  public GetProducts = (
    first: number,
    page: number,
    orderBy?: QueryGetProductsOrderByOrderByClause[],
    where?: QueryGetProductsWhereWhereConditions
  ) => {
    const requestData = `
    query GetProducts($first: Int!, $page: Int, $orderBy: [QueryGetProductsOrderByOrderByClause!], $where: QueryGetProductsWhereWhereConditions) {
      GetProducts(first: $first, page: $page, orderBy: $orderBy, where: $where) {
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
            # Add relevant fields if needed
          }
          digital {
            # Add relevant fields if needed
          }
          subscription {
            # Add relevant fields if needed
          }
          event {
            # Add relevant fields if needed
          }
          variants {
            # Add relevant fields if needed
          }
          images {
            # Add relevant fields if needed
          }
        }
      }
    }
  `

    const response: Promise<
      OperationResult<{
        GetProducts: ProductPaginator
      }>
    > = this.query(requestData, { first, page, orderBy, where })

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
        status
        price
        currency
        taxCode
        categoryIds
        tags
        createdAt
        updatedAt
        physical {
          weight
          dimensions {
            length
            width
            height
          }
          shippingClass
          inventory {
            quantity
            isAvailable
          }
        }
        digital {
          // Add fields here if any exist for your use case
        }
        subscription {
          billing {
            interval
            trialDays
            gracePeriod
          }
          features
          renewal {
            // Add renewal fields if needed
          }
        }
        event {
          eventType
          eventDetails {
            startDate
            endDate
            venueName
            onlineUrl
            location {
              latitude
              longitude
              address
              // Add more if necessary
            }
            capacity
            registeredCount
            waitlistEnabled
          }
        }
        variants {
          id
          name
          price
          sku
          // Add more fields if needed
        }
        images {
          url
          alt
          // Add more if needed
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
    orderBy: { column: "NAME"; order: "ASC" | "DESC" }[],
    first: number,
    page?: number
  ) => {
    const requestData = `
    query GetCategories(
      $orderBy: [QueryGetCategoriesOrderByOrderByClause!]
      $first: Int!
      $page: Int
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
          createdAt
          updatedAt
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
