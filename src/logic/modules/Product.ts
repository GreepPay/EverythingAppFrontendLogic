import {
  QueryGetProductsOrderByOrderByClause,
  QueryGetProductsWhereWhereConditions,
  QueryGetSingleProductWhereWhereConditions,
  QueryGetCategoriesOrderByOrderByClause,
  Product,
  ProductPaginator,
  Category,
  CategoryPaginator,
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
  public ProductsPaginator: ProductPaginator | undefined
  public SingleProduct: Product | undefined
  public ProductCategoriesPagination: CategoryPaginator | undefined

  public GetProducts = async (
    first: number,
    page: number
  ): Promise<ProductPaginator | undefined> => {
    console.log("weere", first, page)

    return $api.product
      .GetProducts(first, page)
      .then((response) => {
        this.ProductsPaginator = response.data?.GetProducts
        return this.ProductsPaginator
      })
      .catch((error: CombinedError) => {
        Logic.Common.showError(error, "Failed to fetch products", "error-alert")
        return undefined
      })
  }

  public GetSingleProduct = async (
    product_id: string | number
  ): Promise<Product | undefined> => {
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
        this.ProductCategoriesPagination = response.data?.GetCategories
        return this.ProductCategoriesPagination
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
