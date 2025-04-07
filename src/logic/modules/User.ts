import { MutationUpdateProfileArgs } from "../../gql/graphql"
import { $api } from "../../services"
import Common from "./Common"
import { CombinedError } from "urql"
import { Logic } from ".."

export default class User extends Common {
  constructor() {
    super()
  }

  // Mutations
  public UpdateProfile = async (data: MutationUpdateProfileArgs) => {
    return $api.user
      .UpdateProfile(data)
      .then((response) => {
        if (response.data?.UpdateProfile) {
          return response.data.UpdateProfile
        }
      })
      .catch((error: CombinedError) => {
        Logic.Common.showError(error, "Oops!", "error-alert")
        throw new Error(error.message)
      })
  }
}
