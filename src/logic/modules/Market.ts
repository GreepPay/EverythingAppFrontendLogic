import { BusinessPaginator } from "../../gql/graphql"
import { $api } from "../../services"
import { CombinedError } from "@urql/core"
import Common from "./Common"
import { Logic } from ".."

export default class MarketModule extends Common {
  constructor() {
    super()
  }

  // Base Variable
  public BusinessesPaginator: BusinessPaginator | undefined

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
}
