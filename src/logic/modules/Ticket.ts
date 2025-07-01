import {
  Ticket,
  TicketPaginator,
  QueryGetSingleTicketWhereWhereConditions,
  ProductVariant,
} from "../../gql/graphql"

import { $api } from "../../services"
import { CombinedError } from "urql"
import Common from "./Common"
import { Logic } from ".."

export default class TicketModule extends Common {
  constructor() {
    super()
  }

  // Base Variables
  public EventTickets: ProductVariant[] | undefined
  public TicketsPaginator: TicketPaginator | undefined
  public SingleTicket: Ticket | undefined

  public GetMyTickets = async (
    first: number,
    page: number
  ): Promise<TicketPaginator | undefined> => {
    return $api.ticket
      .GetMyTickets(first, page)
      .then((response) => {
        console.log("response", response)

        this.TicketsPaginator = response.data?.GetMyTickets
        return this.TicketsPaginator
      })
      .catch((error: CombinedError) => {
        Logic.Common.showError(error, "Failed to fetch tickets", "error-alert")
        return undefined
      })
  }

  // public GetEventTickets = async (
  //   product_id: string | number
  // ): Promise<ProductVariant[] | undefined> => {
  //   const where = {
  //     column: "ID",
  //     operator: "EQ",
  //     value: String(product_id),
  //   }

  //   return $api.product
  //     .GetSingleProduct(where)
  //     .then((response) => {
  //       this.EventTickets = response.data?.GetSingleProduct?.variants
  //       return this.EventTickets
  //     })
  //     .catch((error: CombinedError) => {
  //       Logic.Common.showError(
  //         error,
  //         "Failed to fetch product details",
  //         "error-alert"
  //       )
  //       return undefined
  //     })

  //   // return $api.ticket
  //   //   .GetMyTickets(first, page)
  //   //   .then((response) => {
  //   //     this.TicketsPaginator = response.data?.GetMyTickets
  //   //     return this.TicketsPaginator
  //   //   })
  //   //   .catch((error: CombinedError) => {
  //   //     Logic.Common.showError(error, "Failed to fetch tickets", "error-alert")
  //   //     return undefined
  //   //   })
  // }

  public GetSingleTicket = async (
    where: QueryGetSingleTicketWhereWhereConditions
  ): Promise<Ticket | undefined> => {
    return $api.ticket
      .GetSingleTicket(where)
      .then((response) => {
        this.SingleTicket = response.data?.GetSingleTicket
        return this.SingleTicket
      })
      .catch((error: CombinedError) => {
        Logic.Common.showError(
          error,
          "Failed to fetch ticket details",
          "error-alert"
        )
        return undefined
      })
  }
}
