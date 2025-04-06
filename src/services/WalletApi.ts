import { BaseApiService } from "./common/BaseService"
import { OperationResult } from "urql"
import {
  MutationInitiateTopupArgs,
  MutationMakePaymentArgs,
  MutationRedeemGrpTokenArgs,
  ExchangeRate,
  QueryGetExchangeRateArgs,
  TransactionPaginator,
  QueryGetTransactionsArgs,
  Transaction,
  QueryGetSingleTransactionArgs,
  QueryGetSinglePointTransactionArgs,
  PointTransaction,
  PointTransactionPaginator,
  QueryGetPointTransactionsArgs,
  SupportedCurrency,
} from "../gql/graphql"

export default class WalletsApi extends BaseApiService {
  // Query
  public GetExchangeRate = (data: QueryGetExchangeRateArgs) => {
    const requestData = `
      query GetExchangeRate($from_currency: String!, $to_currency: String!) {
        GetExchangeRate(from_currency: $from_currency, to_currency: $to_currency) {
          rates {
            buy
            code
            locale
            rateId
            sell
            updatedAt
          }
        }
      }

		`

    const response: Promise<
      OperationResult<{
        GetExchangeRate: ExchangeRate
      }>
    > = this.query(requestData, data)

    return response
  }

  /**
   * @description Retrieves a paginated list of transactions for the authenticated user.
   * @params data - QueryGetTransactionsArgs containing filtering, sorting, pagination options.
   * @response A paginated list of transactions with metadata.
   */
  public GetTransactions = (data: QueryGetTransactionsArgs) => {
    const requestData = `
        query GetTransactions($orderBy: [QueryGetTransactionsOrderByOrderByClause!], $where: QueryGetTransactionsWhereWhereConditions, $first: Int!, $page: Int) {
          GetTransactions(orderBy: $orderBy, where: $where, first: $first, page: $page) {
            paginatorInfo {
              count
              currentPage
              firstItem
              hasMorePages
              lastItem
              lastPage
              perPage
              total
            }
            data {
              uuid
              dr_or_cr
              currency
              wallet_id
              user_id
              amount
              wallet_balance
              charge_id
              chargeable_type
              description
              status
              charges
              reference
              state
              gateway
              created_at
              updated_at
            }
          }
        }
      `

    const response: Promise<
      OperationResult<{
        GetTransactions: TransactionPaginator
      }>
    > = this.query(requestData, data)

    return response
  }

  /**
   * @description Retrieves details of a single transaction by UUID.
   * @params uuid - The unique identifier of the transaction.
   * @response A single transaction object with its details.
   */
  public GetSingleTransaction = (data: QueryGetSingleTransactionArgs) => {
    const requestData = `
      query GetSingleTransaction($uuid: String!) {
        GetSingleTransaction(uuid: $uuid) {
          uuid
          dr_or_cr
          currency
          wallet_id
          user_id
          amount
          wallet_balance
          charge_id
          chargeable_type
          description
          status
          charges
          reference
          state
          gateway
          created_at
          updated_at
        }
      }
    `

    const response: Promise<
      OperationResult<{
        GetSingleTransaction: Transaction
      }>
    > = this.query(requestData, data)

    return response
  }

  /**
   * @description Retrieves a paginated list of point transactions for the authenticated user.
   * @params first - Number of transactions per page, page (optional) - Page number for pagination.
   * @response A paginated list of point transactions with metadata.
   */
  public GetPointTransactions = (data: QueryGetPointTransactionsArgs) => {
    const requestData = `
      query GetPointTransactions($first: Int!, $page: Int) {
        GetPointTransactions(first: $first, page: $page) {
          data {
            uuid
            dr_or_cr
            wallet_id
            user_id
            amount
            point_balance
            charge_id
            state
            chargeable_type
            description
            status
            reference
            extra_data
            currency
            created_at
            updated_at
          }
          paginatorInfo {
            count
            currentPage
            firstItem
            hasMorePages
            lastItem
            lastPage
            perPage
            total
          }
        }
      }
    `

    const response: Promise<
      OperationResult<{
        GetPointTransactions: PointTransactionPaginator
      }>
    > = this.query(requestData, data)

    return response
  }

  /**
   * @description Retrieves details of a single point transaction by UUID.
   * @params uuid - The unique identifier of the point transaction.
   * @response A single point transaction object with its details.
   */
  public GetSinglePointTransaction = (
    data: QueryGetSinglePointTransactionArgs
  ) => {
    const requestData = `
      query GetSinglePointTransaction($uuid: String!) {
        GetSinglePointTransaction(uuid: $uuid) {
          uuid
          dr_or_cr
          currency
          wallet_id
          user_id
          amount
          point_balance
          charge_id
          chargeable_type
          description
          status
          extra_data
          reference
          state
          created_at
          updated_at
        }
      }
    `

    const response: Promise<
      OperationResult<{
        GetSinglePointTransaction: PointTransaction
      }>
    > = this.query(requestData, data)

    return response
  }
  /**
   * @description Retrieves the list of currently supported on-ramp currencies.
   * @response An array of supported currencies with details including country, code, and supported methods.
   */
  public GetOnRampCurrencies = () => {
    const requestData = `
      query GetOnRampCurrencies {
        GetOnRampCurrencies {
          code
          country
          currency
          supported_methods
        }
      }
    `

    const response: Promise<
      OperationResult<{
        GetOnRampCurrencies: SupportedCurrency[]
      }>
    > = this.query(requestData, {})

    return response
  }


  //
  // Mutation
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
