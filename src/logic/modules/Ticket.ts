import { Ticket, TicketPaginator, ProductVariant } from "../../gql/graphql"

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
        this.TicketsPaginator = response.data?.GetMyTickets
        return this.TicketsPaginator
      })
      .catch((error: CombinedError) => {
        Logic.Common.showError(error, "Failed to fetch tickets", "error-alert")
        return undefined
      })
  }
  public GetSingleTicket = async (
    uuid: string
  ): Promise<Ticket | undefined> => { 

    return $api.ticket
      .GetSingleTicket(uuid)
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
