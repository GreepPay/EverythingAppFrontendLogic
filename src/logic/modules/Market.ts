import {
  BusinessPaginator,
  DeliveryAddressPaginator,
  Business as GqlBusiness,
  CommerceSection,
} from "../../gql/graphql"
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
    this.defineReactiveProperty("CommerceSections", undefined)
  }

  // Base Variable
  public ManyMarketShops: BusinessPaginator | undefined
  public ManyFeaturedShops: BusinessPaginator | undefined
  public BusinessesPaginator: BusinessPaginator | undefined
  public SingleBusiness: GqlBusiness | undefined
  public CommerceSections: CommerceSection | undefined

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
  public GetMarketShops = async (
    page: number,
    count: number,
    orderType = "CREATED_AT",
    order: "ASC" | "DESC" = "DESC",
    whereQuery = "",
    isLoadMore = false,
    category: string
  ) => {
    console.log("category  adwaer", category)
    let whereCategoryQuery = ""
    if (category && category.trim() !== "") {
      whereCategoryQuery = `{
        column: CATEGORY,
        operator: EQ,
        value: "${category}"
        }`
    } else {
      whereCategoryQuery = whereQuery
    }

    return $api.market
      .GetMarketShops(page, count, orderType, order, whereCategoryQuery)
      .then((response) => {
        if (response) {
          if (!isLoadMore) {
            this.ManyMarketShops = response.data?.MarketShops
          } else {
            const existingData: BusinessPaginator = JSON.parse(
              JSON.stringify(this.ManyMarketShops)
            )
            existingData.data = existingData.data.concat(
              response.data?.MarketShops?.data || []
            )
            existingData.paginatorInfo =
              response.data.MarketShops?.paginatorInfo

            this.ManyMarketShops = existingData
          }

          return this.ManyMarketShops
        }
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

  public GetCommerceSections = async () => {
    return $api.market.GetCommerceSections().then((response) => {
      this.CommerceSections = response.data?.CommerceSections
      return response.data?.CommerceSections
    })
  }
  //
}
