 
// types/cart.ts
export type ProductSource = "market" | "event" | "ticket" | "other"
export type ProductCategory = "physical" | "ticket" | "event" | "other"

export interface CartItem {
  id: string
  uuid?: string
  name: string
  price: number
  formattedPrice: string
  currency: string
  currencySymbol: string
  quantity: number
  totalItems: number
  amountInUsd: number
  imageUrl?: string
  category: ProductCategory
  productType?: ProductSource
  selected: boolean
  meta?: Record<string, any>
  usdCurrencySymbol?: string
  formattedAmountInUsd?: string
  totalAmount: number
  totalAmountInUsd: number
  sku: string
  variant?: any
} 

// payload used to create order from cart
export interface CheckoutItem {
  id: string
  uuid?: string
  quantity: number
  price: number
  productType?: ProductSource
  meta?: Record<string, any>
}

export interface CheckoutPayload {
  items: CheckoutItem[]
  userId?: string
  deliveryAddressId?: string
  paymentMethod?: string
  metadata?: Record<string, any>
}

export type CartCategory = "product" | "event" | "food" | "service"

export interface BusinessDetails {
  businessId: number | string
  businessUuid?: string
  businessName?: string
  businessLogo?: string
  businessBanner?: string | null
  businessDescription?: string
}

export interface BusinessCart {
  details: BusinessDetails
  items: CartItem[]
}

export type BusinessId = number | string

export type BusinessesInCartType = Record<BusinessId, BusinessCart>

export interface MerchantProduct {
  id: string | number
  uuid?: string
  name: string
  price: number 
  formattedPrice: string 
  currency: string
  currencySymbol: string
  imageUrl: string
  quantity: number
  category: ProductCategory
  productType?: ProductSource
  selected?: boolean
  description: string
  sku: string
  variant?: any
  images: { url: string }[]
  meta?: Record<string, any>
  businessId: number | string
  businessUuid?: string
  businessName?: string
  businessLogo?: string
  businessBanner?: string | null
  businessDescription?: string
}

export interface SelectedItemOrderFormat {
  productId: string
  sku: string
  quantity: number
  price: number
  variantId: string
}
