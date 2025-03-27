import { BaseApiService } from "./common/BaseService"
import { OperationResult } from "urql"
import {
  MutationSignUpArgs,
  MutationSignInArgs,
  MutationUpdatePasswordArgs,
  AuthResponse,
  User,
} from "../gql/graphql"

export default class AuthApi extends BaseApiService {
  /**
   * @description Registers a new user with their details
   * @by ArchyScript
   * @params first_name, last_name, email, password, state, country, default_currency
   * @response User object containing uuid, first_name, last_name, email, status, and created_at
   */
  public SignUp = (data: MutationSignUpArgs) => {
    const requestData = `
    mutation SignUp(
      $first_name: String!,
      $last_name: String!,
      $email: String!,
      $password: String!,
      $state: String!,
      $country: String!,
      $default_currency: String!
    ) {
      SignUp(
        first_name: $first_name,
        last_name: $last_name,
        email: $email,
        password: $password,
        state: $state,
        country: $country,
        default_currency: $default_currency
      ) {
        uuid,
        first_name,
        last_name,
        email,
        status,
        created_at
      }
    }
  `

    const response: Promise<OperationResult<{ SignUp: User }>> = this.mutation(
      requestData,
      data
    )

    return response
  }

  /**
   * @description Logs in a user with their credentials
   * @by ArchyScript
   * @params email, password
   * @response User object containing uuid, email, status, and created_at
   */
  public SignIn = (data: MutationSignInArgs) => {
    const requestData = `
    mutation SignIn(
      $email: String!,
      $password: String!
    ) {
      SignIn(
        email: $email,
        password: $password
      ) {
        uuid,
        first_name,
        last_name,
        email,
        status,
        created_at
      }
    }
  `

    const response: Promise<OperationResult<{ SignIn: AuthResponse }>> =
      this.mutation(requestData, data)

    return response
  }

  /**
   * @description Resends the email OTP to verify a user's email
   * @by ArchyScript
   * @params email - The user's email address
   * @response Boolean - Returns true if the OTP was successfully resent, false otherwise
   */
  public ResendEmailOTP = (data: { email: String }) => {
    const requestData = `
    mutation ResendEmailOTP($email: String!) {
      ResendEmailOTP(email: $email)
    }
  `

    const response: Promise<OperationResult<{ ResendEmailOTP: boolean }>> =
      this.mutation(requestData, data)

    return response
  }

  /**
   * @description Sends a reset password OTP to the user's email
   * @by ArchyScript
   * @params email
   * @response Boolean indicating whether the OTP was sent successfully
   */
  public sendResetPasswordOTP = (data: { email: string }) => {
    const requestData = `
      mutation sendResetPasswordOTP($email: String!) {
        sendResetPasswordOTP(email: $email)
      }
    `

    const response: Promise<
      OperationResult<{ sendResetPasswordOTP: boolean }>
    > = this.mutation(requestData, data)
    return response
  }

  /**
   * @description Resets a user's password using OTP verification
   * @by ArchyScript
   * @params user_uuid, otp_code, new_password
   * @response Boolean indicating whether the password reset was successful
   */
  public ResetPassword = (data: {
    user_uuid: string
    otp_code: string
    new_password: string
  }) => {
    const requestData = `
      mutation ResetPassword(
        $user_uuid: String!,
        $otp_code: String!,
        $new_password: String!
      ) {
        ResetPassword(
          user_uuid: $user_uuid,
          otp_code: $otp_code,
          new_password: $new_password
        )
      }
    `

    const response: Promise<OperationResult<{ ResetPassword: boolean }>> =
      this.mutation(requestData, data)

    return response
  }

  /**
   * @description Verifies a user's OTP for authentication or account activation
   * @by ArchyScript
   * @params user_uuid, otp
   * @response Boolean indicating whether the OTP verification was successful
   */
  public VerifyUserOTP = (data: { user_uuid: string; otp: string }) => {
    const requestData = `
      mutation VerifyUserOTP(
        $user_uuid: String!,
        $otp: String!
      ) {
        VerifyUserOTP(
          user_uuid: $user_uuid,
          otp: $otp
        )
      }
    `

    const response: Promise<OperationResult<{ VerifyUserOTP: boolean }>> =
      this.mutation(requestData, data)

    return response
  }

  /**
   * @description Updates a user's password after authentication
   * @by ArchyScript
   * @params current_password, new_password
   * @response Boolean indicating whether the password update was successful
   */
  public UpdatePassword = (data: {
    current_password: string
    new_password: string
  }) => {
    const requestData = `
      mutation UpdatePassword(
        $current_password: String!,
        $new_password: String!
      ) {
        UpdatePassword(
          current_password: $current_password,
          new_password: $new_password
        )
      }
    `

    const response: Promise<OperationResult<{ UpdatePassword: boolean }>> =
      this.mutation(requestData, data)

    return response
  }

  /**
   * @description Saves a push notification token for the authenticated user
   * @by ArchyScript
   * @params device_token, device_type
   * @response Boolean indicating whether the token was saved successfully
   */
  public SavePushNotificationToken = (data: {
    device_token: string
    device_type: string
  }) => {
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
