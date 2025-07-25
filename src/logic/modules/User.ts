import {
  Business,
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
  }

  // Base variables
  public SearchedUsers: UserModel[] | undefined;
  public SearchedBusinesses: Business[] | undefined;
  public SingleUser: UserModel | undefined;

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
      .SearchBusiness({
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
