import { BaseApiService } from "./common/BaseService"
import { OperationResult } from "urql"
import {
  MutationUpdateProfileArgs,
  MutationSavePushNotificationTokenArgs,
  User,
  QuerySearchUsersArgs,
} from "../gql/graphql"

export default class UserApi extends BaseApiService {
  // #region QUERIES
  /**
   * @description Searches for users based on a query string (name, email, or phone).
   * @params query - The search keyword used to find users.
   * @response An array of User objects containing user details.
   */
  public SearchUsers = (data: QuerySearchUsersArgs) => {
    const requestData = `
      query SearchUsers($query: String!) {
        SearchUsers(query: $query) {
          uuid
          first_name
          last_name
          email
          email_verified_at
          phone
          phone_verified_at
          username
          status
          created_at
          updated_at
          profile {
            profile_picture
            verification_status
            default_currency
          }
          wallet {
            cash_per_point
            cash_point_balance
            credited_amount
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

  // #endregion QUERIES

  // #region MUTATIONS
  /**
   * @description Updates a user's profile with provided details.
   * @params first_name, profile_photo, last_name, default_currency, country, state
   * @response Boolean indicating success or failure
   */
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

  
  // #endregion MUTATIONS
}
