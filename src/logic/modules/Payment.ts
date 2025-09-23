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
} from "../../gql/graphql";
import { $api } from "../../services";
import { CombinedError } from "urql";
import Common from "./Common";
import { Logic } from "..";
import { reactive } from "vue";

export default class PaymentModule extends Common {
  constructor() {
    super();
    this.defineReactiveProperty("CurrentExchangeRate", undefined);
    this.defineReactiveProperty("CurrentGlobalExchangeRate", undefined);
    this.defineReactiveProperty("OnRampChannels", undefined);
    this.defineReactiveProperty("OnRampNetwork", undefined);
    this.defineReactiveProperty("CheckStatusState", {
      active: false,
    });
  }

  // Base Variables
  public CurrentExchangeRate: ExchangeRate | undefined;
  public CurrentGlobalExchangeRate: GlobalExchangeRate | undefined;
  public OnRampChannels: PaymentChannel[] | undefined;
  public OnRampNetwork: PaymentNetwork[] | undefined;
  public CheckStatusState = reactive({
    active: false,
  });

  // Mutation Variables
  public InitiateTopupForm: MutationInitiateTopupArgs | undefined;
  public MakePaymentForm: MutationMakePaymentArgs | undefined;
  public RedeemGRPTokenForm: MutationRedeemGrpTokenArgs | undefined;

  // Queries
  public GetExchangeRate = async (
    payload: QueryGetExchangeRateArgs
  ): Promise<ExchangeRate | undefined> => {
    return $api.payment.GetExchangeRate(payload).then((response) => {
      this.CurrentExchangeRate = response.data?.GetExchangeRate;
      return this.CurrentExchangeRate;
    });
  };

  public GetOnRampChannels = async (
    countryCode: string
  ): Promise<PaymentChannel[] | undefined> => {
    return $api.payment
      .GetOnRampChannelsByCountryCode(countryCode)
      .then((response) => {
        this.OnRampChannels = response.data?.GetOnRampChannelsByCountryCode;
        return this.OnRampChannels;
      });
  };

  public GetOnRampNetwork = async (
    countryCode: string
  ): Promise<PaymentNetwork[] | undefined> => {
    return $api.payment
      .GetOnRampNetworkByCountryCode(countryCode)
      .then((response) => {
        this.OnRampNetwork = response.data?.GetOnRampNetworkByCountryCode;
        return this.OnRampNetwork;
      });
  };

  public GetGlobalExchangeRate = async (
    base = "USD",
    target = ""
  ): Promise<GlobalExchangeRate | undefined> => {
    if (!target) {
      target = Logic.Auth.AuthUser?.profile?.default_currency || "NGN";
    }
    return $api.payment.GetGlobalExchangeRate(base, target).then((response) => {
      this.CurrentGlobalExchangeRate = response.data?.GetGlobalExchangeRate;
      return this.CurrentGlobalExchangeRate;
    });
  };
  public GetOnRampCurrencies = async (): Promise<
    SupportedCurrency[] | undefined
  > => {
    return $api.payment
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

  // Mutations
  public RedeemGRPToken = async () => {
    if (this.RedeemGRPTokenForm) {
      return $api.payment
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
      return $api.payment
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

  public InitiateTopup = async () => {
    if (this.InitiateTopupForm) {
      return $api.payment
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

  public MonitorTopupStatus = (collectionId: string, cd_action: Function) => {
    this.CheckStatusState.active = true;
    $api.payment
      .MonitorTopupStatus({
        collection_id: collectionId,
      })
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
