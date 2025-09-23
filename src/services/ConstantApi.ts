import { BaseApiService } from "./common/BaseService"
import { OperationResult } from "urql"
import { CountryInformation } from "../gql/graphql"

export default class ConstantApi extends BaseApiService {
  // #region QUERIES
  public GetCountryInformation = (country_code: string) => {
    const requestData = `
    query GetCountryInformation($country_code: String!) {
      GetCountryInformation(country_code: $country_code) {
        countryCode
        methods
        idTypes {
          NUMBER
          IMAGE
        }
        requiredFields {
          NUMBER
          IMAGE
        }
        supportedMethods {
          NUMBER
          IMAGE
        }
        imageRequirements {
          selfie_image
          id_front_image
          id_back_image
        }
        methodsAvailable {
          NUMBER
          IMAGE
        }
      }
    }
  `

    const response: Promise<
      OperationResult<{
        GetCountryInformation: CountryInformation
      }>
    > = this.query(requestData, { country_code })

    return response
  }
}
