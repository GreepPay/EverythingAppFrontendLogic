import { BaseApiService } from "./common/BaseService";
import { OperationResult } from "urql";
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
} from "../gql/graphql";

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
		`;

    const response: Promise<
      OperationResult<{
        GetExchangeRate: ExchangeRate;
      }>
    > = this.query(requestData, data);

    return response;
  };

  public GetPointTransactions = (
    page: number,
    count: number,
    orderType = "CREATED_AT",
    order: "ASC" | "DESC",
    whereQuery = "",
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
    `;
    const response: Promise<
      OperationResult<{
        GetPointTransactions: PointTransactionPaginator;
      }>
    > = this.query(requestData, {
      page,
      count,
    });

    return response;
  };

  public GetTransactions = (
    page: number,
    count: number,
    orderType = "CREATED_AT",
    order: "ASC" | "DESC",
    whereQuery = "",
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
          }
        }
      }
    `;
    const response: Promise<
      OperationResult<{
        GetTransactions: TransactionPaginator;
      }>
    > = this.query(requestData, {
      page,
      count,
    });

    return response;
  };

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
    `;
    const response: Promise<
      OperationResult<{
        GetSinglePointTransaction: PointTransaction;
      }>
    > = this.query(requestData, {
      uuid,
    });

    return response;
  };

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
    `;

    const response: Promise<
      OperationResult<{
        GetSingleTransaction: Transaction;
      }>
    > = this.query(requestData, {
      uuid,
    });

    return response;
  };

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
    `;

    const response: Promise<
      OperationResult<{
        GetOnRampCurrencies: SupportedCurrency[];
      }>
    > = this.query(requestData, {});

    return response;
  };

  /**
   * @description Retrieves the list of currently supported on-ramp channels for a given country code.
   * @response An array of supported channels with details including country, code, and supported methods.
   */
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
    `;

    const response: Promise<
      OperationResult<{
        GetOnRampChannelsByCountryCode: PaymentChannel[];
      }>
    > = this.query(requestData, { countryCode });

    return response;
  };

  /**
   * @description Retrieves the list of currently supported on-ramp networks for a given country code.
   * @response An array of supported networks with details including country, code, and supported methods.
   */
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
    `;

    const response: Promise<
      OperationResult<{
        GetOnRampNetworkByCountryCode: PaymentNetwork[];
      }>
    > = this.query(requestData, { countryCode });

    return response;
  };

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
  `;

    const response: Promise<
      OperationResult<{ InitiateTopup: PaymentCollectionResponse }>
    > = this.mutation(requestData, data);

    return response;
  };

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
  `;

    const response: Promise<OperationResult<{ MakePayment: boolean }>> =
      this.mutation(requestData, data);

    return response;
  };

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
		`;

    const response: Promise<
      OperationResult<{
        GetGlobalExchangeRate: GlobalExchangeRate;
      }>
    > = this.query(requestData, {
      base,
      target,
    });

    return response;
  };

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
  `;

    const response: Promise<OperationResult<{ RedeemGRPToken: boolean }>> =
      this.mutation(requestData, data);

    return response;
  };

  public MonitorTopupStatus = (data: MutationMonitorTopupStatusArgs) => {
    const requestData = `
    mutation MonitorTopupStatus(
      $collection_id: String!
    ) {
      MonitorTopupStatus(
        collection_id: $collection_id
      )
    }
  `;

    const response: Promise<OperationResult<{ MonitorTopupStatus: boolean }>> =
      this.mutation(requestData, data);

    return response;
  };
}
