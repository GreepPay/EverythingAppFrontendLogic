import { CartItem, ProductCategory, ProductSource } from "./CartCat"

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
