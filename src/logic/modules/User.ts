import {
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
    this.defineReactiveProperty("SingleUser", undefined);
  }

  // Base variables
  public SearchedUsers: UserModel[] | undefined;
  public SingleUser: UserModel | undefined;

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

  public GetSingleUser = async (
    uuid: string
  ): Promise<UserModel | undefined> => {
    return $api.user.GetSingleUser(uuid).then((response) => {
      this.SingleUser = response.data?.GetSingleUser;
      return response.data?.GetSingleUser;
    });
  };

  // Mutations
  public UpdateProfile = async (data: MutationUpdateProfileArgs) => {
    return $api.user
      .UpdateProfile(data)
      .then((response) => {
        if (response.data?.UpdateProfile) {
          return response.data.UpdateProfile;
        }
      })
      .catch((error: CombinedError) => {
        Logic.Common.showError(error, "Oops!", "error-alert");
        throw new Error(error.message);
      });
  };
}
