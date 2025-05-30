import {
  QueryGetProductsOrderByOrderByClause,
  QueryGetProductsWhereWhereConditions,
  QueryGetSingleProductWhereWhereConditions,
  QueryGetCategoriesOrderByOrderByClause,
  Product,
  ProductPaginator,
  Category,
} from "../../gql/graphql"

import { $api } from "../../services"
import { CombinedError } from "urql"
import Common from "./Common"
import { Logic } from ".."

export default class ProductModule extends Common {
  constructor() {
    super()
  }

  // Base Variables
  public ManyProducts: ProductPaginator | undefined
  public SingleProduct: Product | undefined
  public Categories: Category[] = []

  public GetProducts = async (
    first: number,
    page: number,
    orderBy?: QueryGetProductsOrderByOrderByClause[],
    where?: QueryGetProductsWhereWhereConditions
  ): Promise<ProductPaginator | undefined> => {
    return $api.product
      .GetProducts(first, page, orderBy, where)
      .then((response) => {
        this.ManyProducts = response.data?.GetProducts
        return this.ManyProducts
      })
      .catch((error: CombinedError) => {
        Logic.Common.showError(error, "Failed to fetch products", "error-alert")
        return undefined
      })
  }

  public GetSingleProduct = async (
    where: QueryGetSingleProductWhereWhereConditions
  ): Promise<Product | undefined> => {
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
  ): Promise<Category[] | undefined> => {
    return $api.product
      .GetCategories(orderBy ?? [], first, page)
      .then((response) => {
        this.Categories = response.data?.GetCategories?.data ?? []
        return this.Categories
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
}
