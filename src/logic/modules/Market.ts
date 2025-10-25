import { BusinessPaginator, Business as GqlBusiness } from "../../gql/graphql"
import { $api } from "../../services"
import { CombinedError } from "@urql/core"
import Common from "./Common"
import { Logic } from ".."

export default class MarketModule extends Common {
  constructor() {
    super()
    this.defineReactiveProperty("ManyFeaturedShops", undefined)
    this.defineReactiveProperty("ManyMarketShops", undefined)
    this.defineReactiveProperty("BusinessesPaginator", undefined)
    this.defineReactiveProperty("SingleBusiness", undefined)
  }

  // Base Variable
  public ManyMarketShops: BusinessPaginator | undefined
  public ManyFeaturedShops: BusinessPaginator | undefined
  public BusinessesPaginator: BusinessPaginator | undefined
  public SingleBusiness: GqlBusiness | undefined

  // Get paginated markets
  public GetMarkets = async (
    first: number,
    page: number
  ): Promise<BusinessPaginator | undefined> => {
    return $api.market
      .GetMarkets(first, page)
      .then((response) => {
        this.BusinessesPaginator = response.data?.GetMarkets
        return this.BusinessesPaginator
      })
      .catch((error: CombinedError) => {
        Logic.Common.showError(error, "Failed to fetch markets", "error-alert")
        return undefined
      })
  }

  //
  public GetMarketShops = async (page: number, count: number) => {
    return $api.market.GetMarketShops(page, count).then((response) => {
      this.BusinessesPaginator = response.data?.MarketShops
      return this.BusinessesPaginator
    })
  }

  public GetFeaturedShops = async (page: number, count: number) => {
    return $api.market.GetFeaturedShops(page, count).then((response) => {
      this.ManyFeaturedShops = response.data?.FeaturedShops
      return this.ManyFeaturedShops
    })
  }

  public GetSingleBusiness = async (uuid: string) => {
    return $api.market.GetSingleBusiness(uuid).then((response) => {
      this.SingleBusiness = response.data?.GetSingleBusiness
      return response.data?.GetSingleBusiness
    })
  }
  //
}
