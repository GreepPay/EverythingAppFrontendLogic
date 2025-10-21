import {
  Conversation,
  MutationCreateMessageArgs,
  MutationInitiateConversationArgs,
} from "../../gql/graphql";
import { $api } from "../../services";
import { CombinedError } from "urql";
import Common from "./Common";
import { Logic } from "..";

export default class Messaging extends Common {
  // Base Variables
  public SingleConversation: Conversation | undefined;

  // Mutation Variables
  public CreateMessageForm: MutationCreateMessageArgs | undefined;
  public InitiateConversationForm: MutationInitiateConversationArgs | undefined;

  constructor() {
    super();
    this.defineReactiveProperty("SingleConversation", undefined);
  }

  // Queries
  public GetSingleConversation = (uuid: string) => {
    return $api.messaging
      .GetSingleConversation(uuid)
      .then((response) => {
        if (response.data?.GetConversation) {
          this.SingleConversation = response.data.GetConversation;
          Logic.Common.hideLoader();
          return response.data.GetConversation;
        }
      })
      .catch((error: CombinedError) => {
        Logic.Common.hideLoader();
        Logic.Common.showError(error, "Oops!", "error-alert");
        throw error;
      });
  };

  // Mutations
  public CreateMessage = () => {
    if (this.CreateMessageForm) {
      return $api.messaging
        .CreateMessage(this.CreateMessageForm)
        .then((response) => {
          if (response.data?.CreateMessage) {
            Logic.Common.hideLoader();
            return response.data.CreateMessage;
          }
        })
        .catch((error: CombinedError) => {
          console.log(error);
          Logic.Common.hideLoader();
          Logic.Common.showError(error, "Oops!", "error-alert");
          throw error;
        });
    }
  };

  public InitiateConversation = () => {
    if (this.InitiateConversationForm) {
      return $api.messaging
        .InitiateConversation(this.InitiateConversationForm)
        .then((response) => {
          if (response.data?.InitiateConversation) {
            this.SingleConversation = response.data.InitiateConversation;
            Logic.Common.hideLoader();
            return response.data.InitiateConversation;
          }
        })
        .catch((error: CombinedError) => {
          Logic.Common.hideLoader();
          Logic.Common.showError(error, "Oops!", "error-alert");
          throw error;
        });
    }
  };

  public AddParticipant = (
    conversationId: number,
    userId: number,
    addedBy: number
  ) => {
    return $api.messaging
      .AddParticipant({
        conversation_id: conversationId,
        user_id: userId,
        added_by: addedBy,
      })
      .then((response) => {
        if (response.data?.AddParticipant) {
          // Update the current conversation with new participant
          this.SingleConversation = response.data.AddParticipant;
          Logic.Common.hideLoader();
          return response.data.AddParticipant;
        }
      })
      .catch((error: CombinedError) => {
        Logic.Common.hideLoader();
        Logic.Common.showError(error, "Oops!", "error-alert");
        throw error;
      });
  };
}
