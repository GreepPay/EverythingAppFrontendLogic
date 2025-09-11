import { $api } from "../../services"
import { CombinedError } from "urql"
import Common from "./Common"
import { Logic } from ".."
import { CountryInformation } from "../../gql/graphql"

export default class ConstantModule extends Common {
  public CountryInfo: CountryInformation | undefined = undefined

  public GetCountryInformation = async (
    country_code: string
  ): Promise<CountryInformation | undefined> => {
    return $api.constant
      .GetCountryInformation(country_code)
      .then((response) => {
        this.CountryInfo = response.data?.GetCountryInformation
        return response.data?.GetCountryInformation
      })
      .catch((error: CombinedError) => {
        Logic.Common.showError(
          error,
          "Failed to fetch country information",
          "error-alert"
        )
        return undefined
      })
  }
}
