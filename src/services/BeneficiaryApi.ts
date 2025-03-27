import { BaseApiService } from "./common/BaseService"
import { OperationResult } from "urql"
import {
  MutationAddAsBeneficiaryArgs,
  Beneficiary,
  MutationRemoveAsBeneficiaryArgs, 
} from "../gql/graphql"

export default class BeneficiaryApi extends BaseApiService {
  /**
   * @description Adds a user as a beneficiary with the provided metadata.
   * @params user_uuid, metadata
   * @response Beneficiary object containing the added beneficiary's details
   */
  public AddAsBeneficiary = (data: MutationAddAsBeneficiaryArgs) => {
    const requestData = `
    mutation AddAsBeneficiary(
      $user_uuid: String!,
      $metadata: String!
    ) {
      AddAsBeneficiary(
        user_uuid: $user_uuid,
        metadata: $metadata
      ) {
        uuid
        user_uuid
        metadata
        created_at
      }
    }
  `

    const response: Promise<
      OperationResult<{ AddAsBeneficiary: Beneficiary }>
    > = this.mutation(requestData, data)

    return response
  }

  /**
   * @description Removes a user from the list of beneficiaries.
   * @params beneficiary_uuid
   * @response Boolean indicating success or failure
   */
  public RemoveAsBeneficiary = (data: MutationRemoveAsBeneficiaryArgs) => {
    const requestData = `
    mutation RemoveAsBeneficiary(
      $beneficiary_uuid: String!
    ) {
      RemoveAsBeneficiary(
        beneficiary_uuid: $beneficiary_uuid
      )
    }
  `

    const response: Promise<OperationResult<{ RemoveAsBeneficiary: boolean }>> =
      this.mutation(requestData, data)

    return response
  }
}
