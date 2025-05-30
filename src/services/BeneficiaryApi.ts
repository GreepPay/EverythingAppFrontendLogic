import { BaseApiService } from "./common/BaseService"
import { OperationResult } from "urql"
import {
  MutationAddAsBeneficiaryArgs,
  Beneficiary,
  MutationRemoveAsBeneficiaryArgs,
  BeneficiaryPaginator,
  QueryGetBeneficiariesArgs,
} from "../gql/graphql"

export default class BeneficiaryApi extends BaseApiService {
  // #region QUERIES
  public GetBeneficiaries = (data: QueryGetBeneficiariesArgs) => {
    const requestData = `
      query GetBeneficiaries($first: Int!, $page: Int) {
        GetBeneficiaries(first: $first, page: $page) {
          data {
            id
            beneficiary {
              uuid
              first_name
              last_name
              username
              email
              phone
              email_verified_at
              phone_verified_at
              status
              profile {
                created_at
                auth_user_id
                default_currency
              }
              wallet {
                cash_per_point
                cash_point_balance
              }
              created_at
              updated_at
            }
            metadata
            state
            created_at
            updated_at
            owner {
              uuid
              first_name
              last_name
              username
              email
              phone
              email_verified_at
              phone_verified_at
              status
              profile {
                created_at
                auth_user_id
                default_currency
              }
              wallet {
                cash_per_point
                cash_point_balance
              }
              created_at
              updated_at
            }
          }
          paginatorInfo {
            count
            currentPage
            firstItem
            hasMorePages
            lastItem
            lastPage
            perPage
            total
          }
        }
      }
    `

    const response: Promise<
      OperationResult<{
        GetBeneficiaries: BeneficiaryPaginator
      }>
    > = this.query(requestData, data)

    return response
  }
  // #endregion QUERIES

  // #region MUTATIONS
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
  // #endregion MUTATIONS
}
