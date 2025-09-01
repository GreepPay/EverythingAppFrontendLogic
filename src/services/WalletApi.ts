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
  GlobalExchangeRate,
  PaymentChannel,
  PaymentNetwork,
  PaymentCollectionResponse,
  MutationMonitorTopupStatusArgs,
  OffRamp,
  WithdrawInfo,
  UserBankPaginator,
  MutationInitiateWithdrawalArgs,
  UserBank,
  MutationCreateSavedAccountArgs,
  YellowcardNetwork,
  FinancialSummaryResponse,
  FinancialSummaryInput,
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

  public GetPointTransactions = (
    page: number,
    count: number,
    orderType = "CREATED_AT",
    order: "ASC" | "DESC",
    whereQuery = ""
  ) => {
    const requestData = `
      query GetPointTransactions(
        $page: Int!,
        $count: Int!
      ){
        GetPointTransactions(
          first: $count,
          page: $page,
          orderBy: {
            column: ${orderType ? orderType : "CREATED_AT"},
            order: ${order}
          }
          ${whereQuery ? `where: ${whereQuery}` : ""}
        ) {
          paginatorInfo {
            total
            perPage
            lastPage
            lastItem
            hasMorePages
            firstItem
            currentPage
            count
          }
          data {
            uuid
            amount
            charge_id
            chargeable_type
            created_at
            updated_at
            currency
            description
            dr_or_cr
            point_balance
            reference
            state
            status
          }
        }
      }
    `
    const response: Promise<
      OperationResult<{
        GetPointTransactions: PointTransactionPaginator
      }>
    > = this.query(requestData, {
      page,
      count,
    })

    return response
  }

  public GetTransactions = (
    page: number,
    count: number,
    orderType = "CREATED_AT",
    order: "ASC" | "DESC",
    whereQuery = ""
  ) => {
    const requestData = `
      query GetTransactions(
        $page: Int!,
        $count: Int!
      ){
        GetTransactions(
          first: $count,
          page: $page,
          orderBy: {
            column: ${orderType ? orderType : "CREATED_AT"},
            order: ${order}
          }
          ${whereQuery ? `where: ${whereQuery}` : ""}
        ) {
          paginatorInfo {
            total
            perPage
            lastPage
            lastItem
            hasMorePages
            firstItem
            currentPage
            count
          }
          data {
            amount
            gateway
            reference
            charges
            chargeable_type
            currency
            description
            dr_or_cr
            state
            status
            wallet_balance
            uuid
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
    > = this.query(requestData, {
      page,
      count,
    })

    return response
  }

  public GetSinglePointTransaction = (uuid: string) => {
    const requestData = `
      query GetSinglePointTransaction($uuid: String!) {
        GetSinglePointTransaction(uuid: $uuid) {
          amount
          charge_id
          chargeable_type
          created_at
          currency
          description
          dr_or_cr
          extra_data
          point_balance
          reference
          state
          status
          updated_at
          uuid
        }
      }
    `
    const response: Promise<
      OperationResult<{
        GetSinglePointTransaction: PointTransaction
      }>
    > = this.query(requestData, {
      uuid,
    })

    return response
  }

  public GetSingleTransaction = (uuid: string) => {
    const requestData = `
      query GetSingleTransaction($uuid: String!) {
        GetSingleTransaction(uuid: $uuid) {
          amount
          charge_id
          chargeable_type
          charges
          created_at
          currency
          description
          dr_or_cr
          gateway
          reference
          state
          status
          updated_at
          uuid
          wallet_balance
        }
      }
    `

    const response: Promise<
      OperationResult<{
        GetSingleTransaction: Transaction
      }>
    > = this.query(requestData, {
      uuid,
    })

    return response
  }

  public GetSavedAccounts = (first: number, page: number) => {
    const requestData = `
      query GetSavedAccounts($first: Int!, $page: Int) {
        GetSavedAccounts(first: $first, page: $page) {
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
            account_no
            bank_code
            bank_name
            currency
            is_verified
            meta_data
            state
            uuid
          }
        }
      }
    `
    const response: Promise<
      OperationResult<{
        GetSavedAccounts: UserBankPaginator
      }>
    > = this.query(requestData, {
      first,
      page,
    })

    return response
  }

  public GetYellowCardNetwork = (country_code: string) => {
    const requestData = `
        query GetYellowCardNetwork($country_code: String!) {
          GetYellowCardNetwork(country_code: $country_code) {
            id
            code
            hasBranch
            name
            country
            accountNumberType
            countryAccountNumberType
            status
            channelIds
          }
        }
    `

    const response: Promise<
      OperationResult<{
        GetYellowCardNetwork: YellowcardNetwork[]
      }>
    > = this.query(requestData, {
      country_code,
    })

    return response
  }

  public GetBankAccountDetails = (accountNumber: string, networkId: string) => {
    const requestData = `
        query GetBankAccountDetails($accountNumber: String!, $networkId: String!) {
          GetBankAccountDetails(accountNumber: $accountNumber, networkId: $networkId)
        }
    `

    const response: Promise<
      OperationResult<{
        GetBankAccountDetails: string
      }>
    > = this.query(requestData, {
      accountNumber,
      networkId,
    })

    return response
  }

  public GetFinancialSummary = (input: FinancialSummaryInput) => {
    const requestData = `
      query GetFinancialSummary($input: FinancialSummaryInput!) {
        GetFinancialSummary(input: $input) {
         credit
         debit
        }
      }
    `
    const response: Promise<
      OperationResult<{ GetFinancialSummary: FinancialSummaryResponse }>
    > = this.query(requestData, {
      input,
    })

    return response
  }

  public GetWithdrawInfo = (amount: number, currency: string, country_code: string) => {
    const requestData = `
      query GetWithdrawInfo($amount: Float!, $currency: String!, $country_code: String) {
        GetWithdrawInfo(amount: $amount, currency: $currency, country_code: $country_code) {
          currency
          methods {
            name
            description
            fee
            min_amount
            max_amount
            unique_id
          }
        }
      }
		`

    const response: Promise<
      OperationResult<{
        GetWithdrawInfo: WithdrawInfo
      }>
    > = this.query(requestData, {
      amount,
      currency,
      country_code
    })

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

  public GetOffRampChannelsByCountryCode = (countryCode: string) => {
    const requestData = `
      query GetOffRampChannelsByCountryCode($countryCode: String!) {
        GetOffRampChannelsByCountryCode(country_code: $countryCode) {
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
        GetOffRampChannelsByCountryCode: PaymentChannel[]
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

  public GetOfframp = (uuid: string) => {
    const requestData = `
      query GetOfframp($uuid: String!) {
        GetOfframp(uuid: $uuid) {
        id
        uuid
        amount
        payment_reference
        yellow_card_payment {
          currency
          amount
          convertedAmount
          status
          rate
          destination {
            accountName
            accountNumber
            accountType
          }
          expiresAt
        }
        state
        payment_channel
        description
        status
        currency
        extra_data
        senderName
        senderCountry
        senderPhone
        senderAddress
        senderBusinessName
        created_at
        updated_at
        }
      }
    `

    const response: Promise<
      OperationResult<{
        GetOfframp: OffRamp
      }>
    > = this.query(requestData, {
      uuid,
    })

    return response
  }

  // Mutation
  public CreateSavedAccount = (data: MutationCreateSavedAccountArgs) => {
    const requestData = `
        mutation CreateSavedAccount($type: String!, $unique_id: String!, $metadata: String!, $uploads: [Upload!]) {
          CreateSavedAccount(type: $type, unique_id: $unique_id, metadata: $metadata, uploads: $uploads) {
            account_no
            bank_code
            bank_name
            currency
            is_verified
            meta_data
            state
            uuid
          }
        }
      `

    const response: Promise<
      OperationResult<{
        CreateSavedAccount: UserBank
      }>
    > = this.mutation(requestData, data)

    return response
  }

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
      $business_uuid: String
    ) {
      MakePayment(
        receiver_uuid: $receiver_uuid,
        amount: $amount,
        currency: $currency,
        business_uuid: $business_uuid
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

  public GetOffRampCurrencies = () => {
    const requestData = `
        query GetOffRampCurrencies {
          GetOffRampCurrencies {
            code
            country
            currency
            supported_methods
          }
        }
    `

    const response: Promise<
      OperationResult<{
        GetOffRampCurrencies: SupportedCurrency[]
      }>
    > = this.query(requestData, {})

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

  public VerifyFlutterwaveTransaction = (reference: string) => {
    const requestData = `
        mutation VerifyFlutterwaveTransaction($reference: String!) {
          VerifyFlutterwaveTransaction(reference: $reference)
        }
      `

    const response: Promise<
      OperationResult<{
        VerifyFlutterwaveTransaction: boolean
      }>
    > = this.mutation(requestData, {
      reference,
    })

    return response
  }

  public InitiateWalletKYC = (currency: string) => {
    const requestData = `
        mutation InitiateWalletKYC($currency: String!) {
          InitiateWalletKYC(currency: $currency)
        }
      `

    const response: Promise<
      OperationResult<{
        InitiateWalletKYC: string
      }>
    > = this.mutation(requestData, {
      currency,
    })

    return response
  }

  public ConfirmWithdrawal = (
    uuid: string,
    currency: string,
    amount: number,
    metadata = ""
  ) => {
    const requestData = `
        mutation ConfirmWithdrawal(
          $uuid: String!
          $currency: String!
          $amount: Float!
          $metadata: String
        ) {
          ConfirmWithdrawal(
            uuid: $uuid
            currency: $currency
            amount: $amount
            metadata: $metadata
          ) {
             id
             uuid
             amount
             payment_reference
             yellow_card_payment {
               currency
               amount
               convertedAmount
               status
               rate
               destination {
                 accountName
                 accountNumber
                 accountType
               }
               expiresAt
             }
             state
             payment_channel
             description
             status
             currency
             extra_data
             senderName
             senderCountry
             senderPhone
             senderAddress
             senderBusinessName
             created_at
             updated_at
          }
        }
      `

    const response: Promise<
      OperationResult<{
        ConfirmWithdrawal: OffRamp
      }>
    > = this.mutation(requestData, {
      uuid,
      currency,
      amount,
      metadata,
    })

    return response
  }

  public InitiateWithdrawal = (data: MutationInitiateWithdrawalArgs) => {
    const requestData = `
        mutation InitiateWithdrawal(
          $saved_account_uuid: String!
          $amount: Float!
          $withdrawal_currency: String!
        ) {
          InitiateWithdrawal(
            saved_account_uuid: $saved_account_uuid
            amount: $amount
            withdrawal_currency: $withdrawal_currency
          ) {
             id
             uuid
             amount
             payment_reference
             yellow_card_payment {
               currency
               amount
               convertedAmount
               status
               rate
               destination {
                 accountName
                 accountNumber
                 accountType
               }
               expiresAt
             }
             state
             payment_channel
             description
             status
             currency
             extra_data
             senderName
             senderCountry
             senderPhone
             senderAddress
             senderBusinessName
             created_at
             updated_at
          }
        }
      `

    const response: Promise<
      OperationResult<{
        InitiateWithdrawal: OffRamp
      }>
    > = this.mutation(requestData, data)

    return response
  }
}
