import {
  Conversation,
  Message,
  MutationCreateMessageArgs,
  MutationInitiateConversationArgs,
} from "../gql/graphql";
import { OperationResult } from "urql";
import { BaseApiService } from "./common/BaseService";

export default class MessagingApi extends BaseApiService {
  // Query
  public GetSingleConversation = (uuid: string) => {
    const requestData = `
      query GetConversation($uuid: String!) {
        GetConversation(uuid: $uuid) {
          id
          uuid
          name
          entity_type
          metadata
          stage
          participants {
            id
            user_id
            state
            user {
              first_name
              last_name
              uuid
            }
          }
          messages {
            id
            content
            status
            metadata
            createdAt
            updatedAt
            sender {
              first_name
              last_name
              uuid
            }
            replied_message {
              id
              content
              metadata
              status
              participant {
                id
                user_id
                user {
                  first_name
                  last_name
                  uuid
                }
              }
            }
          }
          state
          created_at
          updated_at
        }
      }
    `;
    const response: Promise<
      OperationResult<{
        GetConversation: Conversation;
      }>
    > = this.query(requestData, {
      uuid,
    });

    return response;
  };

  // Mutations
  public CreateMessage = (data: MutationCreateMessageArgs) => {
    const requestData = `
        mutation CreateMessage($input: MessageInput!) {
          CreateMessage(input: $input) {
            id
            content
            uuid
            status
            conversation_id
            state
            createdAt
            updatedAt
            metadata
          }
        }
      `;

    const response: Promise<
      OperationResult<{
        CreateMessage: Message;
      }>
    > = this.mutation(requestData, data);

    return response;
  };

  public InitiateConversation = (data: MutationInitiateConversationArgs) => {
    const requestData = `
        mutation InitiateConversation($input: ConversationInput!) {
          InitiateConversation(input: $input) {
            id
            uuid
            name
            entity_type
            participants {
               id
               user_id
               state
               user {
                 first_name
                 last_name
                 uuid
               }
            }
            messages {
              id
              content
              status
              metadata
              sender {
                first_name
                last_name
                uuid
              }
              replied_message {
                id
                content
                metadata
                status
                participant {
                  id
                  user_id
                  user {
                    first_name
                    last_name
                    uuid
                  }
                }
              }
            }
            state
            created_at
            updated_at
          }
        }
      `;
    const response: Promise<
      OperationResult<{
        InitiateConversation: Conversation;
      }>
    > = this.mutation(requestData, data);

    return response;
  };

  public AddParticipant = (data: {
    conversation_id: number;
    user_id: number;
    added_by: number;
  }) => {
    const requestData = `
        mutation AddParticipant($input: AddParticipantInput!) {
          AddParticipant(input: $input) {
            id
            uuid
            name
            entity_type
            participants {
               id
               user_id
               state
               user {
                 first_name
                 last_name
                 uuid
               }
            }
            messages {
              id
              content
              status
              metadata
              sender {
                first_name
                last_name
                uuid
              }
              replied_message {
                id
                content
                metadata
                status
                participant {
                  id
                  user_id
                  user {
                    first_name
                    last_name
                    uuid
                  }
                }
              }
            }
            state
            created_at
            updated_at
          }
        }
      `;
    const response: Promise<
      OperationResult<{
        AddParticipant: Conversation;
      }>
    > = this.mutation(requestData, {
      input: data,
    });

    return response;
  };
}
