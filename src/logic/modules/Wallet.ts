import {
  ExchangeRate,
  // GlobalExchangeRate,
  // MutationCreateSavedAccountArgs,
  // MutationInitiateWithdrawalArgs,
  PointTransaction,
  PointTransactionPaginator,
  SupportedCurrency,
  Transaction,
  TransactionPaginator,
  ExchangeRate,
  QueryGetExchangeRateArgs,
  // UserBankPaginator,
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
  // public ManySavedAccounts: UserBankPaginator | undefined;
  public SinglePointTransaction: PointTransaction | undefined
  public SingleTransaction: Transaction | undefined
  // public CurrentGlobalExchangeRate: GlobalExchangeRate | undefined;

  // Mutation Variables
  // public CreateSavedAccountForm: MutationCreateSavedAccountArgs | undefined;
  // public InitiateWithdrawalForm: MutationInitiateWithdrawalArgs | undefined;

  //  Query Parameters

  // Queries
  public GetExchangeRate = async (
    payload: QueryGetExchangeRateArgs
  ): Promise<ExchangeRate | undefined> => {
    return $api.wallet.GetExchangeRate(payload).then((response) => {
      this.CurrentExchangeRate = response.data?.GetExchangeRate
      return this.CurrentExchangeRate
    })
  }

  // public GetGlobalExchangeRate = async (
  //   base = "USD",
  //   target = "",
  // ): Promise<GlobalExchangeRate | undefined> => {
  //   if (!target) {
  //     target = Logic.Auth.AuthUser?.profile?.default_currency || "USD";
  //   }
  //   return $api.wallet.GetGlobalExchangeRate(base, target).then((response) => {
  //     this.CurrentGlobalExchangeRate = response.data?.GetGlobalExchangeRate;
  //     return this.CurrentGlobalExchangeRate;
  //   });
  // };

  // public GetPointTransactions = async (
  //   page: number,
  //   count: number,
  //   orderType: "CREATED_AT",
  //   order = "DESC" as "DESC" | "ASC",
  //   whereQuery = "",
  // ) => {
  //   return $api.wallet
  //     .GetPointTransactions(page, count, orderType, order, whereQuery)
  //     .then((response) => {
  //       this.ManyPointTransactions = response.data?.GetPointTransactions;
  //       return this.ManyPointTransactions;
  //     });
  // };

  // public GetTransactions = async (
  //   page: number,
  //   count: number,
  //   orderType: "CREATED_AT",
  //   order = "DESC" as "DESC" | "ASC",
  //   whereQuery = "",
  // ) => {
  //   return $api.wallet
  //     .GetTransactions(page, count, orderType, order, whereQuery)
  //     .then((response) => {
  //       this.ManyTransactions = response.data?.GetTransactions;
  //       return this.ManyTransactions;
  //     });
  // };

  // public GetSavedAccounts = async (first: number, page: number) => {
  //   return $api.wallet.GetSavedAccounts(first, page).then((response) => {
  //     this.ManySavedAccounts = response.data?.GetSavedAccounts;
  //     return this.ManySavedAccounts;
  //   });
  // };

  // public GetSinglePointTransaction = async (uuid: string) => {
  //   return $api.wallet.GetSinglePointTransaction(uuid).then((response) => {
  //     this.SinglePointTransaction = response.data?.GetSinglePointTransaction;
  //     return this.SinglePointTransaction;
  //   });
  // };

  // public GetSingleTransaction = async (uuid: string) => {
  //   return $api.wallet.GetSingleTransaction(uuid).then((response) => {
  //     this.SingleTransaction = response.data?.GetSingleTransaction;
  //     return this.SingleTransaction;
  //   });
  // };

  // // Mutations
  // public CreateSavedAccount = async () => {
  //   if (this.CreateSavedAccountForm) {
  //     return $api.wallet
  //       .CreateSavedAccount(this.CreateSavedAccountForm)
  //       .then((response) => {
  //         if (response.data?.CreateSavedAccount) {
  //           return response.data.CreateSavedAccount;
  //         }
  //       })
  //       .catch((error: CombinedError) => {
  //         Logic.Common.showError(error, "Oops!", "error-alert");
  //       });
  //   }
  // };

  // public InitiateWithdrawal = async () => {
  //   if (this.InitiateWithdrawalForm) {
  //     return $api.wallet
  //       .InitiateWithdrawal(this.InitiateWithdrawalForm)
  //       .then((response) => {
  //         if (response.data?.InitiateWithdrawal) {
  //           return response.data.InitiateWithdrawal;
  //         }
  //       })
  //       .catch((error: CombinedError) => {
  //         Logic.Common.showError(error, "Oops!", "error-alert");
  //       });
  //   }
  // };

  // public RedeemGRPToken = (grpAmount: number) => {
  //   if (grpAmount) {
  //     return $api.wallet
  //       .RedeemGRPToken(grpAmount)
  //       .then((response) => {
  //         if (response.data?.RedeemGRPToken) {
  //           return response.data.RedeemGRPToken;
  //         }
  //       })
  //       .catch((error: CombinedError) => {
  //         Logic.Common.showError(error, "Oops!", "error-alert");
  //       });
  //   }
  // };

  // public RemoveSavedAccount = (saved_account_uuid: string) => {
  //   if (saved_account_uuid) {
  //     return $api.wallet
  //       .RemoveSavedAccount(saved_account_uuid)
  //       .then((response) => {
  //         if (response.data?.RemoveSavedAccount) {
  //           return response.data.RemoveSavedAccount;
  //         }
  //       })
  //       .catch((error: CombinedError) => {
  //         Logic.Common.showError(error, "Oops!", "error-alert");
  //       });
  //   }
  // };
}
