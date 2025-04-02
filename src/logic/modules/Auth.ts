import { $api } from "../../services"
import { CombinedError } from "urql"
import Common from "./Common"
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
} from "../../gql/graphql"
import { Logic } from ".."

export default class Auth extends Common {
  constructor() {
    super()
    this.setDefaultAuth()
  }

  // Base variables
  public AccessToken: string | null = null
  public AuthUser: User | undefined = undefined

  // mutation payloads
  public SignUpPayload: MutationSignUpArgs | undefined
  public SignInPayload: MutationSignInArgs | undefined
  // public ResendVerifyEmailPayload: MutationResendVerifyEmailArgs | undefined
  // public ResetPasswordEmailPayload:
  //   | MutationSendResetPasswordEmailArgs
  //   | undefined
  // public UpdatePasswordPayload: MutationUpdatePasswordArgs | undefined
  public VerifyUserOtpPayload: MutationVerifyUserOtpArgs | undefined

  public setDefaultAuth = () => {
    this.AccessToken = localStorage.getItem("access_token")
    const authUserString = localStorage.getItem("auth_user") // Ensure a valid JSON string
    this.AuthUser =
      authUserString && authUserString !== "undefined"
        ? JSON.parse(authUserString)
        : undefined

    console.log("AuthUser", this.AuthUser)
  }

  // Queries
  // public GetAuthUser = () => {
  //   return $api.auth.GetAuthUser().then((response) => {
  //     if (response.data?.AuthUser) {
  //       this.AuthUser = response.data?.AuthUser
  //       localStorage.setItem("auth_user", JSON.stringify(this.AuthUser))
  //       localStorage.setItem("account_type", this.AuthUser.profile.type)
  //     } else {
  //       localStorage.removeItem("auth_user")
  //       Logic.Common.GoToRoute("/auth/login")
  //     }
  //     return response.data
  //   })
  // }

  // Mutations
  private SetUpAuth = (AuthResponse: any | undefined) => {
    if (AuthResponse) {
      this.AccessToken = AuthResponse.token
      this.AuthUser = AuthResponse.user
      localStorage.setItem("access_token", this.AccessToken || "")
      localStorage.setItem("auth_user", JSON.stringify(this.AuthUser))
    }
  }

  public SignUp = (formIsValid: boolean) => {
    if (formIsValid && this.SignUpPayload) {
      Logic.Common.showLoader({ loading: true })
      return $api.auth
        .SignUp(this.SignUpPayload)
        .then((response) => {
          this.AuthUser = response.data?.SignUp
          localStorage.setItem("auth_email", this.SignUpPayload?.email || "")
          Logic.Common.hideLoader()
          return response.data?.SignUp
        })
        .catch((error: CombinedError) => {
          Logic.Common.showError(error, "Oops!", "error-alert")
        })
    }
  }

  public SignIn = (formIsValid: boolean) => {
    console.log("formIsValid", formIsValid)

    if (formIsValid && this.SignInPayload) {
      // Logic.Common.showLoader({ loading: true })
      return $api.auth
        .SignIn(this.SignInPayload)
        .then((response) => {
          console.log("response from module", response)
          this.SetUpAuth(response.data?.SignIn)
          this.AuthUser = response.data?.SignIn.user

          // this.GetAuthUser().then(() => {
          //   location.href = "/"
          //   Logic.Common.hideLoader()
          // })
          return response.data?.SignIn
        })
        .catch((error: CombinedError) => {
          console.error("error dey shha")
          // console.error("error from module", error)
          // Logic.Common.showError(error, "Oops!", "error-alert")
        })
    }
  }

  // public ResendVerifyEmail = () => {
  //   Logic.Common.showLoader({ loading: true })
  //   if (this.ResendVerifyEmailPayload) {
  //     return $api.auth
  //       .ResendVerifyEmail(this.ResendVerifyEmailPayload)
  //       .then((response) => {
  //         Logic.Common.hideLoader()
  //         return response.data?.ResendVerifyEmail
  //       })
  //       .catch((error: CombinedError) => {
  //         Logic.Common.showError(error, "Oops!", "error-alert")
  //       })
  //   }
  // }

  // public SendResetPasswordEmail = (formIsValid: boolean) => {
  //   if (formIsValid && this.ResetPasswordEmailPayload) {
  //     Logic.Common.showLoader({ loading: true })
  //     return $api.auth
  //       .SendResetPasswordEmail(this.ResetPasswordEmailPayload)
  //       .then((response) => {
  //         Logic.Common.hideLoader()
  //         return response.data?.SendResetPasswordEmail
  //       })
  //       .catch((error: CombinedError) => {
  //         Logic.Common.showError(error, "Oops!", "error-alert")
  //       })
  //   }
  // }

  // public UpdatePassword = (formIsValid: boolean) => {
  //   if (formIsValid && this.UpdatePasswordPayload) {
  //     Logic.Common.showLoader({ loading: true })
  //     return $api.auth
  //       .UpdatePassword(this.UpdatePasswordPayload)
  //       .then((response) => {
  //         Logic.Common.hideLoader()
  //         return response.data?.UpdatePassword
  //       })
  //       .catch((error: CombinedError) => {
  //         Logic.Common.showError(error, "Oops!", "error-alert")
  //       })
  //   }
  // }

  public VerifyUserOTP = (formIsValid: boolean) => {
    if (formIsValid && this.VerifyUserOtpPayload) {
      Logic.Common.showLoader({ loading: true })

      this.VerifyUserOtpPayload.user_uuid = this.AuthUser?.uuid as string

      console.log("VerifyUserOtpPayload", this.VerifyUserOtpPayload)
      console.log("this.AuthUser", this.AuthUser)

      return $api.auth
        .VerifyUserOTP(this.VerifyUserOtpPayload)
        .then((response) => {
          // this.AuthUser = response.data?.VerifyUserOTP
          // Logic.Common.hideLoader()
          console.log(response.data?.VerifyUserOTP)

          return response.data?.VerifyUserOTP
        })
        .catch((error: CombinedError) => {
          console.log("error", error)
          // Logic.Common.showError(error, "Oops!", "Something went wrong")
        })
    }
  }

  // public SignOut = () => {
  //   Logic.Common.showLoader({ loading: true })
  //   $api.auth
  //     .SignOut()
  //     .then(() => {
  //       localStorage.removeItem("AuthTokens")
  //       localStorage.removeItem("access_token")
  //       localStorage.removeItem("auth_user")
  //       Logic.Common.hideLoader()
  //       Logic.Common.GoToRoute("/auth/login")
  //     })
  //     .catch((error) => {
  //       Logic.Common.showError(error, "Oops!", "error-alert")
  //     })
  // }
}
