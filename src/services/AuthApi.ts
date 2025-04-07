import { BaseApiService } from "./common/BaseService"
import { OperationResult } from "urql"
import {
  MutationSignUpArgs,
  MutationSignInArgs,
  MutationUpdatePasswordArgs,
  MutationVerifyUserIdentityArgs,
  MutationVerifyUserOtpArgs,
  MutationResetPasswordArgs,
  MutationSendResetPasswordOtpArgs,
  MutationResendEmailOtpArgs,
  AuthResponse,
  User,
} from "../gql/graphql"

export default class AuthApi extends BaseApiService {
  // #region QUERIES
  /**
   * @description Retrieves the authenticated user's information, including profile, contact details, status, and wallet balances.
   * @response Object containing user details such as profile information, contact details, status, and wallet balances.
   */
  public GetAuthUser = () => {
    const requestData = `
      query GetAuthUser {
        GetAuthUser {
          uuid
          first_name
          last_name
          phone
          email_verified_at
          phone_verified_at
          username
          profile {
            profile_picture
            verification_status
            default_currency
             customer {
              city
              country
              created_at
              id
              location
              notification_preferences
              passport
              resident_permit
              student_id
              updated_at
            }
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
        GetAuthUser: User
      }>
    > = this.query(requestData, {})

    return response
  }
  // #endregion QUERIES

  // #region MUTATIONS
  /**
   * @description Registers a new user with their details
   * @params first_name, last_name, email, password, state, country, default_currency
   * @response User object containing uuid, first_name, last_name, email, status, and created_at
   */
  public SignUp = (
    data: MutationSignUpArgs,
    progressCallback: (progress: number) => void
  ) => {
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

    // const response: Promise<OperationResult<{ SignUp: User }>> = this.mutation(
    //   requestData,
    //   data
    // )

    const response: Promise<
      OperationResult<{
        SignUp: User
      }>
    > = this.mutationWithProgress(requestData, data, progressCallback)

    return response
  }

  /**
   * @description Logs in a user with their credentials
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
         token
		user {
			uuid
			first_name
			last_name
			email
			username
			phone
			email_verified_at
			phone_verified_at
			status  
		}
		}
    }
  `

    const response: Promise<OperationResult<{ SignIn: AuthResponse }>> =
      this.mutation(requestData, data)

    return response
  }

  /**
   * @description Resends the email OTP to verify a user's email
   * @params email - The user's email address
   * @response Boolean - Returns true if the OTP was successfully resent, false otherwise
   */
  public ResendEmailOTP = (data: MutationResendEmailOtpArgs) => {
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
   * @params email
   * @response Boolean indicating whether the OTP was sent successfully
   */
  public sendResetPasswordOTP = (data: MutationSendResetPasswordOtpArgs) => {
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
   * @params user_uuid, otp_code, new_password
   * @response Boolean indicating whether the password reset was successful
   */
  public ResetPassword = (data: MutationResetPasswordArgs) => {
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
   * @params user_uuid, otp
   * @response Boolean indicating whether the OTP verification was successful
   */
  public VerifyUserOTP = (data: MutationVerifyUserOtpArgs) => {
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
   * @params current_password, new_password
   * @response Boolean indicating whether the password update was successful
   */
  public UpdatePassword = (data: MutationUpdatePasswordArgs) => {
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
   * @description Verifies a user's identity.
   * @params user_uuid, id_type, id_number, id_country
   * @response Boolean indicating success or failure
   */
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
