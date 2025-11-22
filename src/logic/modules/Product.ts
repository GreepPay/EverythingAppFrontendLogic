import {
  QueryGetCategoriesOrderByOrderByClause,
  Product as GqlProduct,
  ProductPaginator,
  CategoryPaginator,
} from "../../gql/graphql"

import { $api } from "../../services"
import { CombinedError } from "urql"
import Common from "./Common"
import { Logic } from ".."
import { CommerceSectionCategories } from "../../common/constants"

export default class Product extends Common {
  // Base Variables
  public ProductsPaginator: ProductPaginator | undefined
  public SingleProduct: GqlProduct | undefined
  public CategoriesPagination: CategoryPaginator | undefined
  public ManyShopProducts: ProductPaginator | undefined
  public ManyEventProducts: ProductPaginator | undefined
  public ManyMarketProducts: ProductPaginator | undefined
  public BusinessMarketProducts: ProductPaginator | undefined
  public ManyFeaturedProducts: ProductPaginator | undefined
  public ManyFeaturedEvents: ProductPaginator | undefined
  public ProductsCategories: any | undefined

  public ProductsInCart: ProductPaginator | undefined

  constructor() {
    super()

    this.defineReactiveProperty("ManyShopProducts", undefined)
    this.defineReactiveProperty("SingleProduct", undefined)
    this.defineReactiveProperty("ManyEventProducts", undefined)
    this.defineReactiveProperty("ProductsPaginator", undefined)
    this.defineReactiveProperty("CategoriesPagination", undefined)
    this.defineReactiveProperty("ManyMarketProducts", undefined)
    this.defineReactiveProperty("ManyFeaturedProducts", undefined)
    this.defineReactiveProperty("ManyFeaturedEvents", undefined)
    this.defineReactiveProperty("BusinessMarketProducts", undefined)
    this.defineReactiveProperty("ProductsCategories", undefined)
  }

  public GetShopProducts = async (
    page: number,
    count: number,
    orderType = "CREATED_AT",
    order = "DESC" as "DESC" | "ASC",
    searchQuery = "",
    isSearch = false
  ) => {
    let whereQuery = ""

    if (searchQuery) {
      whereQuery = `{
          column: NAME
          operator: LIKE
          value: "%${searchQuery}%"
          AND: {
            column: TYPE
            operator: EQ
            value: "physical"
            OR: {
              column: TYPE
              operator: EQ
              value: "digital"
            }
          }
        }`
    } else {
      whereQuery = `{
          column: TYPE
          operator: EQ
          value: "physical"
          OR: {
            column: TYPE
            operator: EQ
            value: "digital"
          }
        }`
    }

    return $api.product
      .GetProducts(page, count, orderType, order, whereQuery)
      .then((response) => {
        if (!isSearch) {
          this.ManyShopProducts = response.data?.GetProducts
        }
        return response.data?.GetProducts
      })
  }

  public GetEventProducts = async (
    page: number,
    count: number,
    orderType = "CREATED_AT",
    order = "DESC" as "DESC" | "ASC",
    searchQuery = "",
    isSearch = false
  ) => {
    let whereQuery = ""

    if (searchQuery) {
      whereQuery = `{
          column: NAME
          operator: LIKE
          value: "%${searchQuery}%"
          AND: {
            column: TYPE
            operator: EQ
            value: "event"
          },
          AND: {
            column: STATUS
            operator: EQ
            value: "active"
          }
        }`
    } else {
      whereQuery = `{
          column: TYPE
          operator: EQ
          value: "event",
          AND: {
          column: STATUS
          operator: EQ
          value: "active"
          }
        }`
    }

    return $api.product
      .GetProducts(page, count, orderType, order, whereQuery)
      .then((response) => {
        if (!isSearch) {
          this.ManyEventProducts = response.data?.GetProducts
        }
        return response.data?.GetProducts
      })
  }

  public GetProduct = async (uuid: string) => {
    return $api.product.GetProduct(uuid).then((response) => {
      this.SingleProduct = response.data?.GetProduct
      return response.data?.GetProduct
    })
  }

  public GetSingleProduct = async (
    product_id: string | number
  ): Promise<GqlProduct | undefined> => {
    const where = {
      column: "ID",
      operator: "EQ",
      value: String(product_id),
    }
    return $api.product
      .GetSingleProduct(where)
      .then((response) => {
        this.SingleProduct = response.data?.GetSingleProduct
        return this.SingleProduct
      })
      .catch((error: CombinedError) => {
        Logic.Common.showError(
          error,
          "Failed to fetch product details",
          "error-alert"
        )
        return undefined
      })
  }

  public GetCategories = async (
    first: number,
    page: number,
    orderBy?: QueryGetCategoriesOrderByOrderByClause[]
  ): Promise<CategoryPaginator | undefined> => {
    return $api.product
      .GetCategories(first, page, orderBy ?? [])
      .then((response) => {
        this.CategoriesPagination = response.data?.GetCategories
        return this.CategoriesPagination
      })
      .catch((error: CombinedError) => {
        Logic.Common.showError(
          error,
          "Failed to fetch categories",
          "error-alert"
        )
        return undefined
      })
  }

  public GetMarketProducts = async (
    page: number,
    count: number,
    orderType = "CREATED_AT",
    order = "DESC" as "DESC" | "ASC",
    whereQuery = "",
    forBusiness = false,
    isLoadMore = false,
    category: string
  ) => {
    console.log("category  adwaer", category)
    let whereCategoryQuery = ""
    if (category && category.trim() !== "") {
      this.GetProductsCategories()
      const subCategoryPerCategory =
        this.ProductsCategories.find(
          (section: any) => section.key === category.toLowerCase()
        )?.items.map((item: any) => item.key) || []

      const orBlocks = subCategoryPerCategory
        .map((sub: string) => {
          return `{
            column: CATEGORY_ID,
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

    console.log("whereCategoryQuery", whereCategoryQuery)

    return $api.product
      .GetMarketProducts(page, count, orderType, order, whereCategoryQuery)
      .then((response) => {
        if (!isLoadMore) {
          forBusiness ?
            (this.BusinessMarketProducts = response.data?.MarketProducts)
          : (this.ManyMarketProducts = response.data?.MarketProducts)

          return forBusiness ?
              this.BusinessMarketProducts
            : this.ManyMarketProducts
        } else {
          const existingData: ProductPaginator =
            forBusiness ?
              JSON.parse(JSON.stringify(this.BusinessMarketProducts))
            : JSON.parse(JSON.stringify(this.ManyMarketProducts))

          existingData.data = existingData.data.concat(
            response.data?.MarketProducts?.data || []
          )
          existingData.paginatorInfo =
            response.data.MarketProducts?.paginatorInfo

          if (forBusiness) {
            this.BusinessMarketProducts = existingData
            return this.BusinessMarketProducts
          } else {
            this.ManyMarketProducts = existingData
            return this.ManyMarketProducts
          }
        }
      })
  }

  public GetFeaturedProducts = async (page: number, count: number) => {
    return $api.product.GetFeaturedProducts(page, count).then((response) => {
      this.ManyFeaturedProducts = response.data?.FeaturedProducts
      return this.ManyFeaturedProducts
    })
  }

  public GetFeaturedEvents = async (page: number, count: number) => {
    return $api.product.GetFeaturedEvents(page, count).then((response) => {
      this.ManyFeaturedEvents = response.data?.FeaturedEvents
      return this.ManyFeaturedEvents
    })
  }

  public GetProductsCategories = async () => {
    this.ProductsCategories = CommerceSectionCategories.products
    console.log("this.ProductsCategories", this.ProductsCategories)
    return this.ProductsCategories
  }
}
