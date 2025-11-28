import { BaseApiService } from './common/BaseService';
import { OperationResult } from 'urql';
import {
  CreateOrderInput,
  Order,
  OrderPaginator,
  QueryGetOrdersOrderByOrderByClause,
  QueryGetOrdersWhereWhereConditions,
} from '../gql/graphql';

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
  public CreateOrder = (input: CreateOrderInput, security_pin: string) => {
    const requestData = `
    mutation CreateOrder($input: CreateOrderInput!, $security_pin: String!) {
      CreateOrder(input: $input, security_pin: $security_pin) { 
        id
        uuid
        status
        paymentStatus 
         conversation {
          uuid
        }
      }
    }
  `;

    const response: Promise<OperationResult<{ CreateOrder: Order }>> =
      this.mutation(requestData, { input, security_pin });

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
  public GetOrders = (
    page: number,
    count: number,
    orderType = 'CREATED_AT',
    order: 'ASC' | 'DESC',
    whereQuery = ''
  ) => {
    const requestData = `
    query GetOrders(
        $page: Int!,
        $count: Int!
      ) {
      GetOrders(first: $count,
          page: $page,
       orderBy: {
            column: ${orderType ? orderType : 'CREATED_AT'},
            order: ${order}
          }
          ${whereQuery ? `where: ${whereQuery}` : ''}) {
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
          createdAt
          updatedAt
          sales {
            id
            uuid
            transactionId
            subtotalAmount
            taxAmount
            discountAmount
            totalAmount
            currency
            status
            items  
            paymentDetails
            refundDetails
            productItems {
               id
              sku
              name
              slug
              description
              price
              currency
              type
              status
              images
            }
            metadata
            createdAt
            updatedAt
        }
        }
      }
    }
  `;

    const response: Promise<
      OperationResult<{
        GetOrders: OrderPaginator;
      }>
    > = this.query(requestData, { page, count });

    return response;
  };

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
        deliveryAddress {
          name
          delivery_location_id
          google_map_link
          description
        }
        conversation {
          uuid
          name
          entity_type
          participants {
            id
          }
        }
        deliverymethod
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
        sales {
          id
          uuid
          transactionId
          business {
            business_name
            business_type
            category
            logo
            id
            uuid
          } 
          productItems {
            id
            sku
            name
            slug
            description
            price
            currency
            type
            images
            status
          }
          subtotalAmount
          taxAmount
          discountAmount
          totalAmount
          currency
          status
          items  
          paymentDetails
          refundDetails
          metadata
          createdAt
          updatedAt
        }
  }
  }
  `;

    const response: Promise<
      OperationResult<{
        GetOrder: Order;
      }>
    > = this.query(requestData, { uuid });

    return response;
  };
  // #endregion QUERIES
}
