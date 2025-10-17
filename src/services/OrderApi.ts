import { BaseApiService } from "./common/BaseService";
import { OperationResult } from "urql";
import {
  CreateOrderInput,
  Order,
  OrderPaginator,
  QueryGetOrdersOrderByOrderByClause,
  QueryGetOrdersWhereWhereConditions,
} from "../gql/graphql";

// This should match the CreateDeliveryOrderInput from the GraphQL schema
export interface CreateDeliveryOrderInput {
  itemDescription: string;
  weight?: string;
  scheduledDate?: string;
  scheduledTime?: string;
  pickupAddress: string;
  deliveryAddress: string;
  note?: string;
  deliveryPrice: number;
  urgency?: string;
  estimatedDeliveryDate?: string;
  paymentMethod?: string;
  phone?: string;
  conversationId?: string; // Add conversation ID field
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
  `;

    const response: Promise<OperationResult<{ CreateOrder: Order }>> =
      this.mutation(requestData, { input });

    return response;
  };

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
  `;

    const response: Promise<OperationResult<{ CreateDeliveryOrder: any }>> =
      this.mutation(requestData, { input });

    return response;
  };

  public UpdateDeliveryStatus = (deliveryId: string, status: string) => {
    const requestData = `
    mutation UpdateDeliveryStatus($input: UpdateDeliveryStatusInput!) {
      UpdateDeliveryStatus(input: $input)
    }
  `;

    // Convert deliveryId to integer since GraphQL schema expects Int
    const deliveryIdInt = parseInt(deliveryId, 10);

    const response: Promise<
      OperationResult<{ UpdateDeliveryStatus: boolean }>
    > = this.mutation(requestData, {
      input: { deliveryId: deliveryIdInt, status },
    });

    return response;
  };
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
  `;

    const response: Promise<
      OperationResult<{
        GetOrders: OrderPaginator;
      }>
    > = this.query(requestData, { first, page });

    return response;
  };

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
  `;

    const response: Promise<
      OperationResult<{
        GetSingleOrder: Order;
      }>
    > = this.query(requestData, { id });

    return response;
  };
  // #endregion QUERIES
}
