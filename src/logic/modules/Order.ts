import {
  Order,
  OrderPaginator,
  CreateOrderInput,
  QueryGetOrdersOrderByOrderByClause,
  QueryGetOrdersWhereWhereConditions,
} from "../../gql/graphql"
import { CreateDeliveryOrderInput } from "../../services/OrderApi"
import { $api } from "../../services"
import { CombinedError } from "@urql/core"
import { Logic } from ".."
import Common from "./Common"

export default class OrderModule extends Common {
  constructor() {
    super()
    this.defineReactiveProperty("OrdersPaginator", undefined)
    this.defineReactiveProperty("SingleOrder", undefined)
  }

  public OrdersPaginator: OrderPaginator | undefined
  public SingleOrder: Order | undefined

  // mutation payloads
  public CreateOrderPayload: CreateOrderInput | undefined
  public CreateDeliveryOrderPayload: CreateDeliveryOrderInput | undefined

  public CreateOrder = async (): Promise<Order | undefined> => {
    if (!this.CreateOrderPayload) return

    console.log("CreateOrderPayload", this.CreateOrderPayload)

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

  public CreateDeliveryOrder = async (): Promise<Order | undefined> => {
    if (!this.CreateDeliveryOrderPayload) return

    Logic.Common.showLoader({
      loading: true,
      show: true,
      message: "Processing your delivery order...",
    })

    return $api.order
      .CreateDeliveryOrder(this.CreateDeliveryOrderPayload)
      .then((response) => {
        Logic.Common.hideLoader()
        return response.data?.CreateDeliveryOrder
      })
      .catch((error: CombinedError) => {
        Logic.Common.hideLoader()
        Logic.Common.showError(
          error,
          "Failed to create delivery order",
          "error-alert"
        )
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

  public GetOrder = async (id: string): Promise<Order | undefined> => {
    return $api.order
      .GetOrder(id)
      .then((response) => {
        this.SingleOrder = response.data?.GetOrder
        return this.SingleOrder
      })
      .catch((error: CombinedError) => {
        Logic.Common.showError(error, "Failed to fetch order", "error-alert")
        return undefined
      })
  }

  public UpdateDeliveryStatus = async (
    deliveryId: string,
    status: string
  ): Promise<boolean | undefined> => {
    if (!deliveryId || !status) {
      return false
    }

    Logic.Common.showLoader({
      loading: true,
      show: true,
      message: "Updating delivery status...",
    })

    return $api.order
      .UpdateDeliveryStatus(deliveryId, status)
      .then((response) => {
        Logic.Common.hideLoader()
        if (response.data?.UpdateDeliveryStatus) {
          Logic.Common.showAlert({
            show: true,
            message: "Delivery status updated successfully",
            type: "success",
          })
          return true
        }
        return false
      })
      .catch((error: CombinedError) => {
        Logic.Common.hideLoader()
        Logic.Common.showError(
          error,
          "Failed to update delivery status",
          "error-alert"
        )
        return false
      })
  }
}
