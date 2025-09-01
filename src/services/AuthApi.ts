import { BaseApiService } from "./common/BaseService";
import { OperationResult } from "urql";
import {
  MutationSignUpArgs,
  MutationSignInArgs,
  MutationUpdatePasswordArgs,
  MutationVerifyUserOtpArgs,
  MutationResetPasswordArgs,
  MutationSendResetPasswordOtpArgs,
  MutationResendEmailOtpArgs,
  MutationVerifyUserIdentityArgs,
  AuthResponse,
  User,
} from "../gql/graphql";

export default class AuthApi extends BaseApiService {
  // #region QUERIES
  public GetAuthUser = () => {
    const requestData = `
        query GetAuthUser {
          GetAuthUser {
           id
            uuid
            first_name
            last_name
            email
            phone
            email_verified_at
            phone_verified_at
            username
            transaction_pin
            profile {
              profile_picture
              verification_status
              default_currency
              country_code
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
            uuid
              currency
              credited_point_amount
              credited_amount
              created_at
              cash_point_balance
              cash_per_point
              debited_amount
              debited_point_amount
              locked_balance
              point_balance
              total_balance
              id
            }
          }
        }
      `;

    const response: Promise<
      OperationResult<{
        GetAuthUser: User;
      }>
    > = this.query(requestData, {});

    return response;
  };
  //

  // #region MUTATIONS
  public SignUp = (data: MutationSignUpArgs) => {
    const requestData = `
    mutation SignUp(
      $first_name: String!,
      $last_name: String!,
      $email: String!,
      $password: String!,
      $state: String!,
      $country: String!,
      $default_currency: String!,
      $country_code: String!,
      $profile_picture: Upload
      $sso_id: String
    ) {
      SignUp(
        first_name: $first_name,
        last_name: $last_name,
        email: $email,
        password: $password,
        state: $state,
        country: $country,
        default_currency: $default_currency,
        country_code: $country_code,
        profile_picture: $profile_picture,
        sso_id: $sso_id
      ) { 
        id
        uuid
        first_name
        last_name
        username
        email
        phone
        status
        email_verified_at
        profile {
          auth_user_id
          user_type
          profile_picture
          verification_status
          updated_at
          default_currency
          country_code
          created_at
        }
        created_at
        updated_at
      }
    }
  `;

    const response: Promise<OperationResult<{ SignUp: User }>> = this.mutation(
      requestData,
      data
    );

    return response;
  };

  public SignIn = (data: MutationSignInArgs) => {
    const requestData = `
    mutation SignIn(
      $email: String!,
      $password: String,
      $sso_id: String
    ) {
      SignIn(
        email: $email,
        password: $password,
        sso_id: $sso_id
      ) {
        token
        user {
          uuid
          first_name
          last_name
          username
          email
          phone
          status
          email_verified_at
          profile {
            auth_user_id
            user_type
            profile_picture
            verification_status
            updated_at
            default_currency
            country_code
            created_at
          }
          created_at
          updated_at
        }
      }
    }
  `;

    const response: Promise<OperationResult<{ SignIn: AuthResponse }>> =
      this.mutation(requestData, data);

    return response;
  };

  public ResendEmailOTP = (data: MutationResendEmailOtpArgs) => {
    const requestData = `
    mutation ResendEmailOTP($email: String!) {
      ResendEmailOTP(email: $email)
    }
  `;
    const response: Promise<OperationResult<{ ResendEmailOTP: boolean }>> =
      this.mutation(requestData, data);

    return response;
  };

  public SendResetPasswordOTP = (data: MutationSendResetPasswordOtpArgs) => {
    const requestData = `
      mutation SendResetPasswordOTP($email: String!) {
        SendResetPasswordOTP(email: $email)
      }
    `
    console.log(
      "helloe"
    )

    const response: Promise<
      OperationResult<{ SendResetPasswordOTP: string }>
    > = this.mutation(requestData, data)
    return response
  }

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
    `;

    const response: Promise<OperationResult<{ ResetPassword: boolean }>> =
      this.mutation(requestData, data);

    return response;
  };

  public VerifyUserIdentity = (data: MutationVerifyUserIdentityArgs) => {
    const requestData = `
    mutation VerifyUserIdentity(
      $user_uuid: String!
      $id_type: String!
      $id_number: String!
      $id_country: String!
      $full_name: String!
      $phone_number: String!
      $date_of_birth: String!
      $address: String!
      $additional_ids: [AdditionalIdInput!]
      $checks: VerifyChecksInput!
    ) {
      VerifyUserIdentity(
        user_uuid: $user_uuid
        id_type: $id_type
        id_number: $id_number
        id_country: $id_country
        full_name: $full_name
        phone_number: $phone_number
        date_of_birth: $date_of_birth
        address: $address
        additional_ids: $additional_ids
        checks: $checks
      )
    }
  `

    const response: Promise<OperationResult<{ VerifyUserIdentity: boolean }>> =
      this.mutation(requestData, data)

    return response
  }

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
    `;

    const response: Promise<OperationResult<{ VerifyUserOTP: boolean }>> =
      this.mutation(requestData, data);

    return response;
  };

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
    `;

    const response: Promise<OperationResult<{ UpdatePassword: boolean }>> =
      this.mutation(requestData, data);

    return response;
  };

  public DeleteUser = () => {
    const requestData = `
    mutation DeleteUser {
      DeleteUser
    }
  `

    const response: Promise<OperationResult<{ DeleteUser: boolean }>> =
      this.mutation(requestData, {})

    return response
  }

  public SignOut = () => {
    const requestData = `
    mutation SignOut {
       SignOut
    }
  `;

    const response: Promise<OperationResult<{ SignOut: boolean }>> =
      this.mutation(requestData, {});

    return response;
  };
  // #endregion MUTATIONS
}
