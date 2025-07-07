import { BaseApiService } from "./common/BaseService"
import { OperationResult } from "urql"
import { Ticket, TicketPaginator } from "../gql/graphql"

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
          uuid
          product {
            id
            uuid 
            sku
            name
            slug
            description
            price
            currency
            taxCode
            type
            status
            variants
            inventoryCount
            stockThreshold
            isBackorderAllowed
            downloadUrl
            downloadLimit
            license
            fileInfo
            dimensions
            weight 
          }
          variantId
          saleId  
          userId
          ticketType
          price
          qrCode
          status
          createdAt
          updatedAt
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

  public GetSingleTicket = (uuid: string) => {
    const requestData = `
    query GetSingleTicket($uuid: String!) {
      GetSingleTicket(uuid: $uuid) {
        id
        uuid
        product {
          id
          uuid 
          sku
          name
          slug
          description
          price
          currency
          taxCode
          type
          status
          variants
          inventoryCount
          stockThreshold
          isBackorderAllowed
          downloadUrl
          downloadLimit
          license
          fileInfo
          dimensions
          weight 
        }
        variantId
        saleId  
        userId
        ticketType
        price
        qrCode
        status
        createdAt
        updatedAt
      }
    }
  `

    const response: Promise<
      OperationResult<{
        GetSingleTicket: Ticket
      }>
    > = this.query(requestData, { uuid })

    return response
  }
  // #endregion QUERIES
}
