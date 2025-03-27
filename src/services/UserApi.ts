import { BaseApiService } from "./common/BaseService"
import { OperationResult } from "urql" 
import {
  MutationUpdateProfileArgs,
  MutationSavePushNotificationTokenArgs, 
} from "../gql/graphql"

export default class UserApi extends BaseApiService {
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

  /**
   * @description Saves a push notification token for the authenticated user.
   * @params device_token, device_type
   * @response Boolean indicating success or failure
   */
  public SavePushNotificationToken = (
    data: MutationSavePushNotificationTokenArgs
  ) => {
    const requestData = `
    mutation SavePushNotificationToken(
      $device_token: String!,
      $device_type: String!
    ) {
      SavePushNotificationToken(
        device_token: $device_token,
        device_type: $device_type
      )
    }
  `

    const response: Promise<
      OperationResult<{ SavePushNotificationToken: boolean }>
    > = this.mutation(requestData, data)

    return response
  }
}
