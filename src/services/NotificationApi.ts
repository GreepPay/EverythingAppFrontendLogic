import {
  MutationSavePushNotificationTokenArgs,
  NotificationPaginator,
  QueryGetNotificationsArgs,
  MutationMarkNotificationsAsReadArgs,
} from "src/gql/graphql"
import { OperationResult } from "urql"
import { BaseApiService } from "./common/BaseService"

export default class NotificationApi extends BaseApiService {
  // #region QUERIES
  public GetNotifications = (type: string, first: number, page: number) => {
    const requestData = `
      query GetNotifications($type: String!, $first: Int!, $page: Int ) {
        GetNotifications(  type: $type, first: $first, page: $page) {
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
          data {
            id
            auth_user_id
            type
            title
            content
            email
            is_read
            delivery_status
            created_at
            updated_at
          }
        }
      }
		`

    const response: Promise<
      OperationResult<{
        GetNotifications: NotificationPaginator
      }>
    > = this.query(requestData, { type, first, page })

    return response
  }
  // #endregion QUERIES

  // #region MUTATIONS
  public MarkNotificationsAsRead = (
    data: MutationMarkNotificationsAsReadArgs
  ) => {
    const requestData = `
      mutation MarkNotificationsAsRead($notificationIds: [Int!]!) {
        MarkNotificationsAsRead(notification_ids: $notificationIds)
      }
		`

    const response: Promise<
      OperationResult<{
        MarkNotificationsAsRead: Boolean
      }>
    > = this.mutation(requestData, data)

    return response
  }

  public SavePushNotificationToken = (
    data: MutationSavePushNotificationTokenArgs
  ) => {
    const requestData = `
      mutation SavePushNotificationToken(
        $deviceToken: String!
        $deviceType: String!
      ) {
        SavePushNotificationToken(
          device_token: $deviceToken
          device_type: $deviceType
        )
      }
		`

    const response: Promise<
      OperationResult<{
        SavePushNotificationToken: Boolean
      }>
    > = this.mutation(requestData, data)

    return response
  }
  // #endregion MUTATIONS
}
