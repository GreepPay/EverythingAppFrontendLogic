import { BaseApiService } from "./common/BaseService"
import { OperationResult } from "urql"
import {
  MutationInitiateTopupArgs,
  MutationMakePaymentArgs,
  MutationRedeemGrpTokenArgs,
  ExchangeRate,
  QueryGetExchangeRateArgs,
  SupportedCurrency,
  GlobalExchangeRate,
  PaymentChannel,
  PaymentNetwork,
  PaymentCollectionResponse,
  MutationMonitorTopupStatusArgs,
} from "../gql/graphql"

export default class PaymentApi extends BaseApiService {
  // #region QUERIES
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

  public GetOnRampChannelsByCountryCode = (countryCode: string) => {
    const requestData = `
      query GetOnRampChannelsByCountryCode($countryCode: String!) {
        GetOnRampChannelsByCountryCode(country_code: $countryCode) {
           id
           max
           currency
           countryCurrency
           country
           status
           feeLocal
           feeUSD
           min
           channelType
           apiStatus
           vendorId
           rampType
        }
      }
    `

    const response: Promise<
      OperationResult<{
        GetOnRampChannelsByCountryCode: PaymentChannel[]
      }>
    > = this.query(requestData, { countryCode })

    return response
  }

  public GetOnRampNetworkByCountryCode = (countryCode: string) => {
    const requestData = `
      query GetOnRampNetworkByCountryCode($countryCode: String!) {
        GetOnRampNetworkByCountryCode(country_code: $countryCode) {
           id
           code
           status
           channelIds
           accountNumberType
           country
           name
           countryAccountNumberType
        }
      }
    `

    const response: Promise<
      OperationResult<{
        GetOnRampNetworkByCountryCode: PaymentNetwork[]
      }>
    > = this.query(requestData, { countryCode })

    return response
  }
  // #endregion QUERIES

  // #region MUTATIONS
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
           ) {
            id
             currency
             status
             partnerFeeAmountLocal
             serviceFeeAmountUSD
             partnerFeeAmountUSD
             serviceFeeAmountLocal
             country
             reference
             expiresAt
             requestSource
             amount
             rate
             bankInfo {
               name
               accountNumber
               accountName
             }
             convertedAmount
             serviceFeeAmountLocal
           }
         }
  `

    const response: Promise<
      OperationResult<{ InitiateTopup: PaymentCollectionResponse }>
    > = this.mutation(requestData, data)

    return response
  }

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

  public GetGlobalExchangeRate = (base: string, target: string) => {
    const requestData = `
      query GetGlobalExchangeRate($base: String!, $target: String!) {
        GetGlobalExchangeRate(base: $base, target: $target) {
          base
          target
          mid
          unit
        }
      }
		`

    const response: Promise<
      OperationResult<{
        GetGlobalExchangeRate: GlobalExchangeRate
      }>
    > = this.query(requestData, {
      base,
      target,
    })

    return response
  }

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

  public MonitorTopupStatus = (data: MutationMonitorTopupStatusArgs) => {
    const requestData = `
    mutation MonitorTopupStatus(
      $collection_id: String!
    ) {
      MonitorTopupStatus(
        collection_id: $collection_id
      )
    }
  `

    const response: Promise<OperationResult<{ MonitorTopupStatus: boolean }>> =
      this.mutation(requestData, data)

    return response
  }
}
