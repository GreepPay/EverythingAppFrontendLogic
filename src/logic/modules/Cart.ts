import { Order, CreateOrderInput, GlobalExchangeRate } from "../../gql/graphql"
import { Logic } from ".."
import Common from "./Common"
import {
  BusinessesInCartType,
  CartItem,
  CheckoutPayload,
  CheckoutItem,
  SelectedItemOrderFormat,
  BusinessDetails,
  BusinessCart,
  BusinessId,
  MerchantProduct,
} from "../../common/types"

export default class CartModule extends Common {
  constructor() {
    super()
    const persisted = this._getLocal("greep_cart_v2")
    this.BusinessesInCart = persisted || {}
    this.TotalItemsInCart = this.GetTotalItemsInCart()

    this.defineReactiveProperty("BusinessesInCart", this.BusinessesInCart)
    this.defineReactiveProperty("TotalItemsInCart", this.TotalItemsInCart)
  }

  // mutations payloads
  public BusinessesInCart: BusinessesInCartType = {} as BusinessesInCartType
  public TotalItemsInCart: number = 0
  public exchangeRatesInCart: GlobalExchangeRate[] = []

  //  #region Private Utility Helpers
  private _flattenCart(cart: BusinessesInCartType): CartItem[] {
    return Object.values(cart || {}).flatMap(
      (businessCart) => businessCart.items || []
    )
  }
  private _getTotalForBusiness(
    cart: BusinessesInCartType,
    businessId: BusinessId
  ): number {
    const businessCart = cart?.[businessId]
    if (!businessCart) return 0

    return businessCart.items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    )
  }

  private _getGrandTotal(cart: BusinessesInCartType): number {
    return this._flattenCart(cart).reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    )
  }

  private _extractUniqueCurrencies(
    items: any[]
  ): { code: string; symbol?: string }[] {
    const uniqueCurrencies = new Map<
      string,
      { code: string; symbol?: string }
    >()

    for (const item of items) {
      if (item.currency) {
        uniqueCurrencies.set(item.currency, {
          code: item.currency,
          symbol: item.currencySymbol || "",
        })
      }
    }

    return Array.from(uniqueCurrencies.values())
  }

  private _checkIfBusinessExist(businessId: string | number): boolean {
    return !!this.BusinessesInCart[businessId]
  }

  private _findCartItemIndex(arr: CartItem[], id: string | number): number {
    return arr.findIndex((it) => String(it.id) === String(id))
  }

  private _findItemInBusinessCart(
    businessCart: BusinessCart,
    productId: string | number
  ): number {
    return businessCart.items.findIndex(
      (it) => String(it.id) === String(productId)
    )
  }

  private _getLocal(key: string) {
    try {
      const v = localStorage.getItem(key)
      return v ? JSON.parse(v) : undefined
    } catch {
      return undefined
    }
  }

  private _setLocal(key: string, value: any) {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {}
  }

  private _persistCart() {
    try {
      this._setLocal("greep_cart_v2", this.BusinessesInCart)
    } catch (err) {
      console.warn("Failed to persist cart", err)
    }
  }

  private _getRateForCurrency(
    currency: string
  ): GlobalExchangeRate | undefined {
    return this.exchangeRatesInCart.find(
      (rate: GlobalExchangeRate) => rate.target === currency
    )
  }
  // #endregion Private Utility Helpers

  // #region Generic
  public AddToCart = (product: MerchantProduct): BusinessCart | null => {
    console.log("Adding product to cart:", product)

    if (!this.BusinessesInCart)
      this.BusinessesInCart = {} as BusinessesInCartType

    const businessId: BusinessId = product.businessId

    if (!this.BusinessesInCart[businessId]) {
      const businessDetails: BusinessDetails = {
        businessId,
        businessUuid: product.businessUuid,
        businessName: product.businessName,
        businessLogo: product.businessLogo,
        businessBanner: product.businessBanner,
        businessDescription: product.businessDescription,
      }

      this.BusinessesInCart[businessId] = {
        details: businessDetails,
        items: [] as CartItem[],
      }
    }

    const existingItemInCartIdx = this._findItemInBusinessCart(
      this.BusinessesInCart[businessId],
      product.id
    )

    //
    if (existingItemInCartIdx > -1) {
      console.log("Product already in cart:", product)
      Logic.Common.showAlert({
        show: true,
        message: "Item already in cart.",
        type: "info",
        duration: 700,
      })
      return this.BusinessesInCart[businessId]
    } else {
      const newProductInCart: CartItem = {
        id: String(product.id),
        uuid: product.uuid,
        name: product.name,
        price: Number(product.price || 0),
        formattedPrice: product.formattedPrice,
        currency: product.currency,
        currencySymbol: product.currencySymbol,
        quantity: 1,
        totalItems: product.quantity,
        amountInUsd: 0,
        category: product.category,
        productType: product.productType,
        imageUrl: product.imageUrl,
        selected: true,
        sku: product.sku,
        variant: product.variant,
        meta: product.meta || {},
        usdCurrencySymbol: "$",
        totalAmount: product.price,
        totalAmountInUsd: 0,
      }

      // Add new item under the business
      this.BusinessesInCart[businessId].items.push(newProductInCart)

      Logic.Common.showAlert({
        show: true,
        message: "New product added to cart.",
        type: "info",
        duration: 700,
      })

      // Persist and recalculate
      this.BusinessesInCart = { ...this.BusinessesInCart }
      this._persistCart()
      this.GetTotalItemsInCart()

      return this.BusinessesInCart[businessId]
    }
  }

  public RemoveItemFromCart = (
    businessId: BusinessId,
    productId: string | number
  ): void => {
    if (!this.BusinessesInCart || !this.BusinessesInCart[businessId]) return

    // Remove the specific item
    this.BusinessesInCart[businessId].items = this.BusinessesInCart[
      businessId
    ].items.filter((item) => String(item.id) !== String(productId))

    // If business has no more items, remove the business entry
    if (this.BusinessesInCart[businessId].items.length === 0) {
      delete this.BusinessesInCart[businessId]
    }

    this.BusinessesInCart = { ...this.BusinessesInCart }
    this._persistCart()
    this.GetTotalItemsInCart()
  }

  public UpdateItemQuantity = (
    businessId: BusinessId,
    productId: string | number,
    isIncrement: boolean
  ): void => {
    if (!this.BusinessesInCart || !this.BusinessesInCart[businessId]) return

    const businessCart = this.BusinessesInCart[businessId]
    const itemIndex = businessCart.items.findIndex(
      (item) => String(item.id) === String(productId)
    )
    if (itemIndex === -1) return

    const currentItem = businessCart.items[itemIndex]

    // 🔼 Increment or 🔽 Decrement
    if (isIncrement) {
      // prevent exceeding total available items (if applicable)
      if (currentItem.quantity < (currentItem.totalItems || 1)) {
        currentItem.quantity += 1
      }
    } else {
      // prevent going below 1
      if (currentItem.quantity > 1) currentItem.quantity -= 1
    }

    // ✅ Keep reactivity
    businessCart.items.splice(itemIndex, 1, { ...currentItem })
    this.BusinessesInCart[businessId] = { ...businessCart }
    this.BusinessesInCart = { ...this.BusinessesInCart }

    // 🔁 Persist changes
    this._persistCart()
    this.GetTotalItemsInCart()
  }

  public ToggleItemSelection(
    businessId: string | number,
    productId: string | number
  ): void {
    const businessCart = this.BusinessesInCart[businessId]
    if (!businessCart) return

    const items = businessCart.items
    const index = items.findIndex(
      (item) => String(item.id) === String(productId)
    )
    if (index === -1) return

    const updatedItem = { ...items[index], selected: !items[index].selected }
    items.splice(index, 1, updatedItem)

    this.BusinessesInCart[businessId] = { ...businessCart, items: [...items] }
    this.BusinessesInCart = { ...this.BusinessesInCart }

    this._persistCart()
  }

  public IsItemInCart(
    businessId: string | number,
    productId: string | number
  ): boolean {
    if (!this.BusinessesInCart || !this.BusinessesInCart[businessId])
      return false

    return this.BusinessesInCart[businessId].items.some(
      (item) => String(item.id) === String(productId)
    )
  }

  public GetCurrenciesInCart(): { code: string; symbol?: string }[] {
    const allItems = Object.values(this.BusinessesInCart).flatMap(
      (business) => business.items
    )
    return this._extractUniqueCurrencies(allItems)
  }

  public SetExchangeRates(rates: GlobalExchangeRate[]) {
    return (this.exchangeRatesInCart = rates)
  }

  public MapCartItemsWithExchangeRates(): BusinessesInCartType {
    const mapped: BusinessesInCartType = {} as BusinessesInCartType

    Object.entries(this.BusinessesInCart).forEach(
      ([businessId, businessCart]) => {
        const updatedItems = businessCart.items.map((item) => {
          const rate = this._getRateForCurrency(item.currency || "USD")
          const exchangeRate = rate ? rate.mid : 1 // fallback if no rate found

          const price = item.price || 0
          const quantity = item.quantity || 1

          const amountInUsd = price / exchangeRate
          const totalAmount = price * quantity
          const totalAmountInUsd = amountInUsd * quantity

          return {
            ...item,
            amountInUsd,
            totalAmount,
            totalAmountInUsd,
          }
        })

        mapped[businessId] = {
          ...businessCart,
          items: updatedItems,
        }
      }
    )

    this.BusinessesInCart = mapped
    this._persistCart()
    this.GetTotalItemsInCart()

    return mapped
  }

  public ClearCart = (): void => {
    this.BusinessesInCart = {} as BusinessesInCartType
    this._persistCart()
    this.GetTotalItemsInCart()
  }

  public GetTotalSelectedItemsInUsd(): number {
    let totalInUsd = 0

    for (const businessId in this.BusinessesInCart) {
      const businessCart = this.BusinessesInCart[businessId]
      if (!businessCart?.items?.length) continue

      const selectedItems = businessCart.items.filter((item) => item.selected)
      totalInUsd += selectedItems.reduce(
        (sum, item) => sum + (item.totalAmountInUsd || 0),
        0
      )
    }

    return totalInUsd
  }

  public GetAllSelectedItemsInOrderFormat(): SelectedItemOrderFormat[] {
    const selectedItems: SelectedItemOrderFormat[] = []

    for (const businessId in this.BusinessesInCart) {
      const businessCart = this.BusinessesInCart[businessId]
      if (!businessCart?.items?.length) continue

      businessCart.items
        .filter((item) => item.selected)
        .forEach((item) => {
          selectedItems.push({
            productId: item.id.toString(),
            sku: item.sku,
            quantity: item.quantity,
            price: item.amountInUsd,
            variantId: item?.variant?.id?.toString() || item.id.toString(),
          })
        })
    }

    return selectedItems
  }
  // #endregion Generic

  // #region By Category
  public GetBusinessItems(businessId: BusinessId): CartItem[] {
    return this.BusinessesInCart?.[businessId]?.items || []
  }

  public GetTotalItemsByBusiness(
    businessId: BusinessId,
    useQuantity: boolean = false
  ): number {
    const business = this.BusinessesInCart[businessId]
    if (!business) return 0

    const items = business.items || []

    const total =
      useQuantity ?
        items.reduce((sum, item) => sum + (item.quantity || 0), 0)
      : items.length

    return total
  }

  public GetBusinessSubtotal(businessId: BusinessId): number {
    const business = this.BusinessesInCart[businessId]
    if (!business) return 0

    const subtotal = business.items
      .filter((item) => item.selected)
      .reduce((sum, item) => sum + (item.totalAmountInUsd || 0), 0)

    return subtotal
  }

  public ClearBusinessCart = (businessId: BusinessId): void => {
    if (!this.BusinessesInCart) return
    delete this.BusinessesInCart[businessId]
    this.BusinessesInCart = { ...this.BusinessesInCart }
    this._persistCart()
  }

  public GetSelectedItemsByBusiness(
    businessId: BusinessId,
    useQuantity: boolean = false
  ): number {
    const business = this.BusinessesInCart[businessId]
    if (!business) return 0

    const selectedItems = business.items.filter((item) => item.selected)

    const total =
      useQuantity ?
        selectedItems.reduce((sum, item) => sum + (item.quantity || 0), 0)
      : selectedItems.length

    return total
  }

  public GetCurrenciesInCartByBusiness(
    businessId: BusinessId
  ): { code: string; symbol?: string }[] {
    const business = this.BusinessesInCart[businessId]
    if (!business) return []
    return this._extractUniqueCurrencies(business.items)
  }

 
  public GetTotalSelectedItemsInUsdByBusiness(businessId: BusinessId): number {
    const business = this.BusinessesInCart[businessId]
    if (!business) return 0

    const selectedItems = business.items.filter((item) => item.selected)
    const totalInUsd = selectedItems.reduce(
      (sum, item) => sum + (item.totalAmountInUsd || 0),
      0
    )

    return totalInUsd
  }

  public GetSelectedItemsByBusinessInOrderFormat(
    businessId: string | number
  ): SelectedItemOrderFormat[] {
    const businessCart = this.BusinessesInCart[businessId]
    const items = businessCart?.items || []

    return items
      .filter((item) => item.selected)
      .map((item) => ({
        productId: item.id.toString(),
        sku: item.sku,
        quantity: item.quantity,
        price: item.amountInUsd,
        variantId: item?.variant?.id || item.id.toString(),
      }))
  }

  // #endregion By Category

  // #region Selected Items
  public GetSelectedItemsInCart(): Partial<Record<BusinessId, CartItem[]>> {
    const selectedItemsInCart: Partial<Record<BusinessId, CartItem[]>> = {}

    for (const [businessId, businessCart] of Object.entries(
      this.BusinessesInCart
    )) {
      const selectedItems = businessCart.items.filter((item) => item.selected)

      if (selectedItems.length > 0) {
        selectedItemsInCart[businessId] = selectedItems
      }
    }

    return selectedItemsInCart
  }
  public GetBusinessesWithSelectedItemsCount(): number {
    return Object.values(this.BusinessesInCart).reduce(
      (count, businessCart) => {
        const hasSelected = businessCart.items.some((item) => item.selected)
        return count + (hasSelected ? 1 : 0)
      },
      0
    )
  }

  public GetTotalSelectedItems(useQuantity: boolean = false): number {
    let total = 0

    for (const businessCart of Object.values(this.BusinessesInCart)) {
      const selectedItems = businessCart.items.filter((item) => item.selected)

      total +=
        useQuantity ?
          selectedItems.reduce((sum, item) => sum + (item.quantity || 0), 0)
        : selectedItems.length
    }

    return total
  }

  public GetSelectedItemsSubtotal(): number {
    let total = 0

    for (const businessCart of Object.values(this.BusinessesInCart)) {
      const selectedSubtotal = businessCart.items
        .filter((item) => item.selected)
        .reduce((sum, item) => sum + item.price * item.quantity, 0)

      total += selectedSubtotal
    }

    return total
  }

  // #endregion Selected Items

  public GetTotalItemsInCart(useQuantity: boolean = false): number {
    if (
      !this.BusinessesInCart ||
      Object.keys(this.BusinessesInCart).length === 0
    ) {
      this.TotalItemsInCart = 0
      return 0
    }

    const totalItems = Object.values(this.BusinessesInCart).reduce(
      (total, businessCart) => {
        if (!businessCart || !Array.isArray(businessCart.items)) return total

        const businessTotal =
          useQuantity ?
            businessCart.items.reduce(
              (sum, item) => sum + (item.quantity || 0),
              0
            )
          : businessCart.items.length

        return total + businessTotal
      },
      0
    )

    this.TotalItemsInCart = totalItems
    return totalItems
  }
}
