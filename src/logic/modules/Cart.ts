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
    this.TotalItemsInCart = this.getTotalItemsInCart()

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
  private _findCartItemIndex(arr: CartItem[], id: string): number {
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
        quantity: item.quantity || 1,
        category,
        productType: item.productType,
        imageUrl: item.imageUrl,
        selected: item.selected !== undefined ? item.selected : true,
        meta: item.meta || {},
      }
      this.ItemsInCart[category].push(newItem)
    }

    this.ItemsInCart = { ...this.ItemsInCart }
    this._persistCart()
    this.getTotalItemsInCart()
    return this.ItemsInCart[category]
  }

  /** 🧮 Update item quantity */
  public updateItemQuantity = (
    category: ProductCategory,
    itemId: string,
    newQuantity: number
  ): void => {
    if (!this.ItemsInCart[category]) return

    const itemIndex = this._findCartItemIndex(
      this.ItemsInCart[category],
      itemId
    )
    if (itemIndex === -1) return

    // Ensure minimum of 1 quantity
    this.ItemsInCart[category][itemIndex].quantity = Math.max(1, newQuantity)
    this._persistCart()
  }

  /** ❌ Remove item completely */
  public RemoveItemFromCart = (
    category: ProductCategory,
    itemId: string
  ): void => {
    if (!this.ItemsInCart[category]) return

    this.ItemsInCart[category] = this.ItemsInCart[category].filter(
      (item) => item.id !== itemId
    )

    this._persistCart()
    this.getTotalItemsInCart()
  }

  /** Toggle item selection (for checkout) */
  public ToggleSelectItem = (id: string, category: ProductCategory) => {
    if (!this.ItemsInCart?.[category]) return
    const idx = this._findCartItemIndex(this.ItemsInCart[category], id)
    if (idx === -1) return
    const item = this.ItemsInCart[category][idx]
    item.selected = !item.selected
    this.ItemsInCart[category].splice(idx, 1, { ...item })
    this.ItemsInCart = { ...this.ItemsInCart }
    this._persistCart()
  }

  /** Get items for a specific category */
  public GetCategoryItems = (category: ProductCategory): CartItem[] =>
    this.ItemsInCart?.[category] || []

  /** Get all items across all categories */
  public GetAllItems = (): CartItem[] =>
    this._flattenCart(this.ItemsInCart || {})
  // ✅ Get total number of items by category
  public getTotalItemsByCategory(category: ProductCategory): number {
    const items = this.ItemsInCart[category] || []
    return items.reduce((total, item) => total + (item.quantity || 0), 0)
  }

  // ✅ Get total number of all items in cart (across categories)
  public getTotalItemsInCart(): number {
    const totalItems: number = Object.keys(this.ItemsInCart).reduce(
      (total, category) => {
        const cat = category as ProductCategory
        const items = this.ItemsInCart[cat] || []
        const categoryTotal = items.reduce(
          (sum, item) => sum + (item.quantity || 0),
          0
        )
        return total + categoryTotal
      },
      0
    )

    this.TotalItemsInCart = totalItems
    return totalItems
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
