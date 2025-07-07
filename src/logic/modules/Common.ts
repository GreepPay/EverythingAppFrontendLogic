import currency from "currency.js";
import moment from "moment";
import { CombinedError } from "urql";
import { reactive } from "vue";
import {
  NavigationGuardNext,
  RouteLocationNormalized,
  RouteLocationNormalizedLoaded,
  Router,
} from "vue-router";
import { Logic } from "..";
import {
  AlertSetup,
  FetchRule,
  LoaderSetup,
  ModalSetup,
} from "../types/common";
import CryptoJS from "crypto-js";
import { Haptics, ImpactStyle } from "@capacitor/haptics";
import { Observable } from "./Observable";

export default class Common {
  public router: Router | undefined = undefined;

  public route: RouteLocationNormalizedLoaded | undefined = undefined;
  private _observables = new Map<string, Observable<any>>();

  public apiUrl: string | undefined = undefined;

  public watchInterval: number | undefined = undefined;

  public forcePageTransparency = false;

  public loadingState = false;

  public showBottomNav = false;

  public currentLayout = reactive({
    name: "",
    path: "",
    from: {
      name: "",
      path: "",
    },
  });

  public SetRouter = (router: Router) => {
    this.router = router;
  };

  public SetRoute = (route: RouteLocationNormalizedLoaded) => {
    this.route = route;
  };

  public loaderSetup: LoaderSetup = reactive({
    show: false,
    useModal: false,
    hasError: false,
    loading: false,
    message: "",
    ctaText: "",
    ctaFunction: () => {},
    icon: "success-thumb",
    title: "",
  });

  public modalSetup: ModalSetup = reactive({
    show: false,
    title: "",
    type: "",
    actionLabel: "",
    action: () => {},
  });

  public SetApiUrl = (apiUrl: string) => {
    this.apiUrl = apiUrl;
  };

  public GoToRoute = (path: string) => {
    this.router?.push(path);
  };

  public alertSetup = reactive<AlertSetup>({
    show: false,
    message: "",
    type: "success",
  });

  constructor() {
    // Init observable wrappers only for selected properties
    this.defineReactiveProperty("router", undefined);
    this.defineReactiveProperty("route", undefined);
    this.defineReactiveProperty("apiUrl", undefined);
    this.defineReactiveProperty("watchInterval", undefined);
    this.defineReactiveProperty("loadingState", false);
    this.defineReactiveProperty("showBottomNav", false);
    this.defineReactiveProperty("forcePageTransparency", false);
    this.defineReactiveProperty("loaderSetup", this.loaderSetup);
    this.defineReactiveProperty("modalSetup", this.modalSetup);
    this.defineReactiveProperty("alertSetup", this.alertSetup);
    this.defineReactiveProperty("currentLayout", this.currentLayout);
  }

  protected defineReactiveProperty<T = any>(prop: string, initialValue: T) {
    const obs = new Observable<T>(initialValue);
    this._observables.set(prop, obs);

    Object.defineProperty(this, prop, {
      get() {
        return obs.value;
      },
      set(val: T) {
        obs.value = val;
      },
      configurable: true,
      enumerable: true,
    });
  }

  public encryptData = (jsonData: object, secretKey: string): string => {
    return CryptoJS.AES.encrypt(JSON.stringify(jsonData), secretKey).toString();
  };

  public decryptData = (encryptedData: string, secretKey: string): object => {
    const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  };

  public base64ToBlob = async (url: string) => {
    return fetch(url)
      .then((res) => res.blob())
      .then((data) => {
        return data;
      });
  };

  public showAlert = (alertSetup: AlertSetup) => {
    const showAlertHandler = (wait_until_next_alert = false) => {
      this.alertSetup = alertSetup;

      if (wait_until_next_alert) {
        return;
      }

      setTimeout(() => {
        this.alertSetup = {
          show: false,
          message: "",
          type: "success",
        };
      }, 5100);
    };
    if (this.alertSetup.show) {
      // sleep for 5 seconds
      new Promise((resolve) => setTimeout(resolve, 5000)).then(() => {
        this.alertSetup = {
          show: false,
          message: "",
          type: "success",
        };

        showAlertHandler(alertSetup.wait_until_next_alert);
      });
    } else {
      showAlertHandler(alertSetup.wait_until_next_alert);
    }
  };

  public showError = (
    error: CombinedError,
    title: string,
    icon: "error-alert" | "error-kite" | "success-kite" | "success-thumb",
    fallbackMsg = ""
  ) => {
    const message = error.graphQLErrors[0].message;
    // this.showLoader({
    //   show: true,
    //   useModal: true,
    //   loading: false,
    //   hasError: true,
    //   message: message != "null" ? message : fallbackMsg,
    //   icon,
    //   title,
    // });

    this.showAlert({
      show: true,
      message: message,
      type: "error",
    });
  };

  public showModal = (modalSetupData: ModalSetup) => {
    this.modalSetup = modalSetupData;
  };

  public getLabel = (data: any, key: string) => {
    const thisData = data.filter((Option: any) => {
      return Option.key == key;
    });

    return thisData.length > 0 ? thisData[0].value : "";
  };

  public showLoader = (loaderSetup: LoaderSetup) => {
    this.loaderSetup = loaderSetup;
  };

  public goBack = () => {
    window.history.length > 1 ? this.router?.go(-1) : this.router?.push("/");
  };

  public hideLoader = () => {
    const Loader: LoaderSetup = {
      show: false,
      useModal: false,
      loading: false,
    };
    this.loaderSetup = Loader;
  };

  public globalParameters = reactive<{
    currency: string;
  }>({
    currency: "ngn",
  });

  public momentInstance = moment;

  public makeTouchSensation = async (style: "HEAVY" | "MEDIUM" | "LIGHT") => {
    let currentStyle = ImpactStyle.Light;

    if (style == "MEDIUM") {
      currentStyle = ImpactStyle.Medium;
    } else if (style == "HEAVY") {
      currentStyle = ImpactStyle.Heavy;
    }
    await Haptics.impact({ style: currentStyle });
  };

  public makeid = (length: number) => {
    let result = "";
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };
  public convertToMoney = (
    float: any,
    withZeros = true,
    currencyType = "ngn",
    withSymbol = true
  ) => {
    let currencySymbol = "";
    if (currencyType == "usd") {
      currencySymbol = "$ ";
    } else if (currencyType == "ngn") {
      currencySymbol = "₦ ";
    }
    if (!withSymbol) {
      currencySymbol = "";
    }
    if (withZeros) {
      return currency(float, {
        separator: ",",
        symbol: currencySymbol,
      }).format();
    } else {
      return currencySymbol + new Intl.NumberFormat().format(parseFloat(float));
    }
  };

  private isString = (x: any) => {
    return Object.prototype.toString.call(x) === "[object String]";
  };

  public searchArray = (arr: any[], searchKey: string) => {
    return arr.filter((obj) => {
      return Object.keys(obj).some((key) => {
        return this.isString(obj[key]) ? obj[key].includes(searchKey) : false;
      });
    });
  };

  public debounce = (
    method = () => {
      //
    },
    delay = 500
  ) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    if (typeof window.LIT !== "undefined") {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      clearTimeout(window.LIT);
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    window.LIT = setTimeout(() => {
      method();
    }, delay);
  };

  public watchProperty = (objectToWatch: string, objectToUpdate: any) => {
    let upatedValue = (this as any)[`${objectToWatch}`];
    const watchAction = () => {
      upatedValue = (this as any)[`${objectToWatch}`];
      if (objectToUpdate) {
        objectToUpdate.value = upatedValue;
      }
      this.watchInterval = window.requestAnimationFrame(watchAction);
    };

    watchAction();
  };

  public stopWatchAction = () => {
    if (this.watchInterval != undefined) {
      window.cancelAnimationFrame(this.watchInterval);
    }
  };

  private fetchFile = (url: string) => {
    return new Promise(function (resolve, reject) {
      // Get file name from url.
      const xhr = new XMLHttpRequest();
      xhr.responseType = "blob";
      xhr.onload = function () {
        resolve(xhr);
      };
      xhr.onerror = reject;
      xhr.open("GET", url);
      xhr.send();
    }).then(function (xhr: any) {
      const filename = url.substring(url.lastIndexOf("/") + 1).split("?")[0];
      const a = document.createElement("a");
      a.href = window.URL.createObjectURL(xhr.response); // xhr.response is a blob
      a.download = filename; // Set the file name.
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      return xhr;
    });
  };

  public downloadFiles = (urls = []) => {
    return Promise.all(urls.map(this.fetchFile));
  };

  public fomartDate = (date: string, format: string) => {
    return moment(date).format(format);
  };

  public countDownTime = (endTime: string) => {
    return moment(moment(endTime).diff(moment.now())).format("mm:ss");
  };

  public timeFromNow = (time: string) => {
    return moment(time).fromNow();
  };

  public updatedData = (oldData: any, newData: any) => {
    if (oldData != undefined && newData != undefined) {
      return { ...oldData, ...newData };
    }
    return oldData;
  };

  public preFetchRouteData = (
    routeTo: RouteLocationNormalized,
    next: NavigationGuardNext,
    routeFrom: RouteLocationNormalized
  ) => {
    const allActions: Promise<any>[] = [];
    if (this.loaderSetup.loading) {
      return;
    }

    const routeMiddlewares: any = routeTo.meta.middlewares;

    // handle fetchRules

    const fetchRules: FetchRule[] = routeMiddlewares.fetchRules || [];

    let BreakException = {};

    // Check for transparency settings
    const transparencySettings = routeMiddlewares.enforceTransparency;

    if (transparencySettings) {
      this.forcePageTransparency = true;
    } else {
      this.forcePageTransparency = false;
    }

    // Hide modal
    this.showModal({ show: false });

    try {
      for (let index = 0; index < fetchRules.length; index++) {
        const rule: FetchRule = JSON.parse(JSON.stringify(fetchRules[index]));

        if (rule.requireAuth) {
          if (!Logic.Auth.AuthUser) {
            window.location.href = "/start";

            throw BreakException;
          }
        }

        let addRuleToRequest = true;

        if (rule.condition) {
          switch (rule.condition.routeSearchItem) {
            case "fullPath":
              addRuleToRequest = routeTo["fullPath"].includes(
                rule.condition.searchQuery
              );
              break;
            case "params":
              addRuleToRequest = routeTo["params"][rule.condition.searchQuery]
                ? true
                : false;
              break;
            case "query":
              addRuleToRequest = routeTo["query"][rule.condition.searchQuery]
                ? true
                : false;
              break;
            default:
              break;
          }
        }

        if (addRuleToRequest) {
          // @ts-ignore
          const domain = Logic[rule.domain];

          let fetchData = false;

          if (domain[rule.property] == undefined) {
            fetchData = true;
          }

          if (
            typeof rule.ignoreProperty == "function" &&
            rule.ignoreProperty()
          ) {
            fetchData = true;
          }

          if (rule.ignoreProperty) {
            fetchData = true;
          }

          if (routeFrom && routeFrom.query.force_load) {
            fetchData = true;
          }

          if (rule.subProperty) {
            if (domain[rule.property][rule.subProperty] == undefined) {
              fetchData = true;
            }
          }

          if (fetchData) {
            allActions.push(
              new Promise((resolve) => {
                const routeId = [];
                if (rule.useRouteId) {
                  routeId.push(routeTo.params.id.toString());
                }

                if (rule.useRouteQuery) {
                  const allQueries: any[] = [];
                  const catenation_type = rule.query_concatenation_type
                    ? rule.query_concatenation_type
                    : "prehend";
                  rule.queries?.forEach((item) => {
                    if (catenation_type == "prehend") {
                      allQueries.unshift(routeTo.query[item]);
                    } else {
                      allQueries.push(routeTo.query[item]);
                    }
                  });
                  if (catenation_type == "append") {
                    rule.params.push(...allQueries);
                  } else {
                    rule.params.unshift(...allQueries);
                  }
                }

                // update userid
                rule.params.forEach((param) => {
                  if (typeof param === "object") {
                    if (param.where) {
                      param.where.forEach((item: any) => {
                        if (item.field == "user.id" || item.field == "userId") {
                          item.value = Logic.Auth.AuthUser?.uuid;
                        }
                      });
                    }
                  }
                });

                const allParameter = rule.params;

                if (routeId.length) {
                  allParameter.unshift(...routeId);
                }

                const request = domain[rule.method](...allParameter);

                request?.then((value: any) => {
                  resolve(value);
                });
              })
            );
          } else {
            if (rule.silentUpdate) {
              // run in silence
              if (rule.useRouteId) {
                rule.params.unshift(routeTo.params.id.toString());
              }
              if (rule.useRouteQuery) {
                const allQueries: any[] = [];
                const catenation_type = rule.query_concatenation_type
                  ? rule.query_concatenation_type
                  : "prehend";
                rule.queries?.forEach((item) => {
                  if (catenation_type == "prehend") {
                    allQueries.unshift(routeTo.query[item]);
                  } else {
                    allQueries.push(routeTo.query[item]);
                  }
                });
                if (catenation_type == "append") {
                  rule.params.push(...allQueries);
                } else {
                  rule.params.unshift(...allQueries);
                }
              }
              rule.params = [...new Set(rule.params)];
              setTimeout(() => {
                domain[rule.method](...rule.params);
              }, 1000);
            }
          }
        }
      }
    } catch (error) {
      if (error !== BreakException) throw error;
    }

    // save user activities

    if (routeMiddlewares.tracking_data) {
      const trackingData: any = routeMiddlewares.tracking_data;
      // Logic.User.SaveUserActivity(
      //   trackingData.lable,
      //   'page_view',
      //   undefined,
      //   trackingData,
      // )
    }

    const showBottomNav = () => {
      // page layout
      const layout: any = routeTo.meta?.layout;
      if (layout == "Dashboard") {
        this.showBottomNav = true;
      } else {
        this.showBottomNav = false;
      }

      this.currentLayout = {
        name: routeTo.meta.layout as string,
        path: routeTo.path as string,
        from: {
          name: routeFrom.meta.layout as string,
          path: routeFrom.path as string,
        },
      };
    };

    if (allActions.length > 0) {
      this.showLoader({
        loading: true,
        show: true,
      });

      Promise.all(allActions).then(() => {
        this.hideLoader();
        showBottomNav();
        return next();
      });
    } else {
      this.hideLoader();
      showBottomNav();
      return next();
    }
  };
}
