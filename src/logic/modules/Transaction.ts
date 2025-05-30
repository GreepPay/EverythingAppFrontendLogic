import {
  TransactionPaginator,
  Transaction,
  PointTransaction,
  PointTransactionPaginator,
} from "../../gql/graphql"
import { $api } from "../../services"
import { CombinedError } from "urql"
import Common from "./Common"

export default class TransactionModule extends Common {
  constructor() {
    super()
  }

  // Base Variables
  public ManyPointTransactions: PointTransactionPaginator | undefined
  public ManyTransactions: TransactionPaginator | undefined
  public SinglePointTransaction: PointTransaction | undefined
  public SingleTransaction: Transaction | undefined

  // Queries
  public GetPointTransactions = async (
    page: number,
    count: number,
    orderType: "CREATED_AT",
    order = "DESC" as "DESC" | "ASC",
    whereQuery = ""
  ) => {
    return $api.transaction
      .GetPointTransactions(page, count, orderType, order, whereQuery)
      .then((response) => {
        this.ManyPointTransactions = response.data?.GetPointTransactions
        return this.ManyPointTransactions
      })
  }

  public GetTransactions = async (
    page: number,
    count: number,
    whereUser?: any,
    orderBy?: any[],
    where?: any
  ) => {
    return $api.transaction
      .GetTransactions(page, count, whereUser, orderBy, where)
      .then((response) => {
        this.ManyTransactions = response.data?.GetTransactions
        return this.ManyTransactions
      })
  }

  public GetSinglePointTransaction = async (uuid: string) => {
    return $api.transaction.GetSinglePointTransaction(uuid).then((response) => {
      this.SinglePointTransaction = response.data?.GetSinglePointTransaction
      return this.SinglePointTransaction
    })
  }

  public GetSingleTransaction = async (uuid: string) => {
    return $api.transaction.GetSingleTransaction(uuid).then((response) => {
      this.SingleTransaction = response.data?.GetSingleTransaction
      return this.SingleTransaction
    })
  }
}
