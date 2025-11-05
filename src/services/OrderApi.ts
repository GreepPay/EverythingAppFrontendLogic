import { BaseApiService } from "./common/BaseService"
import { OperationResult } from "urql"
import {
  CreateOrderInput,
  Order,
  OrderPaginator,
  QueryGetOrdersOrderByOrderByClause,
  QueryGetOrdersWhereWhereConditions,
} from "../gql/graphql"

// This should match the CreateDeliveryOrderInput from the GraphQL schema
export interface CreateDeliveryOrderInput {
  itemDescription: string
  weight?: string
  scheduledDate?: string
  scheduledTime?: string
  pickupAddress: string
  deliveryAddress: string
  note?: string
  deliveryPrice: number
  urgency?: string
  estimatedDeliveryDate?: string
  paymentMethod?: string
  phone?: string
  conversationId?: string // Add conversation ID field
}

export default class OrderApi extends BaseApiService {
  // #region MUTATIONS
  public CreateOrder = (input: CreateOrderInput) => {
    const requestData = `
    mutation CreateOrder($input: CreateOrderInput!) {
      CreateOrder(input: $input) { 
        id
        status
        paymentStatus 
      }
    }
  `

    const response: Promise<OperationResult<{ CreateOrder: Order }>> =
      this.mutation(requestData, { input })

    return response
  }

  public CreateDeliveryOrder = (input: CreateDeliveryOrderInput) => {
    const requestData = `
    mutation CreateDeliveryOrder($input: CreateDeliveryOrderInput!) {
      CreateDeliveryOrder(input: $input) { 
        id
        uuid
        trackingNumber
        status
        estimatedDeliveryDate
        actualDeliveryDate
        deliveryAddress
        order {
          id
          uuid
          orderNumber
          status
          paymentStatus
          totalAmount
          currency
          paymentMethod
        }
        createdAt
        updatedAt
      }
    }
  `

    const response: Promise<OperationResult<{ CreateDeliveryOrder: any }>> =
      this.mutation(requestData, { input })

    return response
  }

  public UpdateDeliveryStatus = (deliveryId: string, status: string) => {
    const requestData = `
    mutation UpdateDeliveryStatus($input: UpdateDeliveryStatusInput!) {
      UpdateDeliveryStatus(input: $input)
    }
  `

    // Convert deliveryId to integer since GraphQL schema expects Int
    const deliveryIdInt = parseInt(deliveryId, 10)

    const response: Promise<
      OperationResult<{ UpdateDeliveryStatus: boolean }>
    > = this.mutation(requestData, {
      input: { deliveryId: deliveryIdInt, status },
    })

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
          uuid
          orderNumber
          customerId 
          status
          paymentMethod
          paymentStatus  
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

  public GetOrder = (uuid: string) => {
    const requestData = `
    query GetOrder($uuid: String!) {
      GetOrder(uuid: $uuid) {
        id
        uuid
        orderNumber
        customerId
        user {
          id
          uuid
          username
        } 
        items
        subtotalAmount
        taxAmount
        discountAmount
        totalAmount
        currency
        status
        shippingAddress
        billingAddress
        paymentMethod
        paymentStatus
        paymentDetails
        appliedDiscounts
        taxDetails
        refundDetails
        deliveries {
          deliveryAttempts
          deliveryAddress
        }
        statusHistory
        createdAt
        updatedAt
      }
    }
  `

    const response: Promise<
      OperationResult<{
        GetOrder: Order
      }>
    > = this.query(requestData, { uuid })

    return response
  }
  // #endregion QUERIES
}
