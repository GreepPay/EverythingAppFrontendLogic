import {
  Ticket,
  TicketPaginator,
  ProductVariant,
  NotificationPaginator,
} from "../../gql/graphql"

import { $api } from "../../services"
import { CombinedError } from "urql"
import Common from "./Common"
import { Logic } from ".."

export default class TicketModule extends Common {
  constructor() {
    super()

    this.defineReactiveProperty("TicketsPaginator", undefined)
    this.defineReactiveProperty("SingleTicket", undefined)
    this.defineReactiveProperty("EventTickets", undefined)
  }

  // Base Variables
  public EventTickets: ProductVariant[] | undefined
  public TicketsPaginator: TicketPaginator | undefined
  public SingleTicket: Ticket | undefined

  public GetMyTickets = async (
    page: number,
    count: number,
    isLoadMore = false
  ): Promise<TicketPaginator | undefined> => {
    return $api.ticket
      .GetMyTickets(page, count)
      .then((response) => {
        if (response) {
          if (!isLoadMore) {
            this.TicketsPaginator = response.data?.GetMyTickets
          } else {
            const existingData: TicketPaginator = JSON.parse(
              JSON.stringify(this.TicketsPaginator)
            )
            existingData.data = existingData.data.concat(
              response.data?.GetMyTickets?.data || []
            )
            existingData.paginatorInfo =
              response.data.GetMyTickets?.paginatorInfo

            this.TicketsPaginator = existingData
          }

          return this.TicketsPaginator 
        }
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
