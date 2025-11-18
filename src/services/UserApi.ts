import { BaseApiService } from "./common/BaseService"
import { OperationResult } from "urql"
import {
  MutationUpdateProfileArgs,
  User,
  QuerySearchUsersArgs,
  MutationVerifyUserIdentityArgs,
  QuerySearchBusinessesArgs,
  Business,
  QueryGetBusinessSchedulesArgs,
  BusinessSchedulePaginator,
  BusinessSchedule,
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
          wallet {
            uuid
          }
          businesses {
            uuid
            business_name
            logo
            default_currency
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
           wallet {
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
    `

    const response: Promise<
      OperationResult<{
        GetSingleUser: User
      }>
    > = this.query(requestData, { uuid })

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
          wallet {
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

  public GetBusinessSchedules = (page: number, first: number) => {
    const requestData = `
      query GetBusinessSchedules($first: Int!, $page: Int) {
        GetBusinessSchedules(first: $first, page: $page) {
          data {
            id
            uuid
            business_id
            day_of_week
            is_open
            open_time
            close_time
            break_start_time
            break_end_time
            max_orders_per_hour
            metadata
            created_at
            updated_at
          }
          paginatorInfo {
            count
            currentPage
            firstItem
            hasMorePages
            lastItem
            lastPage
            perPage
            total
          }
        }
      }
    `

    const response: Promise<
      OperationResult<{
        GetBusinessSchedules: BusinessSchedulePaginator
      }>
    > = this.query(requestData, { page, first })

    return response
  }

  public GetBusinessSchedule = (uuid: string) => {
    const requestData = `
      query GetBusinessSchedule($uuid: String!) {
        GetBusinessSchedule(uuid: $uuid) {
              id
            uuid
            business_id
            day_of_week
            is_open
            open_time
            close_time
            break_start_time
            break_end_time
            max_orders_per_hour
            metadata
            created_at
            updated_at
        }
      }
    `

    const response: Promise<
      OperationResult<{
        GetBusinessSchedule: BusinessSchedule
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

  public RetriggerVerification = () => {
    const requestData = `
      mutation RetriggerVerification {
        RetriggerVerification {
          auth_user_id
          verification_id
          previous_status
          current_status
          status_changed
          smile_id_result {
            status
            description
          }
        }
      }
    `

    const response: Promise<
      OperationResult<{
        RetriggerVerification: {
          auth_user_id: number
          verification_id: number
          previous_status: string
          current_status: string
          status_changed: boolean
          smile_id_result: {
            status: string
            description: string
          }
        }
      }>
    > = this.mutation(requestData, {})

    return response
  }

  public UploadFile = (file: File) => {
    const requestData = `
      mutation UploadFile($file: Upload!) {
        UploadFile(file: $file)
      }
    `

    const response: Promise<
      OperationResult<{
        UploadFile: string
      }>
    > = this.mutation(requestData, { file })

    return response
  }
  // #endregion MUTATIONS
}
