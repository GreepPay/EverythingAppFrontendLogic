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

export interface SelectOption {
  key: any
  value: string
  extras?: string
  hasIcon?: boolean
  isImage?: boolean
  isForm?: boolean
  imageUrl?: string
  useSlot?: boolean
  disabled?: boolean
  formField?: {
    type: 'text' | 'tel' | 'select'
    placeholder: string
    value: string
    validations: FormRule[]
    customClass: string
    label: string
    name: string
    contentRule?: FormContentRule
    selectOption?: SelectOption[]
  }[]
}

export interface FormContentRule {
  max: number
  characterToAdd: string
  addAfterCount: number
}

export interface LoaderSetup {
  show?: boolean
  useModal?: boolean
  loading?: boolean
  hasError?: boolean
  message?: string
  ctaText?: string
  ctaFunction?: any
  icon?: any
  title?: string
  isInteractive?: boolean
  isAd?: boolean
}

export interface ModalSetup {
  type?: ''
  title?: string
  show: boolean
  actionLabel?: string
  action?: Function
  extraData?: any
  validateForm?: boolean
  preventClose?: boolean
  closeAction?: Function
}

export interface AlertSetup {
  show: boolean
  message: string
  type: 'success' | 'error' | 'info'
  wait_until_next_alert?: boolean
  action?: {
    text: string
    handler: () => void
  }
}

export interface FetchRule {
  domain: string
  property: string
  subProperty?: string
  method: string
  params: any[]
  requireAuth: boolean
  ignoreProperty: boolean | Function
  useRouteId: boolean
  useRouteQuery?: boolean
  queries?: string[]
  query_concatenation_type?: 'append' | 'prehend'
  alignCurrency?: boolean
  silentUpdate?: boolean
  condition?: {
    routeSearchItem: 'fullPath' | 'params' | 'query'
    searchQuery: string
  }
}

export interface RouteMiddleware {
  fetchRules: FetchRule[]
}
