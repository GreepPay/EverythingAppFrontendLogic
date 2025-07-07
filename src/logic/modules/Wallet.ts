import {
  MutationInitiateTopupArgs,
  MutationMakePaymentArgs,
  MutationRedeemGrpTokenArgs,
  ExchangeRate,
  QueryGetExchangeRateArgs,
  TransactionPaginator,
  Transaction,
  PointTransaction,
  PointTransactionPaginator,
  SupportedCurrency,
  GlobalExchangeRate,
  PaymentChannel,
  PaymentNetwork,
  OffRamp,
  WithdrawInfo,
  UserBankPaginator,
  MutationInitiateWithdrawalArgs,
  YellowcardNetwork,
  FinancialSummaryInput,
  FinancialSummaryResponse,
  MutationCreateSavedAccountArgs,
} from "../../gql/graphql";
import { $api } from "../../services";
import { CombinedError } from "urql";
import Common from "./Common";
import { Logic } from "..";
import { reactive } from "vue";

export default class Wallet extends Common {
  // Base Variables
  public CurrentExchangeRate: ExchangeRate | undefined;
  public ManyOffRampCurrencies: SupportedCurrency[] | undefined;
  public ManySavedAccounts: UserBankPaginator | undefined;
  public ManyPointTransactions: PointTransactionPaginator | undefined;
  public ManyTransactions: TransactionPaginator | undefined;
  public SinglePointTransaction: PointTransaction | undefined;
  public SingleTransaction: Transaction | undefined;
  public CurrentGlobalExchangeRate: GlobalExchangeRate | undefined;
  public CurrentOfframp: OffRamp | undefined;
  public CurrentWithdrawalInfo: WithdrawInfo | undefined;
  public CurrentYellowCardNetworks: YellowcardNetwork[] | undefined;
  public OnRampChannels: PaymentChannel[] | undefined;
  public OnRampNetwork: PaymentNetwork[] | undefined;
  public PointFinancialSummary: FinancialSummaryResponse | undefined;
  public CheckStatusState = reactive({
    active: false,
  });

  // Mutation Variables
  public CreateSavedAccountForm: MutationCreateSavedAccountArgs | undefined;
  public InitiateTopupForm: MutationInitiateTopupArgs | undefined;
  public InitiateWithdrawalForm: MutationInitiateWithdrawalArgs | undefined;
  public MakePaymentForm: MutationMakePaymentArgs | undefined;
  public RedeemGRPTokenForm: MutationRedeemGrpTokenArgs | undefined;

  constructor() {
    super();

    this.defineReactiveProperty("CurrentExchangeRate", undefined);
    this.defineReactiveProperty("ManyOffRampCurrencies", undefined);
    this.defineReactiveProperty("ManyPointTransactions", undefined);
    this.defineReactiveProperty("ManyTransactions", undefined);
    this.defineReactiveProperty("ManySavedAccounts", undefined);
    this.defineReactiveProperty("SinglePointTransaction", undefined);
    this.defineReactiveProperty("SingleTransaction", undefined);
    this.defineReactiveProperty("CurrentGlobalExchangeRate", undefined);
    this.defineReactiveProperty("NormalFinancialSummary", undefined);
    this.defineReactiveProperty("PointFinancialSummary", undefined);
    this.defineReactiveProperty("CurrentWithdrawalInfo", undefined);
    this.defineReactiveProperty("CurrentYellowCardNetworks", undefined);
    this.defineReactiveProperty("CurrentOfframp", undefined);
    this.defineReactiveProperty("ManyExchangeAds", undefined);
    this.defineReactiveProperty("SingleExchangeAd", undefined);
  }

  // Queries
  public GetExchangeRate = async (
    payload: QueryGetExchangeRateArgs
  ): Promise<ExchangeRate | undefined> => {
    return $api.wallet.GetExchangeRate(payload).then((response) => {
      this.CurrentExchangeRate = response.data?.GetExchangeRate;
      return this.CurrentExchangeRate;
    });
  };

  public GetOnRampChannels = async (
    countryCode: string
  ): Promise<PaymentChannel[] | undefined> => {
    return $api.wallet
      .GetOnRampChannelsByCountryCode(countryCode)
      .then((response) => {
        this.OnRampChannels = response.data?.GetOnRampChannelsByCountryCode;
        return this.OnRampChannels;
      });
  };

  public GetYellowCardNetwork = async (
    country_code: string
  ): Promise<YellowcardNetwork[] | undefined> => {
    return $api.wallet.GetYellowCardNetwork(country_code).then((response) => {
      this.CurrentYellowCardNetworks = response.data?.GetYellowCardNetwork;
      return this.CurrentYellowCardNetworks;
    });
  };

  public GetOnRampNetwork = async (
    countryCode: string
  ): Promise<PaymentNetwork[] | undefined> => {
    return $api.wallet
      .GetOnRampNetworkByCountryCode(countryCode)
      .then((response) => {
        this.OnRampNetwork = response.data?.GetOnRampNetworkByCountryCode;
        return this.OnRampNetwork;
      });
  };
  public GetWithdrawInfo = async (
    amount: number,
    currency: string
  ): Promise<WithdrawInfo | undefined> => {
    return $api.wallet.GetWithdrawInfo(amount, currency).then((response) => {
      this.CurrentWithdrawalInfo = response.data?.GetWithdrawInfo;
      return this.CurrentWithdrawalInfo;
    });
  };

  public GetSavedAccounts = async (first: number, page: number) => {
    return $api.wallet.GetSavedAccounts(first, page).then((response) => {
      this.ManySavedAccounts = response.data?.GetSavedAccounts;
      return this.ManySavedAccounts;
    });
  };

  public GetPointFinancialSummary = async (from = "", to = "") => {
    const input: FinancialSummaryInput = { type: "point", from, to };
    return $api.wallet.GetFinancialSummary(input).then((response) => {
      this.PointFinancialSummary = response.data?.GetFinancialSummary;
      return this.PointFinancialSummary;
    });
  };

  public GetGlobalExchangeRate = async (
    base = "USD",
    target = "",
    isBackground = false
  ): Promise<GlobalExchangeRate | undefined> => {
    if (!target) {
      target = Logic.Auth.AuthUser?.profile?.default_currency || "NGN";
    }
    return $api.wallet.GetGlobalExchangeRate(base, target).then((response) => {
      if (!isBackground) {
        this.CurrentGlobalExchangeRate = response.data?.GetGlobalExchangeRate;
      }
      return this.CurrentGlobalExchangeRate;
    });
  };
  public GetOnRampCurrencies = async (): Promise<
    SupportedCurrency[] | undefined
  > => {
    return $api.wallet
      .GetOnRampCurrencies()
      .then((response) => {
        return response.data?.GetOnRampCurrencies;
      })
      .catch((error: CombinedError) => {
        Logic.Common.showError(
          error,
          "Failed to fetch on-ramp currencies",
          "error-alert"
        );
        return undefined;
      });
  };

  public GetPointTransactions = async (
    page: number,
    count: number,
    orderType: "CREATED_AT",
    order = "DESC" as "DESC" | "ASC",
    whereQuery = ""
  ) => {
    return $api.wallet
      .GetPointTransactions(page, count, orderType, order, whereQuery)
      .then((response) => {
        this.ManyPointTransactions = response.data?.GetPointTransactions;
        return this.ManyPointTransactions;
      });
  };

  public GetTransactions = async (
    page: number,
    count: number,
    orderType: "CREATED_AT",
    order = "DESC" as "DESC" | "ASC",
    whereQuery = ""
  ) => {
    return $api.wallet
      .GetTransactions(page, count, orderType, order, whereQuery)
      .then((response) => {
        this.ManyTransactions = response.data?.GetTransactions;
        return this.ManyTransactions;
      });
  };

  public GetSinglePointTransaction = async (uuid: string) => {
    return $api.wallet.GetSinglePointTransaction(uuid).then((response) => {
      this.SinglePointTransaction = response.data?.GetSinglePointTransaction;
      return this.SinglePointTransaction;
    });
  };

  public GetSingleTransaction = async (uuid: string) => {
    return $api.wallet.GetSingleTransaction(uuid).then((response) => {
      this.SingleTransaction = response.data?.GetSingleTransaction;
      return this.SingleTransaction;
    });
  };

  public GetOfframp = async (uuid: string) => {
    if (!uuid) {
      this.CurrentOfframp = undefined;
      return Promise.resolve(true);
    }
    return $api.wallet.GetOfframp(uuid).then((response) => {
      this.CurrentOfframp = response.data?.GetOfframp;
      return this.CurrentOfframp;
    });
  };

  public GetBankAccountDetails = async (
    accountNumber: string,
    networkId: string
  ) => {
    return $api.wallet
      .GetBankAccountDetails(accountNumber, networkId)
      .then((response) => {
        return response.data?.GetBankAccountDetails;
      });
  };

  // Mutations
  public CreateSavedAccount = async () => {
    if (this.CreateSavedAccountForm) {
      return $api.wallet
        .CreateSavedAccount(this.CreateSavedAccountForm)
        .then((response) => {
          if (response.data?.CreateSavedAccount) {
            return response.data.CreateSavedAccount;
          }
        })
        .catch((error: CombinedError) => {
          Logic.Common.showError(error, "Oops!", "error-alert");
          throw error;
        });
    }
  };

  public RedeemGRPToken = async () => {
    if (this.RedeemGRPTokenForm) {
      return $api.wallet
        .RedeemGRPToken(this.RedeemGRPTokenForm)
        .then((response) => {
          if (response.data?.RedeemGRPToken) {
            return response.data.RedeemGRPToken;
          }
        })
        .catch((error: CombinedError) => {
          Logic.Common.showError(error, "Oops!", "error-alert");
          throw new Error(error.message);
        });
    }
  };

  public MakePayment = async () => {
    if (this.MakePaymentForm) {
      return $api.wallet
        .MakePayment(this.MakePaymentForm)
        .then((response) => {
          if (response.data?.MakePayment) {
            return response.data.MakePayment;
          }
        })
        .catch((error: CombinedError) => {
          Logic.Common.showError(error, "Oops!", "error-alert");
          throw new Error(error.message);
        });
    }
  };

  public InitiateWalletKYC = (currency: string) => {
    if (currency) {
      return $api.wallet
        .InitiateWalletKYC(currency)
        .then((response) => {
          if (response.data?.InitiateWalletKYC) {
            Logic.Common.hideLoader();
            return response.data.InitiateWalletKYC;
          }
        })
        .catch((error: CombinedError) => {
          Logic.Common.hideLoader();
          Logic.Common.showError(error, "Oops!", "error-alert");
          throw error;
        });
    }
  };

  public InitiateTopup = async () => {
    if (this.InitiateTopupForm) {
      return $api.wallet
        .InitiateTopup(this.InitiateTopupForm)
        .then((response) => {
          if (response.data?.InitiateTopup) {
            return response.data.InitiateTopup;
          }
        })
        .catch((error: CombinedError) => {
          Logic.Common.showError(error, "Oops!", "error-alert");
          throw new Error(error.message);
        });
    }
  };

  public InitiateWithdrawal = async () => {
    if (this.InitiateWithdrawalForm) {
      return $api.wallet
        .InitiateWithdrawal(this.InitiateWithdrawalForm)
        .then((response) => {
          if (response.data?.InitiateWithdrawal) {
            this.CurrentOfframp = response.data.InitiateWithdrawal;
            return response.data.InitiateWithdrawal;
          }
        })
        .catch((error: CombinedError) => {
          Logic.Common.showError(error, "Oops!", "error-alert");
          throw error;
        });
    }
  };

  public ConfirmWithdrawal = async (
    uuid: string,
    currency: string,
    amount: number,
    metadata = ""
  ) => {
    if (uuid) {
      return $api.wallet
        .ConfirmWithdrawal(uuid, currency, amount, metadata)
        .then((response) => {
          if (response.data?.ConfirmWithdrawal) {
            this.CurrentOfframp = response.data.ConfirmWithdrawal;
            return response.data.ConfirmWithdrawal;
          }
        })
        .catch((error: CombinedError) => {
          Logic.Common.showError(error, "Oops!", "error-alert");
          throw error;
        });
    }
  };
  public MonitorTopupStatus = (collectionId: string, cd_action: Function) => {
    this.CheckStatusState.active = true;
    $api.wallet
      .MonitorTopupStatus({ collection_id: collectionId })
      .then((response) => {
        if (response.data?.MonitorTopupStatus) {
          this.CheckStatusState.active = false;
          Logic.Auth.GetAuthUser();

          Logic.Common.showAlert({
            show: true,
            message: "Your wallet has been topup successfully!",
            type: "success",
          });

          cd_action();
        } else {
          if (this.CheckStatusState.active) {
            this.MonitorTopupStatus(collectionId, cd_action);
          }
        }
      })
      .catch((error: CombinedError) => {
        Logic.Common.showError(error, "Oops!", "error-alert");
        throw new Error(error.message);
      });
  };
}
