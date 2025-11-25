import {
  BusinessPaginator,
  DeliveryAddressPaginator,
  Business as GqlBusiness,
  CommerceSection,
  BusinessFollowers,
} from "../../gql/graphql"
import { $api } from "../../services"
import { CombinedError } from "@urql/core"
import Common from "./Common"
import { Logic } from ".."
import { CommerceSectionCategories } from "../../common/constants"

export default class MarketModule extends Common {
  constructor() {
    super()
    this.defineReactiveProperty("ManyFeaturedShops", undefined)
    this.defineReactiveProperty("ManyMarketShops", undefined)
    this.defineReactiveProperty("BusinessesPaginator", undefined)
    this.defineReactiveProperty("SingleBusiness", undefined)
    this.defineReactiveProperty("CommerceSections", undefined)
    this.defineReactiveProperty("BusinessesCategories", undefined)
  }

  // Base Variable
  public ManyMarketShops: BusinessPaginator | undefined
  public ManyFeaturedShops: BusinessPaginator | undefined
  public BusinessesPaginator: BusinessPaginator | undefined
  public SingleBusiness: GqlBusiness | undefined
  public CommerceSections: CommerceSection | undefined
  public BusinessesCategories: any | undefined

  // #region Mutation
  // Follow a business
  public FollowBusiness = async (
    business_uuid: String
  ): Promise<BusinessFollowers | undefined> => {
    console.log("Following business:", business_uuid)
    return $api.market
      .FollowBusiness(business_uuid)
      .then((response) => {
        return response.data?.FollowBusiness
      })
      .catch((error: CombinedError) => {
        Logic.Common.showError(
          error,
          "Failed to follow business",
          "error-alert"
        )
        return undefined
      })
  }

  // Unfollow a business
  public UnfollowBusiness = async (
    business_uuid: String
  ): Promise<boolean | undefined> => {
    return $api.market
      .UnfollowBusiness(business_uuid)
      .then((response) => {
        console.log("Unfollow response", response)
        return response.data?.UnfollowBusiness
      })
      .catch((error: CombinedError) => {
        Logic.Common.showError(
          error,
          "Failed to unfollow business",
          "error-alert"
        )
        return undefined
      })
  }

  // #region Queries
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
      this.GetBusinessesCategories()
      const subCategoryPerCategory =
        this.BusinessesCategories.find(
          (section: any) => section.key === category.toLowerCase()
        )?.items.map((item: any) => item.key) || []

      const orBlocks = subCategoryPerCategory
        .map((sub: string) => {
          return `{
            column: CATEGORY,
            operator: LIKE,
            value: "%${sub}%"
          }`
        })
        .join(",")

      whereCategoryQuery = `{
        OR: [
          ${orBlocks}
        ]
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

  public GetCommerceSections = async (type: string, limit: number) => {
    return $api.market.GetCommerceSections(type, limit).then((response) => {
      this.CommerceSections = response.data?.CommerceSections
      return response.data?.CommerceSections
    })
  }

  public GetBusinessesCategories = async () => {
    this.BusinessesCategories = CommerceSectionCategories.businesses
    return this.BusinessesCategories
  }
  //
}
