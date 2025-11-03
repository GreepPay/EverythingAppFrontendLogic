import { BaseApiService } from "./common/BaseService"
import { OperationResult } from "urql"
import {
  Delivery,
  DeliveryAddress,
  DeliveryAddressPaginator,
  DeliveryLocationPaginator,
  DeliveryPaginator,
  DeliveryPricing,
  MutationAddDeliveryAddressArgs,
  MutationUpdateDeliveryAddressArgs,
  QueryGetDeliveriesOrderByOrderByClause,
  QueryGetDeliveriesWhereWhereConditions,
} from "../gql/graphql"

export default class DeliveryApi extends BaseApiService {
  // #region QUERIES
  public GetDeliveries = (
    first: number,
    page: number,
    orderBy?: QueryGetDeliveriesOrderByOrderByClause[],
    where?: QueryGetDeliveriesWhereWhereConditions
  ) => {
    const requestData = `
    query GetDeliveries($first: Int!, $page: Int, $orderBy: [QueryGetDeliveriesOrderByOrderByClause!], $where: QueryGetDeliveriesWhereWhereConditions) {
      GetDeliveries(first: $first, page: $page, orderBy: $orderBy, where: $where) {
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
          orderId
          trackingNumber
          status
          estimatedDelivery
          actualDelivery
          deliveryAttempts
          recipientSignature
          carrier {
            # Add relevant fields here (e.g. name, code, etc.)
          }
          trackingUpdates {
            timestamp
            location
            status
            description
            carrierCode
          }
        }
      }
    }
  `

    const response: Promise<
      OperationResult<{
        GetDeliveries: DeliveryPaginator
      }>
    > = this.query(requestData, { first, page, orderBy, where })

    return response
  }

  public GetSingleDelivery = (where: any) => {
    const requestData = `
    query GetSingleDelivery($where: QueryGetSingleDeliveryWhereWhereConditions) {
      GetSingleDelivery(where: $where) {
        orderId
        carrier {
          id
          name
          code
          trackingUrl
        }
        trackingNumber
        status
        estimatedDelivery
        actualDelivery
        deliveryAttempts
        trackingUpdates {
          timestamp
          location
          status
          description
          carrierCode
        }
        recipientSignature
      }
    }
  `

    const response: Promise<
      OperationResult<{
        GetSingleDelivery: Delivery
      }>
    > = this.query(requestData, { where })

    return response
  }

  public GetDeliveryLocations = (
    page: number,
    count: number,
    orderType = "CREATED_AT",
    order: "ASC" | "DESC" = "DESC",
    whereQuery = ""
  ) => {
    const requestData = `
      query GetDeliveryLocations($page: Int!, $count: Int!) {
        GetDeliveryLocations(
          first: $count,
          page: $page, 
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
            country
            area
            status
            createdAt
            updatedAt
          }
        }
      }
    `

    const response: Promise<
      OperationResult<{
        GetDeliveryLocations: DeliveryLocationPaginator
      }>
    > = this.query(requestData, {
      page,
      count,
    })

    return response
  }

  public GetDeliveryPricing = (
    originLocationId: number,
    destinationLocationId: number
  ) => {
    const requestData = `
      query GetDeliveryPricing($originLocationId: Int!, $destinationLocationId: Int!) {
        GetDeliveryPricing(
          originLocationId: $originLocationId,
          destinationLocationId: $destinationLocationId 
        ) {
          id
          originLocation {
            id
            country
            area
            status
            createdAt
            updatedAt
          }
          destinationLocation {
            id
            country
            area
            status
            createdAt
            updatedAt
          }
          price
          status
          createdAt
          updatedAt
        }
      }
    `

    const response: Promise<
      OperationResult<{
        GetDeliveryPricing: DeliveryPricing
      }>
    > = this.query(requestData, {
      originLocationId,
      destinationLocationId,
    })

    return response
  }

  public GetDeliveryAddress = (uuid: string) => {
    const requestData = `
    query GetDeliveryAddress($uuid: String!) {
      GetDeliveryAddress(uuid: $uuid) {
        id
        uuid
        auth_user_id
        name
        delivery_location_id
        google_map_link
        description
        is_default
        is_active
        created_at
        updated_at
      }
    }
  `

    const response: Promise<
      OperationResult<{
        GetDeliveryAddress: DeliveryAddress
      }>
    > = this.query(requestData, { uuid })

    return response
  }

  public GetDeliveryAddresses = (page: number, first: number) => {
    const requestData = `
    query GetDeliveryAddresses($first: Int!, $page: Int!) {
      GetDeliveryAddresses(first: $first, page: $page) {
        data {
          id
          uuid
          auth_user_id
          name
          delivery_location_id
          google_map_link
          description
          is_default
          is_active
          created_at
          updated_at
        }
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
      }
    }
  `

    const response: Promise<
      OperationResult<{
        GetDeliveryAddresses: {
          data: any[]
          paginatorInfo: any
        }
      }>
    > = this.query(requestData, { first, page })

    return response
  }

  public GetP2PDeliveryAddresses = (
    first: number,
    page: number,
    orderType = "CREATED_AT",
    order: "ASC" | "DESC" = "DESC",
    whereQuery = ""
  ) => {
    const requestData = `
    query GetP2PDeliveryAddresses($first: Int!, $page: Int!) {
      GetP2PDeliveryAddresses(first: $first, page: $page, orderBy: {
            column: ${orderType ? orderType : "CREATED_AT"},
            order: ${order}
          }
          ${whereQuery ? `where: ${whereQuery}` : ""}) {
        data {
          id
          uuid
          auth_user_id
          name
          delivery_location_id
          google_map_link
          description
          is_default
          is_active
          created_at
          updated_at
        }
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
      }
    }
  `

    const response: Promise<
      OperationResult<{
        GetP2PDeliveryAddresses: DeliveryAddressPaginator
      }>
    > = this.query(requestData, { first, page })

    return response
  }

  // #endregion QUERIES

  // #region MUTATIONS

  public AddDeliveryAddress = (data: MutationAddDeliveryAddressArgs) => {
    const requestData = `
    mutation AddDeliveryAddress(
      $name: String!,
      $delivery_location_id: String!,
      $google_map_link: String,
      $description: String,
      $isDefault: Boolean
    ) {
      AddDeliveryAddress(
        name: $name,
        delivery_location_id: $delivery_location_id,
        google_map_link: $google_map_link,
        description: $description,
        is_default: $isDefault
      ) {
        id
        uuid
        auth_user_id
        name
        delivery_location_id
        google_map_link
        description
        is_default
        is_active
        created_at
        updated_at
      }
    }
  `

    const response: Promise<
      OperationResult<{
        AddDeliveryAddress: DeliveryAddress
      }>
    > = this.mutation(requestData, data)

    return response
  }

  public UpdateDeliveryAddress = (data: MutationUpdateDeliveryAddressArgs) => {
    const requestData = `
    mutation UpdateDeliveryAddress(
      $id: ID!,
      $name: String,
      $delivery_location_id: String,
      $google_map_link: String,
      $description: String,
      $is_default: Boolean,
      $is_active: Boolean
    ) {
      UpdateDeliveryAddress(
        id: $id,
        name: $name,
        delivery_location_id: $delivery_location_id,
        google_map_link: $google_map_link,
        description: $description,
        is_default: $is_default,
        is_active: $is_active
      ) {
        id
        uuid
        auth_user_id
        name
        delivery_location_id
        google_map_link
        description
        is_default
        is_active
        created_at
        updated_at
      }
    }
  `

    const response: Promise<
      OperationResult<{
        UpdateDeliveryAddress: DeliveryAddress
      }>
    > = this.mutation(requestData, data)

    return response
  }

  // #endregion MUTATIONS
}
