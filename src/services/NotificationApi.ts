import {
  MutationSavePushNotificationTokenArgs,
  NotificationPaginator,
  MutationMarkNotificationsAsReadArgs,
} from "src/gql/graphql"
import { OperationResult } from "urql"
import { BaseApiService } from "./common/BaseService"

export default class NotificationApi extends BaseApiService {
  // #region QUERIES
  public GetNotifications = (
    page: number,
    count: number,
    orderType = "CREATED_AT",
    order: "ASC" | "DESC" = "DESC",
    whereQuery = ""
  ) => {
    const requestData = `
    query GetNotifications(
      $page: Int!,
      $count: Int! 
    ) {
      GetNotifications( 
        first: $count,
        page: $page,
        orderBy: {
          column: ${orderType ? orderType : "CREATED_AT"},
          order: ${order}
        }
        ${whereQuery ? `where: ${whereQuery}` : ""}
        ) {
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
          type
          category
          title
          content
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
    > = this.query(requestData, {
      page,
      count,
    })

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
