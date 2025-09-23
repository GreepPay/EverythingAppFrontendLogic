import { BaseApiService } from "./common/BaseService";
import { OperationResult } from "urql";
import {
  MutationUpdateProfileArgs,
  User,
  QuerySearchUsersArgs,
  MutationVerifyUserIdentityArgs,
  QuerySearchBusinessesArgs,
  Business,
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
            country_code
            user_type
          }
          businesses {
            uuid
            business_name
            logo
            default_currency
          }
        }
      }
    `;

    const response: Promise<
      OperationResult<{
        SearchUsers: User[];
      }>
    > = this.query(requestData, data);

    return response;
  };

  public SearchBusiness = (data: QuerySearchBusinessesArgs) => {
    const requestData = `
      query SearchBusinesses($query: String!) {
        SearchBusinesses(query: $query) {
           uuid
           business_name
           user {
             uuid
             }
           logo
           default_currency
        }
      }
    `;

    const response: Promise<
      OperationResult<{
        SearchBusinesses: Business[];
      }>
    > = this.query(requestData, data);

    return response;
  };

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
            default_currency
            country_code
            user_type
          }
          businesses {
            uuid
            business_name
            logo
            default_currency
          }
        }
      }
    `;

    const response: Promise<
      OperationResult<{
        GetSingleUser: User;
      }>
    > = this.query(requestData, { uuid });

    return response
  }

  public SearchBusinesses = (data: QuerySearchBusinessesArgs) => {
    const requestData = `
      query SearchBusinesses($query: String!) {
        SearchBusinesses(query: $query) { 
          logo
          business_name
          description
          default_currency
          user {
            uuid
          }
        }
      }
    `

    const response: Promise<
      OperationResult<{
        SearchBusinesses: Business[]
      }>
    > = this.query(requestData, data)

    return response
  }

  // #endregion QUERIES

  // #region MUTATIONS
  public UpdateProfile = (data: MutationUpdateProfileArgs) => {
    const requestData = `
    mutation UpdateProfile(
      $first_name: String,
      $last_name: String,
      $profile_photo: Upload,
      $default_currency: String,
      $country: String,
      $auth_passcode: String,
      $country_code: String,
      $state: String
    ) {
      UpdateProfile(
        first_name: $first_name,
        profile_photo: $profile_photo,
        last_name: $last_name,
        default_currency: $default_currency,
        country_code: $country_code,
        country: $country,
        state: $state
        auth_passcode: $auth_passcode
      )
    }
  `;

    const response: Promise<OperationResult<{ UpdateProfile: boolean }>> =
      this.mutation(requestData, data);

    return response;
  };

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
  `;

    const response: Promise<OperationResult<{ VerifyUserIdentity: boolean }>> =
      this.mutation(requestData, data);

    return response;
  };
  // #endregion MUTATIONS
}
