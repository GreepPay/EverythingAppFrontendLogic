import { Order, CreateOrderInput } from "../../gql/graphql"
import { Logic } from ".."
import Common from "./Common"
import {
  ItemsInCartType,
  CartItem,
  CheckoutPayload,
  CheckoutItem,
  ProductCategory,
} from "../../common/types"

export default class CartModule extends Common {
  constructor() {
    super()
    const persisted = this._getLocal("greep_cart_v1")
    this.ItemsInCart = persisted || {}
    this.TotalItemsInCart = this.GetTotalItemsInCart()

    this.defineReactiveProperty("ItemsInCart", this.ItemsInCart)
  }

  // mutations payloads
  public ItemsInCart: ItemsInCartType = {} as ItemsInCartType
  public TotalPrice: number = 0
  public TotalItemsInCart: number = 0

  /* ---------------------------
   Private Utility Helpers 
  ----------------------------*/
  /** Flatten all category arrays into a single list of items */
  private _flattenCart(cart: ItemsInCartType): CartItem[] {
    return Object.values(cart || {}).flat()
  }

  /** Get total price for a single category */
  private _getTotalForCategory(
    cart: ItemsInCartType,
    category: ProductCategory
  ): number {
    const items = cart?.[category] || []
    return items.reduce((acc, it) => acc + it.price * it.quantity, 0)
  }

  /** Get grand total across all categories */
  private _getGrandTotal(cart: ItemsInCartType): number {
    return this._flattenCart(cart).reduce(
      (acc, it) => acc + it.price * it.quantity,
      0
    )
  }

  /** Find an item in a category array by ID */
  private _findCartItemIndex(arr: CartItem[], id: string | number): number {
    return arr.findIndex((it) => String(it.id) === String(id))
  }

  /** Local storage getters/setters */
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

  /* ---------------------------
   Public Cart Methods
  ----------------------------*/

  // Add item to cart
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
        category,
        productType: item.productType,
        imageUrl: item.imageUrl,
        selected: false,
        meta: item.meta || {},
      }
      this.ItemsInCart[category].push(newItem)
      Logic.Common.showAlert({
        show: true,
        message: "New product added to cart.",
        type: "info",
        duration: 2000,
      })
    }

    this.ItemsInCart = { ...this.ItemsInCart }
    this._persistCart()
    this.GetTotalItemsInCart()
    return this.ItemsInCart[category]
  }

  /** 🧮 Update item quantity (increase or decrease via button clicks) */
  public UpdateItemQuantity = (
    category: ProductCategory,
    itemId: string | number,
    isIncrement: boolean
  ): void => {
    console.log("UpdateItemQuantity", category, itemId, isIncrement)
    if (!this.ItemsInCart[category]) return

    const itemIndex = this._findCartItemIndex(
      this.ItemsInCart[category],
      itemId
    )
    if (itemIndex === -1) return

    const currentItem = this.ItemsInCart[category][itemIndex]
    console.log("currentItem", currentItem, isIncrement)

    // 🔼 Increment or 🔽 Decrement
    if (isIncrement) {
      console.log("currentItem.quantity", currentItem.quantity, 6556)
      // prevent going beyond available stock
      if (currentItem.quantity < (currentItem.totalItems || 1)) {
        currentItem.quantity += 1
      }
    } else {
      console.log("currentItem.quantity", currentItem.quantity)
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

  /** 🟢 Toggle item selection on checkout */
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

  /** ❌ Remove item completely */
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

  /** ✅ Check if an item already exists in cart */
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

  /** ✅ Get number of categories that have at least one selected item */
  public GetCategoriesWithSelectedItemsCount(): number {
    return Object.keys(this.ItemsInCart).reduce((count, categoryKey) => {
      const category = categoryKey as ProductCategory
      const items = this.ItemsInCart[category] || []
      const hasSelected = items.some((item) => item.selected)
      return count + (hasSelected ? 1 : 0)
    }, 0)
  }

  /** ✅ Get only selected categories and their selected items */
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
  /** Get items for a specific category */
  public GetCategoryItems = (category: ProductCategory): CartItem[] => {
    return this.ItemsInCart?.[category] || []
  }

  /** Get all items across all categories */
  public GetAllItems = (): CartItem[] => {
    return this._flattenCart(this.ItemsInCart || {})
  }
  // ✅ Get total number of items by category
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

  // ✅ Get total number of all items in cart (across categories)
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

  /** ✅ Get total number of selected items per category */
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

  /** ✅ Get total number of selected items across all categories */
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

  /** 💰 Get subtotal for a specific category (only selected items) */
  public GetCategorySubtotal(category: ProductCategory): number {
    const items = this.ItemsInCart[category] || []

    const subtotal = items
      .filter((item) => item.selected)
      .reduce((sum, item) => sum + item.price * item.quantity, 0)

    return subtotal
  }

  /** Clear a specific category */
  public ClearCategory = (category: ProductCategory) => {
    if (!this.ItemsInCart) return
    delete this.ItemsInCart[category]
    this.ItemsInCart = { ...this.ItemsInCart }
    this._persistCart()
  }

  /** Clear entire cart */
  public ClearCart = (): void => {
    this.ItemsInCart = {} as ItemsInCartType
    this._persistCart()
  }
  /* ---------------------------
   Checkout Helpers
  ----------------------------*/

  /** Build checkout payload */
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
