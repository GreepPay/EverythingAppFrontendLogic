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

  public ManyOrders: OrderPaginator | undefined
  public SingleOrder: Order | undefined

  public CreateOrder = async (
    input: CreateOrderInput
  ): Promise<Order | undefined> => {
    return $api.order
      .CreateOrder(input)
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
    page: number,
    orderBy?: QueryGetOrdersOrderByOrderByClause[],
    where?: QueryGetOrdersWhereWhereConditions
  ): Promise<OrderPaginator | undefined> => {
    return $api.order
      .GetOrders(first, page, orderBy, where)
      .then((response) => {
        this.ManyOrders = response.data?.GetOrders
        return this.ManyOrders
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
