import {
  Order,
  OrderPaginator,
  CreateOrderInput,
  QueryGetOrdersOrderByOrderByClause,
  QueryGetOrdersWhereWhereConditions,
  ExchangeOrderPaginator,
} from "../../gql/graphql";
import { CreateDeliveryOrderInput } from "../../services/OrderApi";
import { $api } from "../../services";
import { CombinedError } from "@urql/core";
import { Logic } from "..";
import Common from "./Common";

export default class OrderModule extends Common {
  constructor() {
    super();
    this.defineReactiveProperty("OrdersPaginator", undefined);
    this.defineReactiveProperty("SingleOrder", undefined);
  }

  public OrdersPaginator: OrderPaginator | undefined;
  public SingleOrder: Order | undefined;

  // mutation payloads
  public CreateOrderPayload: CreateOrderInput | undefined;
  public CreateDeliveryOrderPayload: CreateDeliveryOrderInput | undefined;

  public CreateOrder = async (
    transactionPin: string
  ): Promise<Order | undefined> => {
    if (!this.CreateOrderPayload) return;

    return $api.order
      .CreateOrder(this.CreateOrderPayload, transactionPin)
      .then((response) => {
        return response.data?.CreateOrder;
      })
      .catch((error: CombinedError) => {
        Logic.Common.showError(error, "Failed to create order", "error-alert");
        return undefined;
      });
  };

  public CreateDeliveryOrder = async (
    security_pin: string = ""
  ): Promise<Order | undefined> => {
    if (!this.CreateDeliveryOrderPayload) return;

    Logic.Common.showLoader({
      loading: true,
      show: true,
      message: "Processing your delivery order...",
    });

    return $api.order
      .CreateDeliveryOrder(this.CreateDeliveryOrderPayload, security_pin)
      .then((response) => {
        Logic.Common.hideLoader();
        return response.data?.CreateDeliveryOrder;
      })
      .catch((error: CombinedError) => {
        Logic.Common.hideLoader();
        Logic.Common.showError(
          error,
          "Failed to create delivery order",
          "error-alert"
        );
        return undefined;
      });
  };

  public GetOrders = async (
    page: number,
    count: number,
    orderType: "CREATED_AT",
    order = "DESC" as "DESC" | "ASC",
    whereQuery = "",
    isLoadMore = false
  ): Promise<OrderPaginator | undefined> => {
    return $api.order
      .GetOrders(page, count, orderType, order, whereQuery)
      .then((response) => {
        if (response) {
          if (!isLoadMore) {
            this.OrdersPaginator = response.data?.GetOrders;
          } else {
            const existingData: OrderPaginator = JSON.parse(
              JSON.stringify(this.OrdersPaginator)
            );
            existingData.data = existingData.data.concat(
              response.data?.GetOrders?.data || []
            );
            existingData.paginatorInfo =
              response.data?.GetOrders?.paginatorInfo || undefined;

            this.OrdersPaginator = existingData;
          }

          return this.OrdersPaginator;
        }
        // this.OrdersPaginator = response.data?.GetOrders
        // return this.OrdersPaginator
      })
      .catch((error: CombinedError) => {
        Logic.Common.showError(error, "Failed to fetch orders", "error-alert");
        return undefined;
      });
  };

  public GetOrder = async (id: string): Promise<Order | undefined> => {
    return $api.order
      .GetOrder(id)
      .then((response) => {
        this.SingleOrder = response.data?.GetOrder;
        return this.SingleOrder;
      })
      .catch((error: CombinedError) => {
        Logic.Common.showError(error, "Failed to fetch order", "error-alert");
        return undefined;
      });
  };

  public UpdateDeliveryStatus = async (
    deliveryId: string,
    status: string
  ): Promise<boolean | undefined> => {
    if (!deliveryId || !status) {
      return false;
    }

    Logic.Common.showLoader({
      loading: true,
      show: true,
      message: "Updating delivery status...",
    });

    return $api.order
      .UpdateDeliveryStatus(deliveryId, status)
      .then((response) => {
        Logic.Common.hideLoader();
        if (response.data?.UpdateDeliveryStatus) {
          Logic.Common.showAlert({
            show: true,
            message: "Delivery status updated successfully",
            type: "success",
          });
          return true;
        }
        return false;
      })
      .catch((error: CombinedError) => {
        Logic.Common.hideLoader();
        Logic.Common.showError(
          error,
          "Failed to update delivery status",
          "error-alert"
        );
        return false;
      });
  };
}
