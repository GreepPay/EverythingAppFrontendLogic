import {
  Business as BusinessModel,
  DeliveryAddressPaginator,
  MutationUpdateProfileArgs,
  User as UserModel,
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
  }

  // Base variables
  public SearchedUsers: UserModel[] | undefined;
  public SingleUser: UserModel | undefined;
  public SearchedBusinesses: BusinessModel[] | undefined;
  public ManyP2PDeliveryAddresses: DeliveryAddressPaginator | undefined;

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
}
