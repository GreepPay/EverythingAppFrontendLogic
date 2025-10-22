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
} from "../../gql/graphql"
import { $api } from "../../services"
import { CombinedError } from "urql"
import Common from "./Common"
import { Logic } from ".."

export default class DeliveryModule extends Common {
  constructor() {
    super()
    this.defineReactiveProperty("ManyDeliveries", undefined)
    this.defineReactiveProperty("SingleDelivery", undefined)
    this.defineReactiveProperty("ManyDeliveryLocations", undefined)
    this.defineReactiveProperty("DeliveryPricingData", undefined)
    this.defineReactiveProperty("DeliveryAddress", undefined)
    this.defineReactiveProperty("DeliveryAddressesPaginator", undefined)
  }

  // Base Variables
  public ManyDeliveries: DeliveryPaginator | undefined
  public SingleDelivery: Delivery | undefined
  public ManyDeliveryLocations: DeliveryLocationPaginator | undefined
  public DeliveryPricingData: DeliveryPricing | undefined
  public DeliveryAddress: DeliveryAddress | undefined
  public DeliveryAddressesPaginator: DeliveryAddressPaginator | undefined

  public GetDeliveries = async (
    first: number,
    page: number,
    orderBy?: QueryGetDeliveriesOrderByOrderByClause[],
    where?: QueryGetDeliveriesWhereWhereConditions
  ): Promise<DeliveryPaginator | undefined> => {
    return $api.delivery
      .GetDeliveries(first, page, orderBy, where)
      .then((response) => {
        this.ManyDeliveries = response.data?.GetDeliveries
        return this.ManyDeliveries
      })
      .catch((error: CombinedError) => {
        Logic.Common.showError(
          error,
          "Failed to fetch deliveries",
          "error-alert"
        )
        return undefined
      })
  }

  public GetSingleDelivery = async (
    where: any
  ): Promise<Delivery | undefined> => {
    return $api.delivery
      .GetSingleDelivery(where)
      .then((response) => {
        this.SingleDelivery = response.data?.GetSingleDelivery
        return this.SingleDelivery
      })
      .catch((error: CombinedError) => {
        Logic.Common.showError(
          error,
          "Failed to fetch delivery details",
          "error-alert"
        )
        return undefined
      })
  }

  public GetDeliveryLocations = async (
    page: number,
    count: number,
    orderType = "CREATED_AT",
    order: "DESC" | "ASC" = "DESC",
    whereQuery = ""
  ) => {
    return $api.delivery
      .GetDeliveryLocations(page, count, orderType, order, whereQuery)
      .then((response) => {
        this.ManyDeliveryLocations = response.data?.GetDeliveryLocations
        return this.ManyDeliveryLocations
      })
  }

  public GetDeliveryPricing = async (
    originLocationId: number,
    destinationLocationId: number,
    order: "DESC" | "ASC" = "DESC",
    whereQuery = ""
  ) => {
    return $api.delivery
      .GetDeliveryPricing(
        originLocationId,
        destinationLocationId,
        order,
        whereQuery
      )
      .then((response) => {
        this.DeliveryPricingData = response.data?.GetDeliveryPricing
        return this.DeliveryPricingData
      })
  }

  public GetDeliveryAddress = async (uuid: string) => {
    return $api.delivery.GetDeliveryAddress(uuid).then((response) => {
      this.DeliveryAddress = response.data?.GetDeliveryAddress
      return this.DeliveryAddress
    })
  }

  public GetDeliveryAddresses = async (first: number, page: number) => {
    return $api.delivery.GetDeliveryAddresses(first, page).then((response) => {
      this.DeliveryAddressesPaginator = response.data?.GetDeliveryAddresses
      return this.DeliveryAddressesPaginator
    })
  }
  // #endregion Queries

  // #region Mutations
  public AddDeliveryAddress = (data: MutationAddDeliveryAddressArgs) => {
    return $api.delivery
      .AddDeliveryAddress(data)
      .then((response) => {
        // if (response.data?.AddDeliveryAddress) {
        //   this.NewDeliveryAddress = response.data?.AddDeliveryAddress
        // }
        Logic.Common.hideLoader()
        return response.data?.AddDeliveryAddress
      })
      .catch((error: CombinedError) => {
        Logic.Common.hideLoader()
        Logic.Common.showError(error, "Oops!", "error-alert")
        throw new Error(error.message)
      })
  }

  public UpdateDeliveryAddress = (data: MutationUpdateDeliveryAddressArgs) => {
    return $api.delivery
      .UpdateDeliveryAddress(data)
      .then((response) => {
        // if (response.data?.UpdateDeliveryAddress) {
        //   this.UpdatedDeliveryAddress = response.data?.UpdateDeliveryAddress
        // }
        Logic.Common.hideLoader()
        return response.data?.UpdateDeliveryAddress
      })
      .catch((error: CombinedError) => {
        Logic.Common.hideLoader()
        Logic.Common.showError(error, "Oops!", "error-alert")
        throw new Error(error.message)
      })
  }

  // #endregion Mutations
}
