import {
  Business as BusinessModel,
  DeliveryAddressPaginator,
  MutationUpdateProfileArgs,
  BusinessSchedulePaginator,
  User as UserModel,
  BusinessSchedule,
  AccountTier,
} from "../../gql/graphql";
import { $api } from "../../services";
import Common from "./Common";
import { CombinedError } from "urql";
import { Logic } from "..";

export default class User extends Common {
  constructor() {
    super();
    this.defineReactiveProperty("SearchedUsers", undefined);
    this.defineReactiveProperty("SearchedBusinesses", undefined);
    this.defineReactiveProperty("SingleUser", undefined);
    this.defineReactiveProperty("ManyP2PDeliveryAddresses", undefined);
    this.defineReactiveProperty("VerificationRetryInfo", undefined);
    this.defineReactiveProperty("BusinessSchedules", undefined);
    this.defineReactiveProperty("BusinessSchedule", undefined);
    this.defineReactiveProperty("ManyAccountTiers", undefined);
  }

  // Base variables
  public SearchedUsers: UserModel[] | undefined;
  public SingleUser: UserModel | undefined;
  public SearchedBusinesses: BusinessModel[] | undefined;
  public BusinessSchedules: BusinessSchedulePaginator | undefined;
  public BusinessSchedule: BusinessSchedule | undefined;
  public ManyP2PDeliveryAddresses: DeliveryAddressPaginator | undefined;
  public ManyAccountTiers: AccountTier[] | undefined;
  public VerificationRetryInfo:
    | {
        auth_user_id: number;
        verification_id: number;
        previous_status: string;
        current_status: string;
        status_changed: boolean;
        smile_id_result: {
          status: string;
          description: string;
        };
      }
    | undefined;

  //
  public UpdateProfileForm: MutationUpdateProfileArgs | undefined;

  // Query
  public SearchForUsers = async (query: string) => {
    return $api.user
      .SearchUsers({
        query,
      })
      .then((response) => {
        this.SearchedUsers = response.data?.SearchUsers;
        return response.data?.SearchUsers;
      });
  };

  public SearchForBusinesses = async (query: string) => {
    return $api.user
      .SearchBusinesses({
        query,
      })
      .then((response) => {
        this.SearchedBusinesses = response.data?.SearchBusinesses;
        return response.data?.SearchBusinesses;
      });
  };

  public GetAllAccountTiers = async (): Promise<AccountTier[] | undefined> => {
    return $api.user.GetAllAccountTiers().then((response) => {
      this.ManyAccountTiers = response.data?.GetAccountTiers;
      return response.data?.GetAccountTiers;
    });
  };

  public GetSingleUser = async (
    uuid: string
  ): Promise<UserModel | undefined> => {
    return $api.user.GetSingleUser(uuid).then((response) => {
      this.SingleUser = response.data?.GetSingleUser;
      return response.data?.GetSingleUser;
    });
  };

  public GetP2PDeliveryAddresses = async (
    page: number,
    count: number,
    orderType = "CREATED_AT",
    order = "DESC" as "DESC" | "ASC",
    whereQuery = ""
  ) => {
    return $api.delivery
      .GetP2PDeliveryAddresses(page, count, orderType, order, whereQuery)
      .then((response) => {
        this.ManyP2PDeliveryAddresses = response.data?.GetP2PDeliveryAddresses;
        return response.data?.GetP2PDeliveryAddresses;
      });
  };

  public GetBusinessSchedules = async (
    page: number = 1,
    first: number = 10
  ) => {
    return $api.user
      .GetBusinessSchedules(first, page, "CREATED_AT", "DESC", ``)
      .then((response) => {
        if (response.data?.GetBusinessSchedules) {
          this.BusinessSchedules = response.data.GetBusinessSchedules;
          return response.data.GetBusinessSchedules;
        }
      })
      .catch((error: CombinedError) => {
        Logic.Common.showError(
          error,
          "Failed to load schedules",
          "error-alert"
        );
        throw error;
      });
  };

  public GetBusinessSchedulesByBusinessUUID = async (
    business_uuid: string
  ): Promise<BusinessSchedulePaginator | undefined> => {
    return $api.user
      .GetBusinessSchedules(1, 50, "CREATED_AT", "DESC", ``, business_uuid)
      .then((response) => {
        if (response.data?.GetBusinessSchedules) {
          this.BusinessSchedules = response.data.GetBusinessSchedules;
          return response.data.GetBusinessSchedules;
        }
      })
      .catch((error: CombinedError) => {
        Logic.Common.showError(
          error,
          "Failed to load schedules",
          "error-alert"
        );
        throw error;
      });
  };

  public GetBusinessSchedulesByBusinessID = async (
    business_id: string
  ): Promise<BusinessSchedulePaginator | undefined> => {
    if (!business_id) {
      return Promise.resolve(undefined);
    }
    return $api.user
      .GetBusinessSchedules(1, 50, "CREATED_AT", "DESC", ``, "", business_id)
      .then((response) => {
        if (response.data?.GetBusinessSchedules) {
          this.BusinessSchedules = response.data.GetBusinessSchedules;
          return response.data.GetBusinessSchedules;
        }
      })
      .catch((error: CombinedError) => {
        Logic.Common.showError(
          error,
          "Failed to load schedules",
          "error-alert"
        );
        throw error;
      });
  };

  public GetBusinessSchedule = async (
    uuid: string
  ): Promise<BusinessSchedule | undefined> => {
    return $api.user.GetBusinessSchedule(uuid).then((response) => {
      this.BusinessSchedule = response.data?.GetBusinessSchedule;
      return response.data?.GetBusinessSchedule;
    });
  };
  // Mutations

  public UpdateProfile = async () => {
    if (this.UpdateProfileForm) {
      return $api.user
        .UpdateProfile(this.UpdateProfileForm)
        .then((response) => {
          if (response.data?.UpdateProfile) {
            return response.data.UpdateProfile;
          }
        })
        .catch((error: CombinedError) => {
          Logic.Common.showError(error, "Oops!", "error-alert");
          throw error;
        });
    }
  };

  public RetriggerVerification = async () => {
    return $api.user
      .RetriggerVerification()
      .then((response) => {
        this.VerificationRetryInfo = response.data?.RetriggerVerification;
        return response.data?.RetriggerVerification;
      })
      .catch((error: CombinedError) => {
        // Logic.Common.showError(
        //   error,
        //   "Failed to check verification status",
        //   "error-alert"
        // );
        throw error;
      });
  };

  public UploadFile = async (file: File) => {
    Logic.Common.showLoader({ loading: true, show: true });
    return $api.wallet
      .UploadFile(file)
      .then((response) => {
        if (response.data?.UploadFile) {
          Logic.Common.hideLoader();
          return response.data.UploadFile;
        }
      })
      .catch((error: CombinedError) => {
        Logic.Common.hideLoader();
        Logic.Common.showError(error, "Oops!", "error-alert");
        throw error;
      });
  };
}
