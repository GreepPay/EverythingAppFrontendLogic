import {
  QueryGetDeliveriesOrderByOrderByClause,
  QueryGetDeliveriesWhereWhereConditions,
  Delivery,
} from "../../gql/graphql";
import { $api } from "../../services";
import { CombinedError } from "urql";
import Common from "./Common";
import { Logic } from "..";
import { DeliveryPaginator } from "../../gql/graphql";

export default class DeliveryModule extends Common {
  constructor() {
    super();
    this.defineReactiveProperty("ManyDeliveries", undefined);
    this.defineReactiveProperty("SingleDelivery", undefined);
  }

  // Base Variables
  public ManyDeliveries: DeliveryPaginator | undefined;
  public SingleDelivery: Delivery | undefined;

  public GetDeliveries = async (
    first: number,
    page: number,
    orderBy?: QueryGetDeliveriesOrderByOrderByClause[],
    where?: QueryGetDeliveriesWhereWhereConditions
  ): Promise<DeliveryPaginator | undefined> => {
    return $api.delivery
      .GetDeliveries(first, page, orderBy, where)
      .then((response) => {
        this.ManyDeliveries = response.data?.GetDeliveries;
        return this.ManyDeliveries;
      })
      .catch((error: CombinedError) => {
        Logic.Common.showError(
          error,
          "Failed to fetch deliveries",
          "error-alert"
        );
        return undefined;
      });
  };

  public GetSingleDelivery = async (
    where: any
  ): Promise<Delivery | undefined> => {
    return $api.delivery
      .GetSingleDelivery(where)
      .then((response) => {
        this.SingleDelivery = response.data?.GetSingleDelivery;
        return this.SingleDelivery;
      })
      .catch((error: CombinedError) => {
        Logic.Common.showError(
          error,
          "Failed to fetch delivery details",
          "error-alert"
        );
        return undefined;
      });
  };
}
