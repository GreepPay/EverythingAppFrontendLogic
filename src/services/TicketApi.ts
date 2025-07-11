import { BaseApiService } from "./common/BaseService";
import { OperationResult } from "urql";
import { Ticket, TicketPaginator } from "../gql/graphql";

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
            uuid
            id
            businessId
            business {
              id
              business_name
              logo
            }
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
            billingInterval
            trialPeriodDays
            gracePeriod
            renewal
            features
            eventType
            eventStartDate
            eventEndDate
            venueName
            eventOnlineUrl
            eventLocation
            eventCapacity
            eventRegisteredCount
            eventWaitlistEnabled
            metaTitle
            metaDescription
            isVisible 
            images
            createdAt
            updatedAt
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
  `;

    const response: Promise<
      OperationResult<{
        GetMyTickets: TicketPaginator;
      }>
    > = this.query(requestData, { first, page });

    return response;
  };

  public GetSingleTicket = (uuid: string) => {
    const requestData = `
    query GetSingleTicket($uuid: String!) {
      GetSingleTicket(uuid: $uuid) {
        id
        uuid
        product {
          uuid
          id
          businessId
          business {
            id
            business_name
            logo
          }
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
          billingInterval
          trialPeriodDays
          gracePeriod
          renewal
          features
          eventType
          eventStartDate
          eventEndDate
          venueName
          eventOnlineUrl
          eventLocation
          eventCapacity
          eventRegisteredCount
          eventWaitlistEnabled
          metaTitle
          metaDescription
          isVisible 
          images
          createdAt
          updatedAt
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
  `;

    const response: Promise<
      OperationResult<{
        GetSingleTicket: Ticket;
      }>
    > = this.query(requestData, { uuid });

    return response;
  };
  // #endregion QUERIES
}
