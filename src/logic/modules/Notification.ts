import {
  MutationMarkNotificationsAsReadArgs,
  MutationSavePushNotificationTokenArgs,
  NotificationPaginator,
} from "../../gql/graphql"
import { $api } from "../../services"
import Common from "./Common"
import { QueryGetNotificationsArgs } from "../../gql/graphql"

export default class Notification extends Common {
  constructor() {
    super()
  }

  // Base Variables 
  public ManyNotifications: NotificationPaginator | undefined
  public GetBitificationsPayload: QueryGetNotificationsArgs | undefined

  // Mutation Variables 
  public PushNotificationDeviceForm:
    | MutationSavePushNotificationTokenArgs
    | undefined

  public reset = () => {
    this.ManyNotifications = undefined
  }

  // Queries
  public GetNotifications = async (data: QueryGetNotificationsArgs) => {
    return $api.notification.GetNotifications(data).then((response) => {
      this.ManyNotifications = response.data?.GetNotifications
      return this.ManyNotifications
    })
  }

  // Mutations
  public SavePushNotificationDevice = () => {
    if (this.PushNotificationDeviceForm) {
      return $api.notification
        .SavePushNotificationToken(this.PushNotificationDeviceForm)
        .then(() => {
          return true
        })
    }
  }

  public MarkNotificationsAsRead = async (
    notificationIds: MutationMarkNotificationsAsReadArgs
  ) => {
    return $api.notification
      .MarkNotificationsAsRead(notificationIds)
      .then(() => {
        if (this.GetBitificationsPayload) {
          this.GetNotifications(this.GetBitificationsPayload)
        }
      })
  }
}
