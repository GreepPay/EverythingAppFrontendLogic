import {
  BankAccountNameResponse,
  MutationInitiateTopupArgs,
  MutationMakePaymentArgs,
  MutationRedeemGrpTokenArgs,
  ExchangeRate,
  FlutterwaveBank,
  FlutterwaveBankBranch,
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
  ExchangeAd,
  ExchangeAdPaginator,
  ExchangeOrder,
  P2pPaymentMethod,
  P2pPaymentMethodPaginator,
  MutationCreateP2pPaymentMethodArgs,
  MutationUpdateP2pPaymentMethodArgs,
  MutationSoftDeleteP2pPaymentMethodArgs,
  PaymentDetailsResponse,
  ExchangeOrderPaginator,
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
  public ResolvedBankAccountName: BankAccountNameResponse | undefined;
  public CurrentWithdrawalInfo: WithdrawInfo | undefined;
  public NormalFinancialSummary: FinancialSummaryResponse | undefined;
  public CurrentYellowCardNetworks: YellowcardNetwork[] | undefined;
  public OnRampChannels: PaymentChannel[] | undefined;
  public ManyBanksByCountry: FlutterwaveBank[] | undefined;
  public OffRampChannels: PaymentChannel[] | undefined;
  public OnRampNetwork: PaymentNetwork[] | undefined;
  public PointFinancialSummary: FinancialSummaryResponse | undefined;
  public CheckStatusState = reactive({
    active: false,
  });
  public CurrentPaymentDetail: PaymentDetailsResponse | undefined;

  // P2P Variables
  public ManyExchangeAds: ExchangeAdPaginator | undefined;
  public SingleExchangeAd: ExchangeAd | undefined;
  public ManyRecommendedExchangeAds: ExchangeAdPaginator | undefined;
  public ManyP2pOrders: ExchangeOrderPaginator | undefined;
  public SingleP2pOrder: ExchangeOrder | undefined;
  public ManyP2pPaymentMethods: P2pPaymentMethodPaginator | undefined;
  public SingleP2pPaymentMethod: P2pPaymentMethod | undefined;
  public CurrentCryptoTransfer: OffRamp | undefined;

  // Mutation Variables
  public CreateSavedAccountForm: MutationCreateSavedAccountArgs | undefined;
  public InitiateTopupForm: MutationInitiateTopupArgs | undefined;
  public InitiateWithdrawalForm: MutationInitiateWithdrawalArgs | undefined;
  public MakePaymentForm: MutationMakePaymentArgs | undefined;
  public RedeemGRPTokenForm: MutationRedeemGrpTokenArgs | undefined;

  // P2P Mutation Variables
  public CreateP2pPaymentMethodForm:
    | MutationCreateP2pPaymentMethodArgs
    | undefined;
  public UpdateP2pPaymentMethodForm:
    | MutationUpdateP2pPaymentMethodArgs
    | undefined;
  public SoftDeleteP2pPaymentMethodForm:
    | MutationSoftDeleteP2pPaymentMethodArgs
    | undefined;

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
    this.defineReactiveProperty("ManyRecommendedExchangeAds", undefined);
    this.defineReactiveProperty("ManyP2pOrders", undefined);
    this.defineReactiveProperty("SingleP2pOrder", undefined);
    this.defineReactiveProperty("ManyP2pPaymentMethods", undefined);
    this.defineReactiveProperty("SingleP2pPaymentMethod", undefined);
    this.defineReactiveProperty("OnRampChannels", undefined);
    this.defineReactiveProperty("OffRampChannels", undefined);
    this.defineReactiveProperty("OnRampNetwork", undefined);
    this.defineReactiveProperty("CurrentCryptoTransfer", undefined);
    this.defineReactiveProperty("CheckStatusState", { active: false });
    this.defineReactiveProperty("CurrentPaymentDetail", undefined);
    this.defineReactiveProperty("ManyBanksByCountry", undefined);
    this.defineReactiveProperty("ManyBankBranches", undefined);
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
    if (!countryCode) {
      countryCode = localStorage.getItem("default_country_code") ?? "";
    }
    return $api.wallet
      .GetOnRampChannelsByCountryCode(countryCode)
      .then((response) => {
        this.OnRampChannels = response.data?.GetOnRampChannelsByCountryCode;
        return this.OnRampChannels;
      });
  };

  public GetOffRampChannels = async (
    countryCode: string
  ): Promise<PaymentChannel[] | undefined> => {
    if (!countryCode) {
      countryCode = localStorage.getItem("default_country_code") ?? "";
    }
    return $api.wallet
      .GetOffRampChannelsByCountryCode(countryCode)
      .then((response) => {
        this.OffRampChannels = response.data?.GetOffRampChannelsByCountryCode;
        return this.OffRampChannels;
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

  public GetManyP2POrders = async (
    page: number,
    count: number,
    orderType: "CREATED_AT",
    order = "DESC" as "DESC" | "ASC",
    whereQuery = ""
  ): Promise<ExchangeOrderPaginator | undefined> => {
    return $api.wallet
      .GetManyP2POrders(page, count, orderType, order, whereQuery)
      .then((response) => {
        this.ManyP2pOrders = response.data?.GetMyP2POrders;
        return this.ManyP2pOrders;
      });
  };

  public GetOnRampNetwork = async (
    countryCode: string
  ): Promise<PaymentNetwork[] | undefined> => {
    if (!countryCode) {
      countryCode = localStorage.getItem("default_country_code") ?? "";
    }
    return $api.wallet
      .GetOnRampNetworkByCountryCode(countryCode)
      .then((response) => {
        this.OnRampNetwork = response.data?.GetOnRampNetworkByCountryCode;
        return this.OnRampNetwork;
      });
  };
  public GetWithdrawInfo = async (
    amount: number,
    currency: string,
    countryCode = ""
  ): Promise<WithdrawInfo | undefined> => {
    return $api.wallet
      .GetWithdrawInfo(amount, currency, countryCode)
      .then((response) => {
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
  
  public GetBanksByCountry = async (
    country: string
  ): Promise<FlutterwaveBank[] | undefined> => {
    return $api.wallet.GetBanksByCountry(country).then((response) => {
      this.ManyBanksByCountry = response.data?.GetBanksByCountry;
      return this.ManyBanksByCountry;
    });
  };

  
  public GetPointFinancialSummary = async (from = "", to = "") => {
    const input: FinancialSummaryInput = { type: "point", from, to };
    return $api.wallet.GetFinancialSummary(input).then((response) => {
      this.PointFinancialSummary = response.data?.GetFinancialSummary;
      return this.PointFinancialSummary;
    });
  };
  
  public ResolveBankAccountName = async (
    account_number: string,
    bank_code: string
  ): Promise<BankAccountNameResponse | undefined> => {
    return $api.wallet
      .ResolveBankAccountName(account_number, bank_code)
      .then((response) => {
        this.ResolvedBankAccountName = response.data?.ResolveBankAccountName;
        return this.ResolvedBankAccountName;
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
      return response.data?.GetGlobalExchangeRate;
    });
  };

  public GetPaymentDetails = async (payment_uuid: string) => {
    return $api.wallet.GetPaymentDetails(payment_uuid).then((response) => {
      this.CurrentPaymentDetail = response.data?.GetPaymentDetails;

      return response.data?.GetPaymentDetails;
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

  public GetNormalFinancialSummary = async (from = "", to = "") => {
    const input: FinancialSummaryInput = {
      type: "normal",
      from,
      to,
    };
    return $api.wallet.GetFinancialSummary(input).then((response) => {
      this.NormalFinancialSummary = response.data?.GetFinancialSummary;
      return this.NormalFinancialSummary;
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

  public GetSmileIdToken = async (verification_type: string) => {
    return $api.wallet.GetSmileIdToken(verification_type).then((response) => {
      return response.data?.GetSmileIdToken;
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

  public CreateCrpytoTransfer = async (
    crypto: string,
    network: string,
    wallet_uuid = ""
  ) => {
    if (crypto && network) {
      return $api.wallet
        .CreateCrpytoTransfer(crypto, network, wallet_uuid)
        .then((response) => {
          if (response.data?.CreateCrpytoTransfer) {
            this.CurrentCryptoTransfer = response.data.CreateCrpytoTransfer;
            return response.data.CreateCrpytoTransfer;
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

  public VerifyFlutterwaveTransaction = async (reference: string) => {
    if (reference) {
      return $api.wallet
        .VerifyFlutterwaveTransaction(reference)
        .then((response) => {
          if (response.data?.VerifyFlutterwaveTransaction) {
            return response.data.VerifyFlutterwaveTransaction;
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
  public UploadFile = async (file: File) => {
    Logic.Common.showLoader({ loading: true, show: true });
    return $api.wallet
      .UploadFile(file)
      .then((response) => {
        if (response.data?.UploadFile) {
          Logic.Common.hideLoader();
          return response.data.UploadFile;
        }
      })
      .catch((error: CombinedError) => {
        Logic.Common.hideLoader();
        Logic.Common.showError(error, "Oops!", "error-alert");
        throw error;
      });
  };

  // P2P Methods
  public GetRecommendedExchangeAds = async (
    page: number,
    count: number,
    ad_type = "buy"
  ): Promise<ExchangeAdPaginator | undefined> => {
    return $api.wallet
      .GetRecommendedExchangeAds(page, count, ad_type)
      .then((response) => {
        const newData = response.data?.GetRecommendedExchangeAds;

        if (page === 1) {
          // First page - replace data
          this.ManyRecommendedExchangeAds = newData;
        } else {
          // Subsequent pages - append data
          if (this.ManyRecommendedExchangeAds && newData) {
            // Merge the data arrays
            const existingData = this.ManyRecommendedExchangeAds.data || [];
            const newAds = newData.data || [];

            this.ManyRecommendedExchangeAds = {
              ...newData,
              data: [...existingData, ...newAds],
            };
          } else {
            this.ManyRecommendedExchangeAds = newData;
          }
        }

        return this.ManyRecommendedExchangeAds;
      })
      .catch((error: CombinedError) => {
        Logic.Common.showError(
          error,
          "Failed to fetch recommended exchange ads",
          "error-alert"
        );
        return undefined;
      });
  };

  public GetP2pPaymentMethods = async (
    page: number,
    count: number
  ): Promise<P2pPaymentMethodPaginator | undefined> => {
    return $api.wallet
      .GetP2pPaymentMethods(page, count)
      .then((response) => {
        this.ManyP2pPaymentMethods = response.data?.GetMyP2pPaymentMethods;
        return this.ManyP2pPaymentMethods;
      })
      .catch((error: CombinedError) => {
        Logic.Common.showError(
          error,
          "Failed to fetch P2P payment methods",
          "error-alert"
        );
        return undefined;
      });
  };

  public CreateP2pPaymentMethod = async () => {
    if (this.CreateP2pPaymentMethodForm) {
      return $api.wallet
        .CreateP2pPaymentMethod(this.CreateP2pPaymentMethodForm)
        .then((response) => {
          if (response.data?.CreateP2pPaymentMethod) {
            return response.data.CreateP2pPaymentMethod;
          }
        })
        .catch((error: CombinedError) => {
          Logic.Common.showError(
            error,
            "Failed to create P2P payment method",
            "error-alert"
          );
          throw error;
        });
    }
  };

  public UpdateP2pPaymentMethod = async () => {
    if (this.UpdateP2pPaymentMethodForm) {
      return $api.wallet
        .UpdateP2pPaymentMethod(this.UpdateP2pPaymentMethodForm)
        .then((response) => {
          if (response.data?.UpdateP2pPaymentMethod) {
            return response.data.UpdateP2pPaymentMethod;
          }
        })
        .catch((error: CombinedError) => {
          Logic.Common.showError(
            error,
            "Failed to update P2P payment method",
            "error-alert"
          );
          throw error;
        });
    }
  };

  public SoftDeleteP2pPaymentMethod = async () => {
    if (this.SoftDeleteP2pPaymentMethodForm) {
      return $api.wallet
        .SoftDeleteP2pPaymentMethod(this.SoftDeleteP2pPaymentMethodForm)
        .then((response) => {
          if (response.data?.SoftDeleteP2pPaymentMethod) {
            return response.data.SoftDeleteP2pPaymentMethod;
          }
        })
        .catch((error: CombinedError) => {
          Logic.Common.showError(
            error,
            "Failed to delete P2P payment method",
            "error-alert"
          );
          throw error;
        });
    }
  };

  public CreateP2pOrder = async (orderData: {
    exchange_ad_uuid: string;
    amount: number;
    delivery_address: string;
    city: string;
    country: string;
    payment_type: string;
    payout_option: string;
    conversation_uuid: string;
    metadata?: string;
  }) => {
    return $api.wallet
      .CreateP2pOrder(orderData)
      .then((response) => {
        if (response.data?.CreateP2pOrder) {
          Logic.Common.hideLoader();
          return response.data.CreateP2pOrder;
        }
      })
      .catch((error: CombinedError) => {
        Logic.Common.hideLoader();
        Logic.Common.showError(error, "Oops!", "error-alert");
        throw error;
      });
  };

  public ReleaseP2pFunds = async (
    order_uuid: string,
    amount: number,
    metadata?: string
  ) => {
    return $api.wallet
      .ReleaseP2pFunds(order_uuid, amount, metadata)
      .then((response) => {
        if (response.data?.ReleaseP2pFunds) {
          Logic.Common.showAlert({
            show: true,
            message: "P2P funds released successfully!",
            type: "success",
          });
          return response.data.ReleaseP2pFunds;
        }
      })
      .catch((error: CombinedError) => {
        Logic.Common.showError(
          error,
          "Failed to release P2P funds",
          "error-alert"
        );
        throw error;
      });
  };
}
