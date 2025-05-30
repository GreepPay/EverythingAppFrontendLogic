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
  public Markets: BusinessPaginator | undefined

  // Get paginated markets
  public GetMarkets = async (
    first: number,
    page: number
  ): Promise<BusinessPaginator | undefined> => {
    return $api.market
      .GetMarkets(first, page)
      .then((response) => {
        this.Markets = response.data?.GetMarkets
        return this.Markets
      })
      .catch((error: CombinedError) => {
        Logic.Common.showError(error, "Failed to fetch markets", "error-alert")
        return undefined
      })
  }
}
