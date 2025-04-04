import {
  MutationSavePushNotificationTokenArgs,
  NotificationPaginator,
} from "src/gql/graphql"
import { OperationResult } from "urql"
import { BaseApiService } from "./common/BaseService"

export default class NotificationApi extends BaseApiService {
  // Query
  public GetNotifications = (first: number, page: number) => {
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
    > = this.query(requestData, {
      first,
      page,
    })

    return response
  }

  // Mutations
  public MarkNotificationsAsRead = (notificationIds: number[]) => {
    const requestData = `
      mutation MarkNotificationsAsRead($notificationIds: [Int!]!) {
        MarkNotificationsAsRead(notification_ids: $notificationIds)
      }
		`

    const response: Promise<
      OperationResult<{
        MarkNotificationsAsRead: Boolean
      }>
    > = this.mutation(requestData, {
      notificationIds,
    })

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
}
