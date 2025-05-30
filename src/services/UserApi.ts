import { BaseApiService } from "./common/BaseService"
import { OperationResult } from "urql"
import {
  MutationUpdateProfileArgs,
  User,
  QuerySearchUsersArgs,
  MutationVerifyUserIdentityArgs,
} from "../gql/graphql"

export default class UserApi extends BaseApiService {
  // #region QUERIES
  public SearchUsers = (data: QuerySearchUsersArgs) => {
    const requestData = `
      query SearchUsers($query: String!) {
        SearchUsers(query: $query) {
          uuid
          first_name
          last_name
          username
          profile {
            profile_picture
            verification_status
            default_currency
            user_type
          }
        }
      }
    `

    const response: Promise<
      OperationResult<{
        SearchUsers: User[]
      }>
    > = this.query(requestData, data)

    return response
  }

  public GetSingleUser = (uuid: string) => {
    const requestData = `
      query GetSingleUser($uuid: String!) {
        GetSingleUser(uuid: $uuid) {
          uuid
          first_name
          last_name
          username
          profile {
            profile_picture
            user_type
            business {
              business_name
              logo
              website
            }
          }
        }
      }
    `

    const response: Promise<
      OperationResult<{
        GetSingleUser: User
      }>
    > = this.query(requestData, { uuid })

    return response
  }
  // #endregion QUERIES

  // #region MUTATIONS
  public UpdateProfile = (data: MutationUpdateProfileArgs) => {
    const requestData = `
    mutation UpdateProfile(
      $first_name: String,
      $profile_photo: Upload,
      $last_name: String,
      $default_currency: String,
      $country: String,
      $state: String
    ) {
      UpdateProfile(
        first_name: $first_name,
        profile_photo: $profile_photo,
        last_name: $last_name,
        default_currency: $default_currency,
        country: $country,
        state: $state
      )
    }
  `

    const response: Promise<OperationResult<{ UpdateProfile: boolean }>> =
      this.mutation(requestData, data)

    return response
  }

  public VerifyUserIdentity = (data: MutationVerifyUserIdentityArgs) => {
    const requestData = `
    mutation VerifyUserIdentity(
      $user_uuid: String!,
      $id_type: String!,
      $id_number: String!,
      $id_country: String!
    ) {
      VerifyUserIdentity(
        user_uuid: $user_uuid,
        id_type: $id_type,
        id_number: $id_number,
        id_country: $id_country
      )
    }
  `

    const response: Promise<OperationResult<{ VerifyUserIdentity: boolean }>> =
      this.mutation(requestData, data)

    return response
  }
  // #endregion MUTATIONS
}
