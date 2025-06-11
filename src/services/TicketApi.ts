import { BaseApiService } from "./common/BaseService"
import { OperationResult } from "urql"
import { 
  QueryGetSingleTicketWhereWhereConditions,
  Ticket,
  TicketPaginator,
} from "../gql/graphql"

export default class TicketApi extends BaseApiService {
  // #region QUERIES
  public GetMyTickets = (first: number, page: number) => {
    const requestData = `
    query GetMyTickets($first: Int!, $page: Int!) {
      GetMyTickets(first: $first, page: $page) {
        paginatorInfo {
          firstItem
          lastItem
          currentPage
          lastPage
          perPage
          total
          hasMorePages
        }
        data {
          id
          productId
        }
      }
    }
  `

    const response: Promise<
      OperationResult<{
        GetMyTickets: TicketPaginator
      }>
    > = this.query(requestData, { first, page })

    return response
  }

  public GetSingleTicket = (
    where: QueryGetSingleTicketWhereWhereConditions
  ) => {
    const requestData = `
    query GetSingleTicket($where: QueryGetSingleTicketWhereWhereConditions) {
      GetSingleTicket(where: $where) {
        id
        productId
        variantId
        saleId
        userId
        ticketType
        price
        qrCode
        status
        createdAt
      }
    }
  `

    const response: Promise<
      OperationResult<{
        GetSingleTicket: Ticket
      }>
    > = this.query(requestData, { where })

    return response
  }
  // #endregion QUERIES
}
