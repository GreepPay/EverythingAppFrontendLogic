import { BaseApiService } from "./common/BaseService";
import { OperationResult } from "urql";
import {
  Category,
  PaginatorInfo,
  Product,
  ProductPaginator,
} from "../gql/graphql";

export default class ProductApi extends BaseApiService {
  // #region QUERIES
  public GetProducts = (
    page: number,
    count: number,
    orderType = "CREATED_AT",
    order: "ASC" | "DESC",
    whereQuery = ""
  ) => {
    const requestData = `
      query GetProducts(
        $page: Int!,
        $count: Int!
      ){
        GetProducts(
          first: $count,
          page: $page,
          orderBy: {
            column: ${orderType ? orderType : "CREATED_AT"},
            order: ${order}
          }
          ${whereQuery ? `where: ${whereQuery}` : ""}
        ) {
          paginatorInfo {
            total
            perPage
            lastPage
            lastItem
            hasMorePages
            firstItem
            currentPage
            count
          }
          data {
            uuid
            id
            businessId
            business {
              id
              uuid
              business_name
              auth_user_id
              logo
              banner
              description
              deliveryAddresses {
              delivery_location {
               area
               country
               id
              }
            }
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
            national_cuisine
            national_cuisine_country
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
        }
      }
    `;
    const response: Promise<
      OperationResult<{
        GetProducts: ProductPaginator;
      }>
    > = this.query(requestData, {
      page,
      count,
    });

    return response;
  };

  public GetProduct = (uuid: string) => {
    const requestData = `
      query GetProduct($uuid: String!) {
        GetProduct(uuid: $uuid) {
          uuid
          id
          businessId
          business {
            id
            uuid
            business_name
            auth_user_id
            logo
            banner
            description
            deliveryAddresses {
              delivery_location {
               area
               country
               id
              }
            }
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
          national_cuisine
          national_cuisine_country
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
      }
    `;
    const response: Promise<
      OperationResult<{
        GetProduct: Product;
      }>
    > = this.query(requestData, {
      uuid,
    });

    return response;
  };

  public GetSingleProduct = (where: Record<string, any>) => {
    const requestData = `
    query GetSingleProduct($where: QueryGetSingleProductWhereWhereConditions) {
      GetSingleProduct(where: $where) {
          uuid
          id
          businessId
          business {
            id
            uuid
            business_name
            auth_user_id
            logo
            banner
            description
            deliveryAddresses {
              delivery_location {
               area
               country
               id
              }
            }
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
          national_cuisine
          national_cuisine_country
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
    }
  `;

    const response: Promise<
      OperationResult<{
        GetSingleProduct: Product;
      }>
    > = this.query(requestData, { where });

    return response;
  };

  public GetCategories = (
    first: number,
    page: number,
    orderBy: { column: "NAME"; order: "ASC" | "DESC" }[]
  ) => {
    const requestData = `
    query GetCategories(
      $first: Int!
      $page: Int
      $orderBy: [QueryGetCategoriesOrderByOrderByClause!]
    ) {
      GetCategories(orderBy: $orderBy, first: $first, page: $page) {
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
          slug
          name
          id
          uuid 
          parentId
          parent_category { 
            name 
          }  
        }
      }
    }
  `;

    const response: Promise<
      OperationResult<{
        GetCategories: {
          paginatorInfo: PaginatorInfo;
          data: Category[];
        };
      }>
    > = this.query(requestData, { orderBy, first, page });

    return response;
  };

  public GetMarketProducts = (
    page: number,
    count: number,
    orderType = "CREATED_AT",
    order: "ASC" | "DESC" = "DESC",
    whereQuery = ""
  ) => {
    const requestData = `
    query MarketProducts(
      $page: Int!
      $count: Int!
    ) {
      MarketProducts(
        first: $count,
        page: $page, 
        orderBy: {
          column: ${orderType ? orderType : "CREATED_AT"},
          order: ${order}
        }
        ${whereQuery ? `where: ${whereQuery}` : ""}
        ) {
        paginatorInfo {
          count
          currentPage
          firstItem
          hasMorePages
          lastItem
          lastPage
          perPage
          total
        }
        data {
          uuid
          id
          businessId
          business {
            id
            uuid
            business_name
            auth_user_id
            logo
            banner
            description
            deliveryAddresses {
              delivery_location {
               area
               country
               id
              }
            }
            storeLocations {
              uuid
              name
              address
              city
              country
              latitude
              longitude
              meta_data
              business_id
              created_at
              updated_at
            }
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
          national_cuisine
          national_cuisine_country
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
      }
    }
  `;

    const response: Promise<
      OperationResult<{
        MarketProducts: ProductPaginator;
      }>
    > = this.query(requestData, {
      page,
      count,
    });

    console.log("response", response);

    return response;
  };

  public GetFeaturedProducts = (page: number, count: number) => {
    const requestData = `
    query FeaturedProducts(
      $page: Int!
      $count: Int!
    ) {
      FeaturedProducts(
        first: $count,
        page: $page
      ) {
        paginatorInfo {
          count
          currentPage
          firstItem
          hasMorePages
          lastItem
          lastPage
          perPage
          total
        }
        data {
          uuid
          id
          businessId
          business {
            id
            uuid
            business_name
            auth_user_id
            logo
            banner
            description
            deliveryAddresses {
              delivery_location {
               area
               country
               id
              }
            }
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
          national_cuisine
          national_cuisine_country
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
      }
    }
  `;

    const response: Promise<
      OperationResult<{
        FeaturedProducts: ProductPaginator;
      }>
    > = this.query(requestData, {
      page,
      count,
    });

    return response;
  };

  public GetLagosRestaurantProducts = (page: number, count: number) => {
    const requestData = `
    query LagosRestaurantProducts(
      $page: Int!
      $count: Int!
    ) {
      LagosRestaurantProducts(
        first: $count,
        page: $page
      ) {
        paginatorInfo {
          count
          currentPage
          firstItem
          hasMorePages
          lastItem
          lastPage
          perPage
          total
        }
        data {
          uuid
          id
          businessId
          business {
            id
            uuid
            business_name
            auth_user_id
            logo
            banner
            description
            deliveryAddresses {
              delivery_location {
               area
               country
               id
              }
            }
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
          national_cuisine
          national_cuisine_country
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
      }
    }
  `;

    const response: Promise<
      OperationResult<{
        LagosRestaurantProducts: ProductPaginator;
      }>
    > = this.query(requestData, {
      page,
      count,
    });

    return response;
  };

  public GetFeaturedEvents = (page: number, count: number) => {
    const requestData = `
    query FeaturedEvents(
      $page: Int!
      $count: Int!
    ) {
      FeaturedEvents(
        first: $count,
        page: $page
      ) {
        paginatorInfo {
          count
          currentPage
          firstItem
          hasMorePages
          lastItem
          lastPage
          perPage
          total
        }
        data {
          uuid
          id
          businessId
          business {
            id
            uuid
            business_name 
            logo
            banner
            description
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
          national_cuisine
          national_cuisine_country
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
      }
    }
  `;

    const response: Promise<
      OperationResult<{
        FeaturedEvents: ProductPaginator;
      }>
    > = this.query(requestData, {
      page,
      count,
    });

    return response;
  };

  // #endregion QUERIES
}
