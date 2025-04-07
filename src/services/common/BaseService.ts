import {
  createClient,
  Client,
  cacheExchange,
  CombinedError,
  fetchExchange,
  OperationResult,
} from "urql"
import { multipartFetchExchange } from "@urql/exchange-multipart-fetch"
import { Logic } from "../../logic/modules"
import { API_URL } from "../../common/constants"

export class BaseApiService {
  private baseUrl: string = API_URL
  public graphqlInstance: Client | undefined

  constructor() {}

  public customFetch = (
    url: string,
    options: RequestInit,
    onProgress: (progress: number) => void
  ) => {
    return new Promise<Response>((resolve, reject) => {
      const xhr = new XMLHttpRequest()

      xhr.open(options.method || "POST", url)

      // Set headers from options
      if (options.headers) {
        Object.entries(options.headers).forEach(([key, value]) => {
          xhr.setRequestHeader(key, value as string)
        })
      }

      // Track upload progress
      if (xhr.upload && options.body) {
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const progress = (event.loaded / event.total) * 100
            onProgress(progress)
          }
        }
      }

      xhr.onload = () => {
        resolve(
          new Response(xhr.responseText, {
            status: xhr.status,
            statusText: xhr.statusText,
            headers: new Headers(
              // @ts-ignore
              xhr
                .getAllResponseHeaders()
                .trim()
                .split(/[\r\n]+/)
                .map((line) => line.split(": "))
            ),
          })
        )
      }

      xhr.onerror = () => {
        reject(new Error("Network error"))
      }

      xhr.send(options.body as Document | XMLHttpRequestBodyInit | null)
    })
  }

  public query = (query: any, variables: any): Promise<any> => {
    if (Logic.Common.apiUrl) {
      this.baseUrl = Logic.Common.apiUrl || ""
    }

    this.graphqlInstance = createClient({
      url: this.baseUrl,
      fetchOptions: () => {
        return {
          headers: {
            authorization: Logic.Auth.AccessToken
              ? `Bearer ${Logic.Auth.AccessToken}`
              : "",
            app_version: localStorage.getItem("app_version") || "",
            //   requestUuid: Logic.Auth.RequestUuid || '',
          },
        }
      },
      exchanges: [cacheExchange, fetchExchange],
    })

    return this.graphqlInstance
      .query(query, variables)
      .toPromise()
      .then((response) => {
        if (response.error) {
          this.handleErrors(response.error)
          throw response.error
        }

        return response
      })
  }

  public subscription = (
    query: any,
    variables: any,
    handleSubscription: any,
    handleOnSubscribed = () => {
      //
    }
  ): any => {
    if (Logic.Common.apiUrl) {
      this.baseUrl = Logic.Common.apiUrl || ""
    }

    this.graphqlInstance = createClient({
      url: this.baseUrl,
      fetchOptions: () => {
        return {
          headers: {
            authorization: Logic.Auth.AccessToken
              ? `Bearer ${Logic.Auth.AccessToken}`
              : "",
            app_version: localStorage.getItem("app_version") || "",
            //   requestUuid: Logic.Auth.RequestUuid || '',
          },
        }
      },
      fetchSubscriptions: true,
      exchanges: [cacheExchange, fetchExchange],
    })

    return this.graphqlInstance
      .subscription(query, variables)
      .subscribe((result: OperationResult<any, any>) => {
        handleOnSubscribed()
        // this.subscribeToEcho(
        // 	// @ts-ignore
        // 	Logic.Common.laravelEcho,
        // 	result.extensions?.lighthouse_subscriptions.channel || null,
        // 	handleSubscription,
        // )
      })
  }

  public mutation = (query: any, variables: any): Promise<any> => {
    if (Logic.Common.apiUrl) {
      this.baseUrl = Logic.Common.apiUrl || ""
    }
    this.graphqlInstance = createClient({
      url: this.baseUrl,
      fetchOptions: () => {
        return {
          headers: {
            authorization: Logic.Auth.AccessToken
              ? `Bearer ${Logic.Auth.AccessToken}`
              : "",
            app_version: localStorage.getItem("app_version") || "",
            //   requestUuid: Logic.Auth.RequestUuid || '',
          },
        }
      },
      exchanges: [cacheExchange, multipartFetchExchange],
    })

    return this.graphqlInstance
      .mutation(query, variables)
      .toPromise()
      .then((response) => {
        if (response.error) {
          this.handleErrors(response.error)
          throw response.error
        }

        return response
      })
  }

  public mutationWithProgress = (
    query: any,
    variables: any,
    progressCb: (progress: number) => void
  ): Promise<any> => {
    if (Logic.Common.apiUrl) {
      this.baseUrl = Logic.Common.apiUrl || ""
    }
    this.graphqlInstance = createClient({
      url: this.baseUrl,
      fetchOptions: () => {
        return {
          headers: {
            authorization: Logic.Auth.AccessToken
              ? `Bearer ${Logic.Auth.AccessToken}`
              : "",
            app_version: localStorage.getItem("app_version") || "",
            //   requestUuid: Logic.Auth.RequestUuid || '',
          },
        }
      },
      exchanges: [cacheExchange, multipartFetchExchange],
      fetch: (url: any, options: any) => {
        return this.customFetch(url, options, progressCb) as any
      },
    })

    return this.graphqlInstance
      .mutation(query, variables)
      .toPromise()
      .then((response) => {
        if (response.error) {
          this.handleErrors(response.error)
          throw response.error
        }

        return response
      })
  }

  public handleErrors(err: CombinedError): void {
    // Note: here you may want to add your errors handling

    if (err.networkError) {
      Logic.Common.showLoader({
        show: true,
        loading: false,
        icon: "error-alert",
        title: "Network error",
        message: "Unable to connect, please check your internet connection.",
      })
      return
    }

    if (err.graphQLErrors) {
      if (err.graphQLErrors[0].message == "Unauthenticated.") {
        Logic.Common.hideLoader()
        // clear this.Storage
        //   Logic.Auth.Storage.clear()
        localStorage.clear()

        //   if (Logic.Common.currentBuildType() == 'web') {
        // 	window.location.href = '/auth/login'
        //   } else {
        // 	window.location.href = '/start'
        //   }

        return
      }
    }
  }
}
