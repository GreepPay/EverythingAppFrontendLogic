import {
  Order,
  OrderPaginator,
  CreateOrderInput,
  QueryGetOrdersOrderByOrderByClause,
  QueryGetOrdersWhereWhereConditions,
} from "../../gql/graphql"
import { $api } from "../../services"
import { CombinedError } from "@urql/core"
import { Logic } from ".."
import Common from "./Common"

export default class OrderModule extends Common {
  constructor() {
    super()
  }

  public OrdersPaginator: OrderPaginator | undefined
  public SingleOrder: Order | undefined

  // mutation payloads
  public CreateOrderPayload: CreateOrderInput | undefined

  public CreateOrder = async (): Promise<Order | undefined> => {
    if (!this.CreateOrderPayload) return

    
    return $api.order
      .CreateOrder(this.CreateOrderPayload)
      .then((response) => { 
        return response.data?.CreateOrder
      })
      .catch((error: CombinedError) => {
        Logic.Common.showError(error, "Failed to create order", "error-alert")
        return undefined
      })
  }

  public GetOrders = async (
    first: number,
    page: number
  ): Promise<OrderPaginator | undefined> => {
    return $api.order
      .GetOrders(first, page)
      .then((response) => { 

        this.OrdersPaginator = response.data?.GetOrders
        return this.OrdersPaginator
      })
      .catch((error: CombinedError) => {
        Logic.Common.showError(error, "Failed to fetch orders", "error-alert")
        return undefined
      })
  }

  public GetSingleOrder = async (id: string): Promise<Order | undefined> => {
    return $api.order
      .GetSingleOrder(id)
      .then((response) => {
        this.SingleOrder = response.data?.GetSingleOrder
        return this.SingleOrder
      })
      .catch((error: CombinedError) => {
        Logic.Common.showError(error, "Failed to fetch order", "error-alert")
        return undefined
      })
  }
}
