import {
  MutationMarkNotificationsAsReadArgs,
  MutationSavePushNotificationTokenArgs,
  NotificationPaginator,
} from "../../gql/graphql";
import { $api } from "../../services";
import Common from "./Common";
import { QueryGetNotificationsArgs } from "../../gql/graphql";

export default class NotificationModule extends Common {
  constructor() {
    super();
    this.defineReactiveProperty("ManyNotifications", undefined);
    this.defineReactiveProperty("GetBitificationsPayload", undefined);
  }

  // Base Variables
  public ManyNotifications: NotificationPaginator | undefined;
  public GetBitificationsPayload: QueryGetNotificationsArgs | undefined;

  // Mutation Variables
  public PushNotificationDeviceForm:
    | MutationSavePushNotificationTokenArgs
    | undefined;

  public reset = () => {
    this.ManyNotifications = undefined;
  };

  public GetNotifications = async (first: number, page: number) => {
    return $api.notification
      .GetNotifications("email", first, page)
      .then((response) => {
        this.ManyNotifications = response.data?.GetNotifications;
        return this.ManyNotifications;
      });
  };

  public SavePushNotificationDevice = () => {
    if (this.PushNotificationDeviceForm) {
      return $api.notification
        .SavePushNotificationToken(this.PushNotificationDeviceForm)
        .then(() => {
          return true;
        });
    }
  };

  public MarkNotificationsAsRead = async (
    notificationIds: MutationMarkNotificationsAsReadArgs
  ) => {
    return $api.notification
      .MarkNotificationsAsRead(notificationIds)
      .then(() => {
        if (this.GetBitificationsPayload) {
          this.GetNotifications(10, 1);
        }
      });
  };
}
