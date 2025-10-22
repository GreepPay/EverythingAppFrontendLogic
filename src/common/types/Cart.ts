import currency from "currency.js"
import { Category } from "../../gql/graphql"

// types/cart.ts
export type ProductSource = "market" | "event" | "ticket" | "other"
export type ProductCategory = "physical" | "ticket" | "event" | "other"

export interface CartItem {
  id: string
  uuid?: string
  name: string
  price: number
  formattedPrice?: string
  currency?: string
  currencySymbol?: string
  quantity: number
  totalItems: number
  amountInUsd?: number
  imageUrl?: string
  category: ProductCategory
  productType?: ProductSource
  selected?: boolean
  meta?: Record<string, any>
  totalAmount?: number
  totalAmountInUsd?: number
}

export type ItemsInCartType = Record<ProductCategory, CartItem[]> // key is category

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

export interface CartItemBase {
  id: string
  uuid: string
  name: string
  price: number
  quantity: number
  total: number // computed: price * quantity
  category: CartCategory
  image?: string
}

export interface ProductCartItem extends CartItemBase {
  category: "product"
  productId: string
  currency: string
}

export interface EventCartItem extends CartItemBase {
  category: "event"
  eventId: string
  eventStartDate: string
  eventEndDate: string
  venueName: string
}

export interface FoodCartItem extends CartItemBase {
  category: "food"
  menuId: string
  options?: { name: string; value: string }[] // e.g. size: large
}

export interface ServiceCartItem extends CartItemBase {
  category: "service"
  serviceId: string
  duration?: string
}

// export type CartItem =
//   | ProductCartItem
//   | EventCartItem
//   | FoodCartItem
//   | ServiceCartItem

export interface CartTotals {
  overall: number
  totalItems: number
  byCategory: Record<
    string,
    {
      totalItems: number
      totalPrice: number
    }
  >
}
