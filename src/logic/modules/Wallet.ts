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
} from "../../gql/graphql"
import { $api } from "../../services"
import { CombinedError } from "urql"
import Common from "./Common"
import { Logic } from ".."

export default class Wallet extends Common {
  constructor() {
    super()
  }

  // Base Variables
  public CurrentExchangeRate: ExchangeRate | undefined
  public ManyOffRampCurrencies: SupportedCurrency[] | undefined
  public ManyPointTransactions: PointTransactionPaginator | undefined
  public ManyTransactions: TransactionPaginator | undefined
  public SinglePointTransaction: PointTransaction | undefined
  public SingleTransaction: Transaction | undefined
  public CurrentGlobalExchangeRate: GlobalExchangeRate | undefined

  // Queries
  public GetExchangeRate = async (
    payload: QueryGetExchangeRateArgs
  ): Promise<ExchangeRate | undefined> => {
    return $api.wallet.GetExchangeRate(payload).then((response) => {
      this.CurrentExchangeRate = response.data?.GetExchangeRate
      return this.CurrentExchangeRate
    })
  }

  public RedeemGRPToken = async (data: MutationRedeemGrpTokenArgs) => {
    return $api.wallet
      .RedeemGRPToken(data)
      .then((response) => {
        if (response.data?.RedeemGRPToken) {
          return response.data.RedeemGRPToken
        }
      })
      .catch((error: CombinedError) => {
        Logic.Common.showError(error, "Oops!", "error-alert")
        throw new Error(error.message)
      })
  }

  public MakePayment = async (data: MutationMakePaymentArgs) => {
    return $api.wallet
      .MakePayment(data)
      .then((response) => {
        if (response.data?.MakePayment) {
          return response.data.MakePayment
        }
      })
      .catch((error: CombinedError) => {
        Logic.Common.showError(error, "Oops!", "error-alert")
        throw new Error(error.message)
      })
  }

  public InitiateTopup = async (data: MutationInitiateTopupArgs) => {
    return $api.wallet
      .InitiateTopup(data)
      .then((response) => {
        if (response.data?.InitiateTopup) {
          return response.data.InitiateTopup
        }
      })
      .catch((error: CombinedError) => {
        Logic.Common.showError(error, "Oops!", "error-alert")
        throw new Error(error.message)
      })
  }

  public GetGlobalExchangeRate = async (
    base = "NGN",
    target = ""
  ): Promise<GlobalExchangeRate | undefined> => {
    if (!target) {
      target = Logic.Auth.AuthUser?.profile?.default_currency || "USD"
    }
    return $api.wallet.GetGlobalExchangeRate(base, target).then((response) => {
      this.CurrentGlobalExchangeRate = response.data?.GetGlobalExchangeRate
      return this.CurrentGlobalExchangeRate
    })
  }
  public GetOnRampCurrencies = (): Promise<SupportedCurrency[] | undefined> => {
    return $api.wallet
      .GetOnRampCurrencies()
      .then((response) => {
        return response.data?.GetOnRampCurrencies
      })
      .catch((error: CombinedError) => {
        Logic.Common.showError(
          error,
          "Failed to fetch on-ramp currencies",
          "error-alert"
        )
        return undefined
      })
  }

  public GetPointTransactions = (
    data: QueryGetPointTransactionsArgs
  ): Promise<PointTransactionPaginator | undefined> => {
    return $api.wallet
      .GetPointTransactions(data)
      .then((response) => {
        return response.data?.GetPointTransactions
      })
      .catch((error: CombinedError) => {
        Logic.Common.showError(
          error,
          "Failed to fetch point transactions",
          "error-alert"
        )
        return undefined
      })
  }

  public GetSinglePointTransaction = (
    data: QueryGetSinglePointTransactionArgs
  ): Promise<PointTransaction | undefined> => {
    return $api.wallet
      .GetSinglePointTransaction(data)
      .then((response) => {
        return response.data?.GetSinglePointTransaction
      })
      .catch((error: CombinedError) => {
        Logic.Common.showError(
          error,
          "Failed to fetch transaction details",
          "error-alert"
        )
        return undefined
      })
  }

  public GetSingleTransaction = (
    data: QueryGetSingleTransactionArgs
  ): Promise<Transaction | undefined> => {
    return $api.wallet
      .GetSingleTransaction(data)
      .then((response) => {
        return response.data?.GetSingleTransaction
      })
      .catch((error: CombinedError) => {
        Logic.Common.showError(
          error,
          "Failed to fetch transaction details",
          "error-alert"
        )
        return undefined
      })
  }

  public GetTransactions = (
    data: QueryGetTransactionsArgs
  ): Promise<TransactionPaginator | undefined> => {
    return $api.wallet
      .GetTransactions(data)
      .then((response) => {
        return response.data?.GetTransactions
      })
      .catch((error: CombinedError) => {
        Logic.Common.showError(
          error,
          "Failed to fetch transactions",
          "error-alert"
        )
        return undefined
      })
  }
}
