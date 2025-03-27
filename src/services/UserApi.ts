import { BaseApiService } from "./common/BaseService"
import { OperationResult } from "urql"
import {
  SignInForm,
  VerifyPhoneOTPForm,
  ResendPhoneOTPForm,
  PersonalizeAccountForm,
  ResendVerifyEmailForm,
  SendResetPasswordEmailForm,
  UpdatePasswordForm,
} from "../logic/types/forms/auth"
import {
  MutationSignUpArgs,
  MutationSignInArgs,
  MutationUpdatePasswordArgs,
  AuthResponse,
  User,
} from "../gql/graphql"

export default class UserApi extends BaseApiService {
  /**
   * @description Verifies a user's OTP for authentication or account activation
   * @by ArchyScript
   * @params user_uuid, otp
   * @response Boolean indicating whether the OTP verification was successful
   */
  public VerifyUsweweerOTP = (data: { user_uuid: string; otp: string }) => {
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
}
