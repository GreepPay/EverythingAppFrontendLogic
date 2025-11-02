import {
  MutationSavePushNotificationTokenArgs,
  Notification,
  NotificationPaginator,
  PaginatorInfo,
  QueryGetNotificationsArgs,
} from "../../gql/graphql"
import { $api } from "../../services"
import Common from "./Common"
import { PushNotifications } from "@capacitor/push-notifications"
import { getPlatforms } from "@ionic/vue"

export default class NotificationModule extends Common {
  constructor() {
    super()
    this.defineReactiveProperty("ManyNotifications", undefined)
    this.defineReactiveProperty("GetBitificationsPayload", undefined)
  }

  // Base Variables
  public UnreadNotification = 0
  public NotificationsPaginationInfo: PaginatorInfo | undefined
  public ManyNotifications: Notification[] | undefined
  public GetBitificationsPayload: QueryGetNotificationsArgs | undefined

  // Mutation Variables
  public PushNotificationDeviceForm:
    | MutationSavePushNotificationTokenArgs
    | undefined

  public reset = () => {
    this.ManyNotifications = undefined
  }

  public GetNotifications = async (
    page: number,
    count: number,
    orderType = "CREATED_AT",
    order: "DESC" | "ASC" = "DESC",
    whereQuery = "",
    channel: "email" | "push" | "all" = "email",
    isLoadMore = false
  ) => {
    return $api.notification
      .GetNotifications(page, count, orderType, order, whereQuery, channel)
      .then((response) => {
        if (!isLoadMore) {
          this.ManyNotifications = response.data?.GetNotifications?.data || []
        } else {
          this.ManyNotifications?.push(
            ...(response.data?.GetNotifications?.data || [])
          )
        }

        this.NotificationsPaginationInfo =
          response.data?.GetNotifications?.paginatorInfo || undefined

        return this.ManyNotifications
      })
  }

  public SavePushNotificationDevice = () => {
    if (this.PushNotificationDeviceForm) {
      return $api.notification
        .SavePushNotificationToken(this.PushNotificationDeviceForm)
        .then(() => {
          return true
        })
    }
  }

  public MarkNotificationsAsRead = async (notificationIds: number[]) => {
    return $api.notification
      .MarkNotificationsAsRead(notificationIds)
      .then(() => {
        this.GetNotifications(1, 10)
      })
  }

  public addListeners = async () => {
    await PushNotifications.removeAllListeners()

    await PushNotifications.addListener("registration", (token) => {
      this.PushNotificationDeviceForm = {
        device_token: token.value,
        device_type: getPlatforms()[0],
      }
      this.SavePushNotificationDevice()
    })

    await PushNotifications.addListener("registrationError", (_err) => {
      // handle error here
    })

    await PushNotifications.addListener("pushNotificationReceived", () => {
      // handle push notification
      this.UnreadNotification++
      // Logic.User.SaveUserActivity("Push Notification Received", "action");
    })

    await PushNotifications.addListener(
      "pushNotificationActionPerformed",
      (notification) => {
        // handle notification click

        const uuid = notification.notification.data.uuid

        this.MarkNotificationsAsRead([uuid])

        // Logic.User.SaveUserActivity("Push Notification Clicked", "action");
      }
    )
  }

  public registerNotifications = async () => {
    // set unread notification container

    if (localStorage.getItem("unread_notification") == null) {
      localStorage.setItem("unread_notification", "0")
    }

    let permStatus = await PushNotifications.checkPermissions()

    if (permStatus.receive === "prompt") {
      permStatus = await PushNotifications.requestPermissions()
    }

    if (permStatus.receive !== "granted") {
      console.error("User denied permissions!")
    }

    await PushNotifications.register()
  }

  public getDeliveredNotifications = async () => {
    const notificationList = await PushNotifications.getDeliveredNotifications()
    console.log("delivered notifications", notificationList)
  }
}
