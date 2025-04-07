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
  public GetNotifications = (data: QueryGetNotificationsArgs) => {
    const requestData = `
      query GetNotifications($first: Int!, $page: Int) {
        GetNotifications(first: $first, page: $page) {
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
            content
            created_at
            delivery_status
            email
            id
            is_read
            title
            type
          }
        }
      }
		`

    const response: Promise<
      OperationResult<{
        GetNotifications: NotificationPaginator
      }>
    > = this.query(requestData, data)

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
