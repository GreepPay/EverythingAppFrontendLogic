import { BaseApiService } from "./common/BaseService"
import { OperationResult } from "urql"
import {
  MutationInitiateTopupArgs,
  MutationMakePaymentArgs,
  MutationRedeemGrpTokenArgs,
} from "../gql/graphql"

export default class WalletsApi extends BaseApiService {
  /**
   * @description Initiates a top-up transaction with the specified method, amount, currency, and payment metadata.
   * @params method, amount, currency, payment_metadata
   * @response Boolean indicating success or failure
   */
  public InitiateTopup = (data: MutationInitiateTopupArgs) => {
    const requestData = `
    mutation InitiateTopup(
      $method: String!,
      $amount: Float!,
      $currency: String!,
      $payment_metadata: String!
    ) {
      InitiateTopup(
        method: $method,
        amount: $amount,
        currency: $currency,
        payment_metadata: $payment_metadata
      )
    }
  `

    const response: Promise<OperationResult<{ InitiateTopup: boolean }>> =
      this.mutation(requestData, data)

    return response
  }

  /**
   * @description Initiates a payment to another user with the specified receiver, amount, and currency.
   * @params receiver_uuid, amount, currency
   * @response Boolean indicating success or failure
   */
  public MakePayment = (data: MutationMakePaymentArgs) => {
    const requestData = `
    mutation MakePayment(
      $receiver_uuid: String!,
      $amount: Float!,
      $currency: String!
    ) {
      MakePayment(
        receiver_uuid: $receiver_uuid,
        amount: $amount,
        currency: $currency
      )
    }
  `

    const response: Promise<OperationResult<{ MakePayment: boolean }>> =
      this.mutation(requestData, data)

    return response
  }

  /**
   * @description Redeems a specified amount of GRP tokens for the authenticated user.
   * @params grp_amount
   * @response Boolean indicating success or failure
   */
  public RedeemGRPToken = (data: MutationRedeemGrpTokenArgs) => {
    const requestData = `
    mutation RedeemGRPToken(
      $grp_amount: Float!
    ) {
      RedeemGRPToken(
        grp_amount: $grp_amount
      )
    }
  `

    const response: Promise<OperationResult<{ RedeemGRPToken: boolean }>> =
      this.mutation(requestData, data)

    return response
  }
}
