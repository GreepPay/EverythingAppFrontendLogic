import {
  QueryGetDeliveriesOrderByOrderByClause,
  QueryGetDeliveriesWhereWhereConditions,
  Delivery,
  DeliveryLocationPaginator,
  DeliveryPaginator,
  DeliveryPricing,
  DeliveryAddress,
  DeliveryAddressPaginator,
  MutationAddDeliveryAddressArgs,
  MutationUpdateDeliveryAddressArgs,
} from "../../gql/graphql";
import { $api } from "../../services";
import { CombinedError } from "urql";
import Common from "./Common";
import { Logic } from "..";

export default class DeliveryModule extends Common {
  constructor() {
    super();
    this.defineReactiveProperty("ManyDeliveries", undefined);
    this.defineReactiveProperty("SingleDelivery", undefined);
    this.defineReactiveProperty("ManyDeliveryLocations", undefined);
    this.defineReactiveProperty("DeliveryPricingData", undefined);
    this.defineReactiveProperty("DeliveryAddress", undefined);
    this.defineReactiveProperty("ManyDeliveryAddresses", undefined);
  }

  // Base Variables
  public ManyDeliveries: DeliveryPaginator | undefined;
  public SingleDelivery: Delivery | undefined;
  public ManyDeliveryLocations: DeliveryLocationPaginator | undefined;
  public DeliveryPricingData: DeliveryPricing | undefined;
  public DeliveryAddress: DeliveryAddress | undefined;
  public ManyDeliveryAddresses: DeliveryAddressPaginator | undefined;

  // mutation payloads
  public AddDeliveryAddressPayload: MutationAddDeliveryAddressArgs | undefined;

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

  public GetDeliveryLocations = async (
    page: number,
    count: number,
    orderType = "CREATED_AT",
    order: "DESC" | "ASC" = "DESC",
    whereQuery = ""
  ) => {
    return $api.delivery.GetDeliveryLocations(page, count).then((response) => {
      this.ManyDeliveryLocations = response.data?.GetDeliveryLocations;
      return this.ManyDeliveryLocations;
    });
  };

  public GetDeliveryPricing = async (
    originLocationId: number,
    destinationLocationId: number
  ) => {
    return $api.delivery
      .GetDeliveryPricing(originLocationId, destinationLocationId)
      .then((response) => {
        this.DeliveryPricingData = response.data?.GetDeliveryPricing;
        return this.DeliveryPricingData;
      });
  };

  public GetDeliveryAddress = async (uuid: string) => {
    return $api.delivery.GetDeliveryAddress(uuid).then((response) => {
      this.DeliveryAddress = response.data?.GetDeliveryAddress;
      return this.DeliveryAddress;
    });
  };

  public GetDeliveryAddresses = async (
    page: number,
    first: number,
    isLoadMore = false
  ) => {
    return $api.delivery.GetDeliveryAddresses(page, first).then((response) => {
      if (response) {
        if (!isLoadMore) {
          this.ManyDeliveryAddresses = response.data?.GetDeliveryAddresses;
        } else {
          const existingData: DeliveryAddressPaginator = JSON.parse(
            JSON.stringify(this.ManyDeliveryAddresses)
          );
          existingData.data = existingData.data.concat(
            response.data?.GetDeliveryAddresses?.data || []
          );
          existingData.paginatorInfo =
            response.data?.GetDeliveryAddresses?.paginatorInfo;

          this.ManyDeliveryAddresses = existingData;
        }

        return this.ManyDeliveryAddresses;
      }
    });
  };

  public GetBusinessDeliveryAddresses = async (business_id: string) => {
    return $api.delivery
      .GetBusinessDeliveryAddresses(business_id)
      .then((response) => {
        if (response) {
          this.ManyDeliveryAddresses = {
            data: response.data?.GetBusinessDeliveryAddresses || [],
            paginatorInfo: {
              count: response.data?.GetBusinessDeliveryAddresses.length || 0,
              currentPage: 1,
              firstItem:
                (response.data?.GetBusinessDeliveryAddresses.length || 0) > 0
                  ? 1
                  : 0,
              hasMorePages: false,
              lastItem: response.data?.GetBusinessDeliveryAddresses.length || 0,
              lastPage: 1,
              perPage: response.data?.GetBusinessDeliveryAddresses.length || 0,
              total: response.data?.GetBusinessDeliveryAddresses.length || 0,
            },
          };
          return this.ManyDeliveryAddresses;
        }
      });
  };

  // #endregion Queries

  // #region Mutations
  public AddDeliveryAddress = (data: MutationAddDeliveryAddressArgs) => {
    return $api.delivery
      .AddDeliveryAddress(data)
      .then((response) => {
        Logic.Common.showAlert({
          show: true,
          message: "New delivery address added successfully",
          type: "info",
          duration: 2500,
        });
        Logic.Common.hideLoader();
        return response.data?.AddDeliveryAddress;
      })
      .catch((error: CombinedError) => {
        Logic.Common.hideLoader();
        Logic.Common.showError(error, "Oops!", "error-alert");
        throw new Error(error.message);
      });
  };

  public UpdateDeliveryAddress = (data: MutationUpdateDeliveryAddressArgs) => {
    return $api.delivery
      .UpdateDeliveryAddress(data)
      .then((response) => {
        Logic.Common.showAlert({
          show: true,
          message: "Delivery address updated successfully.",
          type: "info",
          duration: 2500,
        });
        Logic.Common.hideLoader();
        return response.data?.UpdateDeliveryAddress;
      })
      .catch((error: CombinedError) => {
        Logic.Common.hideLoader();
        Logic.Common.showError(error, "Oops!", "error-alert");
        throw new Error(error.message);
      });
  };

  // #endregion Mutations
}
