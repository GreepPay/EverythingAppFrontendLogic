import { Order, CreateOrderInput, GlobalExchangeRate } from "../../gql/graphql"
import { Logic } from ".."
import Common from "./Common"
import {
  ItemsInCartType,
  CartItem,
  CheckoutPayload,
  CheckoutItem,
  ProductCategory,
  SelectedItemOrderFormat, 
} from "../../common/types"

export default class CartModule extends Common {
  constructor() {
    super()
    const persisted = this._getLocal("greep_cart_v1")
    this.ItemsInCart = persisted || {}
    this.TotalItemsInCart = this.GetTotalItemsInCart()

    this.defineReactiveProperty("ItemsInCart", this.ItemsInCart)
    this.defineReactiveProperty("TotalItemsInCart", this.TotalItemsInCart)
  }

  // mutations payloads
  public ItemsInCart: ItemsInCartType = {} as ItemsInCartType
  public TotalPrice: number = 0
  public TotalItemsInCart: number = 0
  public exchangeRatesInCart: GlobalExchangeRate[] = []

  //  #region Private Utility Helpers
  private _flattenCart(cart: ItemsInCartType): CartItem[] {
    return Object.values(cart || {}).flat()
  }

  private _getTotalForCategory(
    cart: ItemsInCartType,
    category: ProductCategory
  ): number {
    const items = cart?.[category] || []
    return items.reduce((acc, it) => acc + it.price * it.quantity, 0)
  }

  private _getGrandTotal(cart: ItemsInCartType): number {
    return this._flattenCart(cart).reduce(
      (acc, it) => acc + it.price * it.quantity,
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

  private _findCartItemIndex(arr: CartItem[], id: string | number): number {
    return arr.findIndex((it) => String(it.id) === String(id))
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
      this._setLocal("greep_cart_v1", this.ItemsInCart)
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
  public AddToCart = (
    item: CartItem,
    forceAdd = false,
    incrementQuantity = 1
  ): CartItem[] | [] => {
    if (!this.ItemsInCart) this.ItemsInCart = {} as ItemsInCartType
    const category: ProductCategory = item.category || "physical"

    if (!this.ItemsInCart[category]) this.ItemsInCart[category] = []

    const existingIdx = this._findCartItemIndex(
      this.ItemsInCart[category],
      item.id
    ) 

    if (existingIdx > -1 && !forceAdd) {
      this.ItemsInCart[category][existingIdx].quantity += incrementQuantity
      if (this.ItemsInCart[category][existingIdx].selected === undefined)
        this.ItemsInCart[category][existingIdx].selected = true
    } else {
      const newItem: CartItem = {
        id: String(item.id),
        uuid: item.uuid,
        name: item.name,
        price: Number(item.price || 0),
        formattedPrice: item.formattedPrice,
        currency: item.currency,
        currencySymbol: item.currencySymbol,
        quantity: 1,
        totalItems: item.quantity,
        amountInUsd: 0, // default to 0
        category,
        productType: item.productType,
        imageUrl: item.imageUrl,
        selected: true,
        sku: item.sku,
        variant: item.variant,
        meta: item.meta || {},
        usdCurrencySymbol: "$",
        totalAmount: item.price,
        totalAmountInUsd: 0,
      }
      this.ItemsInCart[category].push(newItem)
      Logic.Common.showAlert({
        show: true,
        message: "New product added to cart.",
        type: "info",
        duration: 1000,
      })
    }

    this.ItemsInCart = { ...this.ItemsInCart }
    this._persistCart()
    this.GetTotalItemsInCart()
    return this.ItemsInCart[category]
  }

  public RemoveItemFromCart = (
    category: ProductCategory,
    itemId: string | number
  ): void => {
    if (!this.ItemsInCart[category]) return

    // Remove the specific item
    this.ItemsInCart[category] = this.ItemsInCart[category].filter(
      (item) => item.id !== itemId
    )

    // If category becomes empty, delete it
    if (this.ItemsInCart[category].length === 0) {
      delete this.ItemsInCart[category]
    }

    this.ItemsInCart = { ...this.ItemsInCart }
    this._persistCart()
    this.GetTotalItemsInCart()
  }

  public UpdateItemQuantity = (
    category: ProductCategory,
    itemId: string | number,
    isIncrement: boolean
  ): void => {
    if (!this.ItemsInCart[category]) return

    const itemIndex = this._findCartItemIndex(
      this.ItemsInCart[category],
      itemId
    )
    if (itemIndex === -1) return

    const currentItem = this.ItemsInCart[category][itemIndex]

    // 🔼 Increment or 🔽 Decrement
    if (isIncrement) {
      // prevent going beyond available stock
      if (currentItem.quantity < (currentItem.totalItems || 1)) {
        currentItem.quantity += 1
      }
    } else {
      // prevent going below 1
      if (currentItem.quantity > 1) currentItem.quantity -= 1
    }

    // ✅ Keep reactivity
    this.ItemsInCart[category].splice(itemIndex, 1, { ...currentItem })
    this.ItemsInCart = { ...this.ItemsInCart }

    // 🔁 Persist changes
    this._persistCart()
    this.GetTotalItemsInCart()
  }

  public ToggleItemSelection = (
    category: ProductCategory,
    itemId: string | number
  ): void => {
    if (!this.ItemsInCart[category]) return

    const itemIndex = this._findCartItemIndex(
      this.ItemsInCart[category],
      itemId
    )
    if (itemIndex === -1) return

    const currentItem = this.ItemsInCart[category][itemIndex]

    // Toggle the selected state
    currentItem.selected = !currentItem.selected

    // Replace the item
    this.ItemsInCart[category].splice(itemIndex, 1, { ...currentItem })

    // ✅ Trigger reactivity by replacing entire object
    this.ItemsInCart = { ...this.ItemsInCart }

    // Persist changes
    this._persistCart()
  }

  public IsItemInCart(
    category: ProductCategory,
    itemId: string | number
  ): boolean {
    if (!this.ItemsInCart || !this.ItemsInCart[category]) return false
    const exists = this.ItemsInCart[category].some(
      (item) => String(item.id) === String(itemId)
    )
    return exists
  }

  public GetCurrenciesInCart(): { code: string; symbol?: string }[] {
    const allItems = Object.values(this.ItemsInCart).flat()
    return this._extractUniqueCurrencies(allItems)
  }

  public SetExchangeRates(rates: GlobalExchangeRate[]) {
    return (this.exchangeRatesInCart = rates)
  }

  public MapCartItemsWithExchangeRates(): ItemsInCartType {
    const mapped: ItemsInCartType = {} as ItemsInCartType

    Object.entries(this.ItemsInCart).forEach(([category, items]) => {
      mapped[category as ProductCategory] = items.map((item) => {
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
    })

    this.ItemsInCart = mapped

    this._persistCart()
    this.GetTotalItemsInCart()

    return mapped
  }

  public ClearCart = (): void => {
    this.ItemsInCart = {} as ItemsInCartType
    this._persistCart()
    this.GetTotalItemsInCart()
  }

  public BuildCheckoutPayload = (
    category?: ProductCategory,
    includeUnselected = false
  ): CheckoutPayload => {
    const items: CheckoutItem[] = []

    const addItem = (it: CartItem) => {
      items.push({
        id: String(it.id),
        uuid: it.uuid,
        quantity: it.quantity,
        price: it.price,
        productType: it.productType,
        meta: it.meta,
      })
    }

    if (category) {
      const categoryItems = this.GetCategoryItems(category)
      categoryItems.forEach((it) => {
        if (includeUnselected || it.selected) addItem(it)
      })
    } else {
      this.GetAllItems().forEach((it) => {
        if (includeUnselected || it.selected) addItem(it)
      })
    }

    return {
      items,
      userId: Logic.Auth.AuthUser?.id,
      metadata: {},
    }
  }

  public GetTotalSelectedItemsInUsd(): number {
    let totalInUsd = 0

    for (const categoryKey of Object.keys(this.ItemsInCart)) {
      const category = categoryKey as ProductCategory
      const items = this.ItemsInCart[category] || []
      const selectedItems = items.filter((item) => item.selected)

      totalInUsd += selectedItems.reduce(
        (sum, item) => sum + (item.totalAmountInUsd || 0),
        0
      )
    }

    return totalInUsd
  }

  public GetAllSelectedItemsInOrderFormat(): SelectedItemOrderFormat[] {
    const selectedItems: SelectedItemOrderFormat[] = []

    for (const categoryKey of Object.keys(this.ItemsInCart)) {
      const category = categoryKey as ProductCategory
      const items = this.ItemsInCart[category] || []

      items
        .filter((item) => item.selected)
        .forEach((item) => {
          selectedItems.push({
            productId: item.id.toString(),
            sku: item.sku,
            quantity: item.quantity,
            price: item.amountInUsd,
            variantId: item?.variant?.id || item.id.toString(),
          })
        })
    }

    return selectedItems
  }
  // #endregion Generic

  // #region By Category
  public GetCategoryItems = (category: ProductCategory): CartItem[] => {
    return this.ItemsInCart?.[category] || []
  }

  public GetTotalItemsByCategory(
    category: ProductCategory,
    useQuantity: boolean = false
  ): number {
    const items = this.ItemsInCart[category] || []

    // If useQuantity is true → sum of quantities
    // If false → just count number of items
    const total =
      useQuantity ?
        items.reduce((sum, item) => sum + (item.quantity || 0), 0)
      : items.length

    return total
  }

  public GetCategorySubtotal(category: ProductCategory): number {
    const items = this.ItemsInCart[category] || []

    const subtotal = items
      .filter((item) => item.selected)
      .reduce((sum, item) => sum + item.totalAmountInUsd, 0)

    return subtotal
  }

  public ClearCategory = (category: ProductCategory) => {
    if (!this.ItemsInCart) return
    delete this.ItemsInCart[category]
    this.ItemsInCart = { ...this.ItemsInCart }
    this._persistCart()
  }

  public GetSelectedItemsByCategory(
    category: ProductCategory,
    useQuantity: boolean = false
  ): number {
    const items = this.ItemsInCart[category] || []

    const selectedItems = items.filter((item) => item.selected)

    const total =
      useQuantity ?
        selectedItems.reduce((sum, item) => sum + (item.quantity || 0), 0)
      : selectedItems.length

    return total
  }

  public GetCurrenciesInCartByCategory(
    category: ProductCategory
  ): { code: string; symbol?: string }[] {
    const items = this.ItemsInCart[category] || []
    return this._extractUniqueCurrencies(items)
  }

  public GetTotalSelectedItemsInUsdByCategory(
    category: ProductCategory
  ): number {
    const items = this.ItemsInCart[category] || []
    const selectedItems = items.filter((item) => item.selected)

    const totalInUsd = selectedItems.reduce(
      (sum, item) => sum + (item.totalAmountInUsd || 0),
      0
    )

    return totalInUsd
  }

  public GetSelectedItemsByCategoryInOrderFormat(
    category: ProductCategory
  ): SelectedItemOrderFormat[] {
    const items = this.ItemsInCart[category] || []

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
  public GetSelectedItemsInCart(): Partial<
    Record<ProductCategory, CartItem[]>
  > {
    const selectedItemsInCart: Partial<Record<ProductCategory, CartItem[]>> = {}

    for (const [categoryKey, items] of Object.entries(this.ItemsInCart)) {
      const category = categoryKey as ProductCategory
      const selectedItems = items.filter((item) => item.selected)

      if (selectedItems.length > 0) {
        selectedItemsInCart[category] = selectedItems
      }
    }

    return selectedItemsInCart
  }

  public GetCategoriesWithSelectedItemsCount(): number {
    return Object.keys(this.ItemsInCart).reduce((count, categoryKey) => {
      const category = categoryKey as ProductCategory
      const items = this.ItemsInCart[category] || []
      const hasSelected = items.some((item) => item.selected)
      return count + (hasSelected ? 1 : 0)
    }, 0)
  }

  public GetTotalSelectedItems(useQuantity: boolean = false): number {
    let total = 0

    for (const categoryKey of Object.keys(this.ItemsInCart)) {
      const category = categoryKey as ProductCategory
      const items = this.ItemsInCart[category] || []
      const selectedItems = items.filter((item) => item.selected)

      total +=
        useQuantity ?
          selectedItems.reduce((sum, item) => sum + (item.quantity || 0), 0)
        : selectedItems.length
    }

    return total
  }

  public GetSelectedItemsSubtotal(): number {
    let total = 0

    for (const categoryKey of Object.keys(this.ItemsInCart)) {
      const category = categoryKey as ProductCategory
      const items = this.ItemsInCart[category] || []

      const selectedSubtotal = items
        .filter((item) => item.selected)
        .reduce((sum, item) => sum + item.price * item.quantity, 0)

      total += selectedSubtotal
    }

    return total
  }

  // #endregion Selected Items

  // #region all items
  public GetAllItems = (): CartItem[] => {
    return this._flattenCart(this.ItemsInCart || {})
  }

  public GetTotalItemsInCart(useQuantity: boolean = false): number {
    const totalItems: number = Object.keys(this.ItemsInCart).reduce(
      (total, category) => {
        const cat = category as ProductCategory
        const items = this.ItemsInCart[cat] || []

        const categoryTotal =
          useQuantity ?
            items.reduce((sum, item) => sum + (item.quantity || 0), 0)
          : items.length

        return total + categoryTotal
      },
      0
    )

    this.TotalItemsInCart = totalItems
    return totalItems
  }

  // #endregion all items

  /** 🟢 Toggle item selection on checkout */

  /** ✅ Check if an item already exists in cart */

  /** ✅ Get number of categories that have at least one selected item */

  /** ✅ Get only selected categories and their selected items */

  /** Get items for a specific category */

  /** Get all items across all categories */

  // ✅ Get total number of items by category

  // ✅ Get total number of all items in cart (across categories)

  /** 💱 Map each category and its items with exchange rate conversions */

  /** ✅ Get total number of selected items per category */

  /** ✅ Get total number of selected items across all categories */

  /** 💰 Get subtotal for a specific category (only selected items) */

  /** 💰 Get subtotal for all selected items across all categories */

  /** Clear a specific category */

  /** Clear entire cart */

  /* ---------------------------
   Checkout Helpers
  ----------------------------*/

  /** Build checkout payload */

  /** Checkout a single category */
  // public CheckoutCategory = async (
  //   category: string,
  //   includeUnselected = false
  // ): Promise<Order | undefined> => {
  //   const payload = this.BuildCheckoutPayload(category, includeUnselected)

  //   if (!payload.items.length) {
  //     Logic.Common.showError(null, "No items selected for checkout", "info")
  //     return undefined
  //   }

  //   this.CreateOrderPayload = {
  //     items: payload.items.map((it) => ({
  //       productId: it.id,
  //       quantity: it.quantity,
  //       price: it.price,
  //       meta: it.meta || {},
  //     })),
  //     metadata: payload.metadata,
  //   } as unknown as CreateOrderInput

  //   const order = await this.CreateOrder()
  //   if (order) {
  //     const remaining = this.ItemsInCart?.[category] || []
  //     const stillKeep = remaining.filter((it) => !it.selected)
  //     if (stillKeep.length) this.ItemsInCart[category] = stillKeep
  //     else delete this.ItemsInCart[category]
  //     this.ItemsInCart = { ...this.ItemsInCart }
  //     this._persistCart()
  //   }

  //   return order
  // }

  /** Checkout all selected items across all categories */
  // public CheckoutSelected = async (): Promise<Order | undefined> => {
  //   const payload = this.BuildCheckoutPayload(undefined, false)
  //   if (!payload.items.length) {
  //     Logic.Common.showError(null, "No items selected for checkout", "info")
  //     return undefined
  //   }

  //   this.CreateOrderPayload = {
  //     items: payload.items.map((it) => ({
  //       productId: it.id,
  //       quantity: it.quantity,
  //       price: it.price,
  //       meta: it.meta || {},
  //     })),
  //     metadata: payload.metadata,
  //   } as unknown as CreateOrderInput

  //   const order = await this.CreateOrder()
  //   if (order) {
  //     const newCart: ItemsInCartType = {}
  //     Object.keys(this.ItemsInCart || {}).forEach((cat) => {
  //       const keep = (this.ItemsInCart[cat] || []).filter((it) => !it.selected)
  //       if (keep.length) newCart[cat] = keep
  //     })
  //     this.ItemsInCart = newCart
  //     this._persistCart()
  //   }

  //   return order
  // }
}
