import { BaseApiService } from "./common/BaseService"
import { OperationResult } from "urql"
import {
  Delivery,
  DeliveryPaginator,
  QueryGetDeliveriesOrderByOrderByClause,
  QueryGetDeliveriesWhereWhereConditions,
  QueryGetSingleDeliveryWhereWhereConditions,
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

  public GetSingleDelivery = (
    where: QueryGetSingleDeliveryWhereWhereConditions
  ) => {
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
  // #endregion QUERIES
}
