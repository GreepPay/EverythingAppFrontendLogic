export const types = {}

export interface Currency {
  code: string
  name: string
  symbol: string
  loading?: boolean
  country_code?: string
  country_name?: string
  icon_extension?: string
  allow_p2p?: boolean
  is_foreign_currency?: boolean
  use_country_code?: boolean
  fallback_code?: string
  is_crypto?: boolean
  can_accept_deposit?: boolean
  card_payment?: {
    min: number
    max: number
    fee: string
  }
  payin_fees?: {
    type: "percentage" | "fixed"
    value: number
    min: number
    method: "bank_transfer" | "momo"
  }[]
  payout_fees?: {
    type: "percentage" | "fixed"
    value: number
    min: number
    method: "bank_transfer" | "momo"
  }[]
}
