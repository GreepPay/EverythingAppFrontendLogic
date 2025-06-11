import { BaseApiService } from "./common/BaseService"
import { OperationResult } from "urql"
import {
  CreateOrderInput,
  Order,
  OrderPaginator,
  QueryGetOrdersOrderByOrderByClause,
  QueryGetOrdersWhereWhereConditions,
} from "../gql/graphql"

export default class OrderApi extends BaseApiService {
  // #region MUTATIONS
  public CreateOrder = (input: CreateOrderInput) => {
    const requestData = `
    mutation CreateOrder($input: CreateOrderInput!) {
      CreateOrder(input: $input) {
        id
        customerId
        saleId
        items {
          productId
          sku
          quantity
          fulfilledQuantity
          price
          taxRate
          taxAmount
          discountAmount
          total
        }
        shippingAddress {
          street
          city
          state
          postalCode
          country
          phone
        }
        billingAddress {
          street
          city
          state
          postalCode
          country
          phone
        }
        status
        statusHistory {
          status
          timestamp
          changedBy
          note
        }
        paymentMethod
        paymentStatus
        paymentDetails {
          transactionId
          provider
          method
          amount
          currency
          status
          timestamp
        }
        refundDetails {
          transactionId
          amount
          reason
          status
          timestamp
        }
        cancellationReason
        refundId
        subtotalAmount
        taxAmount
        discountAmount
        totalAmount
        currency
        appliedDiscounts {
          code
          type
          value
          description
        }
        taxDetails {
          name
          rate
          amount
        }
      }
    }
  `

    const response: Promise<
      OperationResult<{
        CreateOrder: Order
      }>
    > = this.mutation(requestData, { input })

    return response
  }
  // MUTATIONS

  // #region QUERIES
  public GetOrders = (first: number, page: number) => {
    const requestData = `
    query GetOrders($first: Int!, $page: Int) {
      GetOrders(first: $first, page: $page) {
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
          customerId
          saleId
          status
          paymentMethod
          paymentStatus
          cancellationReason
          refundId
          subtotalAmount
          taxAmount
          discountAmount
          totalAmount
          currency 
        }
      }
    }
  `

    const response: Promise<
      OperationResult<{
        GetOrders: OrderPaginator
      }>
    > = this.query(requestData, { first, page })

    return response
  }

  public GetSingleOrder = (id: string) => {
    const requestData = `
    query GetSingleOrder($id: ID!) {
      GetSingleOrder(id: $id) {
        id
        customerId
        saleId
        items {
          productId
          sku
          quantity
          fulfilledQuantity
          price
          taxRate
          taxAmount
          discountAmount
          total
        }
        shippingAddress {
          street
          city
          state
          postalCode
          country
          phone
        }
        billingAddress {
          street
          city
          state
          postalCode
          country
          phone
        }
        status
        statusHistory {
          status
          timestamp
          changedBy
          note
        }
        paymentMethod
        paymentStatus
        paymentDetails {
          transactionId
          provider
          method
          amount
          currency
          status
          timestamp
        }
        refundDetails {
          transactionId
          amount
          reason
          status
          timestamp
        }
        cancellationReason
        refundId
        subtotalAmount
        taxAmount
        discountAmount
        totalAmount
        currency
        appliedDiscounts {
          code
          type
          value
          description
        }
        taxDetails {
          name
          rate
          amount
        }
      }
    }
  `

    const response: Promise<
      OperationResult<{
        GetSingleOrder: Order
      }>
    > = this.query(requestData, { id })

    return response
  }
  // #endregion QUERIES
}
