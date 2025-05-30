import { BaseApiService } from "./common/BaseService"
import { OperationResult } from "urql"
import {
  TransactionPaginator,
  Transaction,
  PointTransaction,
  PointTransactionPaginator,
} from "../gql/graphql"

export default class TransactionApi extends BaseApiService {
  public GetTransactions = (
    first: number,
    page: number,
    whereUser?: any,
    orderBy?: any[],
    where?: any
  ) => {
    const requestData = `
    query GetTransactions(
      $first: Int!
      $page: Int
    ) {
      GetTransactions(
        first: $first
        page: $page  
        ${
          whereUser
            ? `whereUser: {
                 OR: [
        { column: FIRST_NAME, operator: LIKE, value: ${whereUser} }
        { column: LAST_NAME, operator: LIKE, value: ${whereUser} }
        { column: EMAIL, operator: LIKE, value: ${whereUser}}
        ] }
      `
            : ""
        }
      ) {
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
          uuid
          dr_or_cr
          currency
          wallet_id
          user_id
          amount
          wallet_balance
          charge_id
          chargeable_type
          description
          status
          charges
          reference
          state
          gateway
          created_at
          updated_at
          user {
            first_name
            last_name
            role {
              name
            }
          }
        }
      }
    }
  `
    const response: Promise<
      OperationResult<{
        GetTransactions: TransactionPaginator
      }>
    > = this.query(requestData, { first, page, whereUser, orderBy, where })

    return response
  }

  public GetSingleTransaction = (transaction_uuid: string) => {
    const requestData = `
    query GetSingleTransaction($transaction_uuid: String!) {
      GetSingleTransaction(transaction_uuid: $transaction_uuid) {
        uuid
        dr_or_cr
        currency
        wallet_id
        user_id
        amount
        wallet_balance
        charge_id
        chargeable_type
        description
        status
        charges
        reference
        state
        gateway
        created_at
        updated_at
        user {
          first_name
          last_name
           role {
              name
            }
        }
      }
    }
  `
    const response: Promise<
      OperationResult<{
        GetSingleTransaction: Transaction
      }>
    > = this.query(requestData, { transaction_uuid })

    console.log("response", response)

    return response
  }

  public GetPointTransactions = (
    page: number,
    count: number,
    orderType = "CREATED_AT",
    order: "ASC" | "DESC",
    whereQuery = ""
  ) => {
    const requestData = `
      query GetPointTransactions(
        $page: Int!,
        $count: Int!
      ){
        GetPointTransactions(
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
            amount
            charge_id
            chargeable_type
            created_at
            currency
            description
            dr_or_cr
            point_balance
            reference
            state
            status
          }
        }
      }
    `
    const response: Promise<
      OperationResult<{
        GetPointTransactions: PointTransactionPaginator
      }>
    > = this.query(requestData, {
      page,
      count,
    })

    return response
  }

  public GetSinglePointTransaction = (uuid: string) => {
    const requestData = `
      query GetSinglePointTransaction($uuid: String!) {
        GetSinglePointTransaction(uuid: $uuid) {
          amount
          charge_id
          chargeable_type
          created_at
          currency
          description
          dr_or_cr
          extra_data
          point_balance
          reference
          state
          status
          updated_at
          uuid
        }
      }
    `
    const response: Promise<
      OperationResult<{
        GetSinglePointTransaction: PointTransaction
      }>
    > = this.query(requestData, {
      uuid,
    })

    return response
  }
}
