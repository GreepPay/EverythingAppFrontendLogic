import {
  Beneficiary,
  BeneficiaryPaginator,
  QueryGetBeneficiariesArgs,
} from "../../gql/graphql"
import { $api } from "../../services"
import { CombinedError } from "urql"
import Common from "./Common"
import { Logic } from ".."

export default class BeneficiaryModule extends Common {
  constructor() {
    super()
  }

  // Base Variables
  public ManyBeneficiaries: BeneficiaryPaginator | undefined

  public GetBeneficiaries = async (
    data: QueryGetBeneficiariesArgs
  ): Promise<BeneficiaryPaginator | undefined> => {
    return $api.beneficiary
      .GetBeneficiaries(data)
      .then((response) => {
        this.ManyBeneficiaries = response.data?.GetBeneficiaries
        return response.data?.GetBeneficiaries
      })
      .catch((error: CombinedError) => {
        Logic.Common.showError(
          error,
          "Failed to fetch beneficiaries",
          "error-alert"
        )
        return undefined
      })
  }

  public AddAsBeneficiary = async (
    user_uuid: string,
    metadata: string
  ): Promise<Beneficiary | undefined> => {
    return $api.beneficiary
      .AddAsBeneficiary({ metadata, user_uuid })
      .then((response) => {
        return response.data?.AddAsBeneficiary
      })
      .catch((error: CombinedError) => {
        Logic.Common.showError(
          error,
          "Failed to add beneficiary",
          "error-alert"
        )
        return undefined
      })
  }

  public RemoveAsBeneficiary = async (
    beneficiary_uuid: string
  ): Promise<boolean> => {
    return $api.beneficiary
      .RemoveAsBeneficiary({ beneficiary_uuid })
      .then((response) => {
        return response.data?.RemoveAsBeneficiary ?? false
      })
      .catch((error: CombinedError) => {
        Logic.Common.showError(
          error,
          "Failed to remove beneficiary",
          "error-alert"
        )
        return false
      })
  }
}
