# FrontendLogicGraphQL

Every frontend projects at Ceedlab has its FrontendLogic packaged as a NPM package. This package helps to abstract all the frontend business logic of a project from the main application. This  `FrontendLogicGraphQL` is a variation of the `FrontendLogic` package with `GraphQL` as the base protocol for communicating with the project backend.

The purpose of this micro-frontend development strategy is to simplifies the maintenance process and makes it easily for team members to collaborate on a single product without conflits.

## How to use

The goal of this repository is for it to be use as a template for new FrontendLogic packages. 

To start clone this repository
```
git clone https://drayfocus1@bitbucket.org/cc-portfolio/frontendlogicgraphql.git
```

Update the `git remote origin url` with your package repository.
```
git remote set-url origin {your_package_repo_url}
```

Update the package name in the `package.json` file to your package name.
```
{
  "name": "{app_name}/logic",
  "version": "0.0.1",
  "description": "Frontend logic for {App name}",
  "author": "",
  ...

}
```

Install the package dependencies
```
npm install
```

To build the package 
```
npm run build:lib
```

To publish to Ceedlab private npm registry
```
npm publish --registry=https://npm-registry.ceedcap.io/
```

> Before attempting to publish a package, ensure you don't have not uncommited files by running `git commit add .` and you have updated the package version using `npm version patch`.


## Folder structure

This repository is a template for creating new FrontendLogic packages and it uses some common folder structure in most Javascript packages to structure it content. I should mention that this package is written in Typescript.

### The root dir

This contains basic Typescript project files like package.json, tsconfig.json, e.t.c. It also contain GraphQL type generation file `codegen.ts`. This package uses `rollup` for its code compilation.

### The src/ dir

This folder contains all the package code files. It has 3 folders, `common`, `services`, and `logic`.

**The common folder**

This folder contains common code file like `contants`, configuration definitions that are used in package. For instance, there is a `contants.ts` file that allow you set a global `API_URL` for the FrontendLogic package.

```
// src/common/constants.ts

export const API_URL = ''
```

**The services folder**

This folder contains .ts files that handle API connection to the application backend. It has a `common` folder that contains the base `GraphQL client` configuration that sends the request to the backend. The `common` folder holds the `BaseApiService` class that allows you to make `mutation` and `queries` to the GraphQL serve. The `BaseApiService` also takes helo you takes care of user authentication as long as the `bearer` auth token is set.

```
// src/services/common/BaseService.ts

import { createClient, Client, dedupExchange, cacheExchange, CombinedError, fetchExchange } from 'urql';
import { multipartFetchExchange } from '@urql/exchange-multipart-fetch';
import { Logic } from "../../logic/modules";
import { API_URL } from "../../common/constants";

export class BaseApiService {
	private baseUrl: string = API_URL;
	public graphqlInstance: Client | undefined;

	constructor() {

	}

	public query = (query: any, variables: any): Promise<any> => {
		if (Logic.Common.apiUrl) {
			this.baseUrl = Logic.Common.apiUrl || ''
		}

		this.graphqlInstance = createClient({
			url: this.baseUrl,
			fetchOptions: () => {
				return {
					headers: { authorization: Logic.Auth.AccessToken ? `Bearer ${Logic.Auth.AccessToken}` : '' },
				};
			},
			exchanges: [dedupExchange, cacheExchange, fetchExchange],
		});

		return this.graphqlInstance.query(query, variables)
			.toPromise().then((response) => {
				if (response.error) {
					this.handleErrors(response.error)
					throw response.error
				}

				return response
			});
	}

	public mutation = (query: any, variables: any): Promise<any> => {
		if (Logic.Common.apiUrl) {
			this.baseUrl = Logic.Common.apiUrl || ''
		}
		this.graphqlInstance = createClient({
			url: this.baseUrl,
			fetchOptions: () => {
				return {
					headers: { authorization: Logic.Auth.AccessToken ? `Bearer ${Logic.Auth.AccessToken}` : '' },
				};
			},
			exchanges: [dedupExchange, cacheExchange, multipartFetchExchange],
		});

		return this.graphqlInstance.mutation(query, variables)
			.toPromise().then((response) => {
				if (response.error) {
					this.handleErrors(response.error)
					throw response.error
				}

				return response
			});
	}

	...
}

```

To use the `query` and `mutation` methods in the `BaseApiService` to make request, you need to create a new class that extends it. For instance, If you want to use the `BaseApiService` to send a SignUp `mutation` request, you will create a new class `AuthApi` and extends the `BaseApiService` like the sample below.

```
// src/services/AuthApi.ts

import { BaseApiService } from './common/BaseService'

export default class AuthApi extends BaseApiService {
  public SignUp = (data: SignUpForm) => {
    const requestData = `
		mutation SignUp(
			$phone_number: String!,
			$password: String!
		) {
			SignUp(phone_number: $phone_number, password: $password) {
				id,
				uuid,
				phone
			}
		}
		`

    const response: Promise<OperationResult<{
      SignUp: any
    }>> = this.mutation(requestData, data)

    return response
  }

...
}
```

Because you extend the `BaseApiService` in the `AuthApi`, that give you access to use all the `methods` in the `BaseApiService` within `AuthApi`. So you can use `this.mutation()` to make mutation request and `this.query()` to make query request. Below is an example of a query operation,

```
// src/services/AuthApi.ts

import { BaseApiService } from './common/BaseService'

export default class AuthApi extends BaseApiService {
  public GetAuthUser = () => {
    const requestData = `
    query GetAuthUser {
      User {
        uuid
        first_name
        last_name
        email_verified_at
      }
    }
    `
    const response: Promise<OperationResult<{
      GetAuthUser: User
    }>> = this.query(requestData, {})

    return response
  }
...
}
```

You can create multiple files to handle API requests for each business domains of the application. For instance you can have `AuthApi` for authentication and authorization mutations and queries, and `UserApi` for user mutations and queries.

To export all these API definitions for use, add them to the `src/services/index.ts` file. Below is an example that export the `AuthApi`

```
// src/services/index.ts

import AuthApi from "./AuthApi";

export const $api = {
	auth: new AuthApi()
};
```

And to use it 

```
import { $api } from '../../services'

$api.auth.GetAuthUser()

```

**The logic folder**

This folder contains the main business logic code file. It has 2 folders, `modules` and `types`. 

_The `types` folder_

The `types` folder contains Typescript interfaces and types used across the business Logic. For instance the `src/logic/types/common.ts` has type definitions for form validation rules - `FormRule` and data pre-fetch rules - `FetchRule`. 

```
// src/logic/types/common.ts

export interface FormRule {
  type:
    | 'isRequired'
    | 'isGreaterThan'
    | 'isLessThan'
    | 'isEqualsTo'
    | 'isGreaterThanOrEqualsTo'
    | 'isLessThanOrEqualsTo'
    | 'isRegex'
    | 'isCondition'
  value: any | undefined
  errorMessage: string | undefined
}

... 

export interface FetchRule {
  domain: string
  property: string
  method: string
  params: any[]
  requireAuth: boolean
  ignoreProperty: boolean | Function
  useRouteId: boolean
  useRouteQuery?: boolean
  queries?: string[]
  alignCurrency?: boolean
}

```

_The `modules` folder_

This folder contains major frontend logic files. It organise different business domain into modules, such that the `Auth.ts` module handle anything authentication and authorization while the `User.ts` module handles functionalities that are user specific. All modules in the folder extend the `Common` module in the `Common.ts` file. The `Common` contains common `methods` that are used be all other modules in the package. These modules are export for use in the `index.ts` file. 

```
// src/logic/modules/index.ts

import Auth from "./Auth";
import Common from "./Common";
import Form from "./form";

export const Logic = {
	Auth: new Auth(),
	Common: new Common(),
	Form: new Form()
};

```

**The package export point**

All the code in this package is exported in the src/index.ts file for usage.

```
// src/index.ts

export * from './common'
export * from './logic/modules'

```


### Extras

Below some notable methods to note in the `Common` module.

**goBack**: _This uses VueJs global router to initiate browsers backward navigation_

```
public goBack = () => {
    window.history.length > 1 ? this.router?.go(-1) : this.router?.push('/')
}

```

**convertToMoney**: _This helps to convert numbers or floats to a money format. It support 'ngn' and 'usd', but also support setting custom currency code._

```
public convertToMoney = (
    float: any,
    withZeros = true,
    currencyType = 'ngn',
    withSymbol = true,
  ) => {
     ...
  }

```

**debounce**: _This method takes care of debouncing. Debouncing is removing unwanted input noise from buttons, switches or other user input. Debouncing prevents extra activations or slow functions from triggering too often._

```
public debounce = (
    method = () => {
      //
    },
    delay = 500,
  ) => {
     ...
  }
```


**watchProperty**: _This is a very important method when using the package. The method allow you to watch changes in any property in a particular module and update the changes to the parent application_ 

```
 public watchProperty = (objectToWatch: string, objectToUpdate: any) => {
    ...
  }

```

**fomartDate**: _This method allow to format a date using moment.js_

```
public fomartDate = (date: string, format: string) => {
    return moment(date).format(format)
}
```

**preFetchRouteData**: _This method is use to handle data pre-fetch action in an application. Data pre-fetch means making API request to fetch as set of data from the backend before a page is render. This somewhat similar to Server Side rending in Nuxt or Next frameworks. At present is only support VueJs and it used the middleware definitions in a VueJs file to determine what data to fetch._

```
public preFetchRouteData = (
    routeTo: RouteLocationNormalized,
    next: NavigationGuardNext,
    _routeFrom: RouteLocationNormalized,
  ) => {
      ...
  }
```