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
  public ResetPasswordForm: MutationResetPasswordArgs | undefined
  public UpdatePasswordForm: MutationUpdatePasswordArgs | undefined
  public VerifyUserOTPayload: MutationVerifyUserOtpArgs | undefined
  public VerifyUserIdentityPayload: MutationVerifyUserIdentityArgs | undefined

  // public ResendVerifyEmailPayload: MutationResendVerifyEmailArgs | undefined
  // public ResetPasswordEmailPayload:
  //   | MutationSendResetPasswordEmailArgs
  //   | undefined
  public UpdatePasswordPayload: MutationUpdatePasswordArgs | undefined

  // Private methods
  private SetUpAuth = (AuthResponse: any | undefined) => {
    if (AuthResponse) {
      this.AccessToken = AuthResponse.token
      this.AuthUser = this.updatedData(this.AuthUser, AuthResponse.user)
      // save to localstorage
      localStorage.setItem(
        "access_token",
        this.AccessToken ? this.AccessToken : ""
      )
      localStorage.setItem("auth_user", JSON.stringify(this.AuthUser))
    }
  }
  private setDefaultAuth = () => {
    this.AccessToken = localStorage.getItem("access_token")
    this.AuthUser = localStorage.getItem("auth_user")
      ? JSON.parse(localStorage.getItem("auth_user") || "{}")
      : undefined
  }

  public GetAuthUser = async (): Promise<User | undefined> => {
    return $api.auth.GetAuthUser().then((response) => {
      this.AuthUser = response.data?.GetAuthUser
      localStorage.setItem("auth_user", JSON.stringify(this.AuthUser))
      return this.AuthUser
    })
  }

  // Mutations
  public SignUp = (
    formIsValid: boolean,
    progressCallback: (progress: number) => void
  ) => {
    if (formIsValid && this.SignUpPayload) {
      Logic.Common.showLoader({ loading: true })
      return $api.auth
        .SignUp(this.SignUpPayload, progressCallback)
        .then((response) => {
          this.AuthUser = response.data?.SignUp
          localStorage.setItem("auth_email", this.SignUpPayload?.email || "")
          Logic.Common.hideLoader()
          return response.data?.SignUp
        })
        .catch((error: CombinedError) => {
          Logic.Common.showError(error, "Oops!", "error-alert")
          throw new Error(error.message)
        })
    }
  }

  public SignIn = (formIsValid: boolean) => {
    if (formIsValid && this.SignInPayload) {
      Logic.Common.showLoader({ loading: true })
      return $api.auth
        .SignIn(this.SignInPayload)
        .then((response) => {
          this.SetUpAuth(response.data?.SignIn)
          this.AuthUser = response.data?.SignIn.user
          return response.data?.SignIn
        })
        .catch((error: CombinedError) => {
          Logic.Common.showError(error, "Oops!", "error-alert")
          throw new Error(error.message)
        })
    }
  }

  public ResendEmailOTP = async (email: string) => {
    return $api.auth
      .ResendEmailOTP({ email })
      .then((response) => {
        if (response.data?.ResendEmailOTP) {
          return response.data.ResendEmailOTP
        }
      })
      .catch((error: CombinedError) => {
        Logic.Common.showError(error, "Oops!", "error-alert")
        throw new Error(error.message)
      })
  }

  public sendResetPasswordOTP = async (
    data: MutationSendResetPasswordOtpArgs
  ) => {
    return $api.auth
      .sendResetPasswordOTP(data)
      .then((response) => {
        if (response.data?.sendResetPasswordOTP) {
          return response.data.sendResetPasswordOTP
        }
      })
      .catch((error: CombinedError) => {
        Logic.Common.showError(error, "Oops!", "error-alert")
        throw new Error(error.message)
      })
  }

  public ResetPassword = async (data: MutationResetPasswordArgs) => {
    return $api.auth
      .ResetPassword(data)
      .then((response) => {
        if (response.data?.ResetPassword) {
          return response.data.ResetPassword
        }
      })
      .catch((error: CombinedError) => {
        Logic.Common.showError(error, "Oops!", "error-alert")
        throw new Error(error.message)
      })
  }

  public UpdatePassword = (formIsValid: boolean) => {
    if (formIsValid && this.UpdatePasswordPayload) {
      Logic.Common.showLoader({ loading: true })
      return $api.auth
        .UpdatePassword(this.UpdatePasswordPayload)
        .then((response) => {
          Logic.Common.hideLoader()
          return response.data?.UpdatePassword
        })
        .catch((error: CombinedError) => {
          Logic.Common.showError(error, "Oops!", "error-alert")
        })
    }
  }

  public VerifyUserOTP = () => {
    if (this.VerifyUserOTPayload) {
      return $api.auth
        .VerifyUserOTP(this.VerifyUserOTPayload)
        .then((response) => {
          if (response.data?.VerifyUserOTP) {
            return response.data.VerifyUserOTP
          }
        })
        .catch((error: CombinedError) => {
          Logic.Common.showError(error, "Oops!", "error-alert")
        })
    }
  }

  public VerifyUserIdentity = () => {
    if (this.VerifyUserIdentityPayload) {
      return $api.auth
        .VerifyUserIdentity(this.VerifyUserIdentityPayload)
        .then((response) => {
          if (response.data?.VerifyUserIdentity) {
            return response.data.VerifyUserIdentity
          }
        })
        .catch((error: CombinedError) => {
          Logic.Common.showError(error, "Verification Failed!", "error-alert")
        })
    }
  }

  public SignOut = () => {
    Logic.Common.showLoader({ loading: true })
    // $api.auth
    //   .SignOut()
    //   .then(() => {
    localStorage.clear()
    Logic.Common.hideLoader()
    Logic.Common.GoToRoute("/auth/login")
    // })
    // .catch((error) => {
    //   Logic.Common.showError(error, "Oops!", "error-alert")
    // })
  }
}
