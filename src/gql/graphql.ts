/* eslint-disable */
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** A datetime string with format `Y-m-d H:i:s`, e.g. `2018-05-23 13:43:32`. */
  DateTime: any;
  /**
   * Loose type that allows any value. Be careful when passing in large `Int` or `Float` literals,
   * as they may not be parsed correctly on the server side. Use `String` literals if you are
   * dealing with really large numbers to be on the safe side.
   */
  Mixed: any;
  /** Can be used as an argument to upload files using https://github.com/jaydenseric/graphql-multipart-request-spec */
  Upload: any;
};

/** A blockchain account */
export type Account = {
  __typename?: 'Account';
  /** Account Type */
  account_type: Scalars['String'];
  /** Account Created At */
  created_at?: Maybe<Scalars['DateTime']>;
  /** Account Status */
  status: Scalars['String'];
  /** Stellar Address */
  stellar_address: Scalars['String'];
  /** Account Updated At */
  updated_at?: Maybe<Scalars['DateTime']>;
  /** Unique UUID */
  uuid: Scalars['String'];
};

export type AuthResponse = {
  __typename?: 'AuthResponse';
  token: Scalars['String'];
  user: User;
};

export type BankInfo = {
  __typename?: 'BankInfo';
  accountName: Scalars['String'];
  accountNumber: Scalars['String'];
  name: Scalars['String'];
};

/** A single beneficiary */
export type Beneficiary = {
  __typename?: 'Beneficiary';
  /** The beneficiary user */
  beneficiary: User;
  /** Beneficiary Created At */
  created_at: Scalars['DateTime'];
  /** Unique ID */
  id: Scalars['Int'];
  /** Metadata associated with the beneficiary */
  metadata: Scalars['String'];
  /** Owner ID of the beneficiary */
  owner: User;
  /** State of the beneficiary (active or archived) */
  state: Scalars['String'];
  /** Beneficiary Updated At */
  updated_at: Scalars['DateTime'];
};

/** A paginated list of Beneficiary items. */
export type BeneficiaryPaginator = {
  __typename?: 'BeneficiaryPaginator';
  /** A list of Beneficiary items. */
  data: Array<Beneficiary>;
  /** Pagination information about the list of items. */
  paginatorInfo: PaginatorInfo;
};

/** A single customer profile */
export type Customer = {
  __typename?: 'Customer';
  /** City */
  city?: Maybe<Scalars['String']>;
  /** Country */
  country?: Maybe<Scalars['String']>;
  /** Profile Created At */
  created_at: Scalars['DateTime'];
  /** Unique ID */
  id: Scalars['String'];
  /** Location */
  location?: Maybe<Scalars['String']>;
  /** Notification Preferences */
  notification_preferences: Scalars['String'];
  /** Passport */
  passport?: Maybe<Scalars['String']>;
  /** Resident Permit */
  resident_permit?: Maybe<Scalars['String']>;
  /** Student ID */
  student_id?: Maybe<Scalars['String']>;
  /** Profile Updated At */
  updated_at: Scalars['DateTime'];
};

export type ExchangeRate = {
  __typename?: 'ExchangeRate';
  rates: Array<ExchangeRateItem>;
};

export type ExchangeRateItem = {
  __typename?: 'ExchangeRateItem';
  buy: Scalars['Float'];
  code: Scalars['String'];
  locale: Scalars['String'];
  rateId: Scalars['String'];
  sell: Scalars['Float'];
  updatedAt: Scalars['String'];
};

export type GlobalExchangeRate = {
  __typename?: 'GlobalExchangeRate';
  /** Base Currency */
  base: Scalars['String'];
  /** Mid Rate */
  mid: Scalars['Float'];
  /** Target Currency */
  target: Scalars['String'];
  /** Timestamp */
  timestamp: Scalars['DateTime'];
  /** Unit */
  unit: Scalars['Int'];
};

export type Mutation = {
  __typename?: 'Mutation';
  /** Add a user as a beneficiary */
  AddAsBeneficiary: Beneficiary;
  /** Initiate a top-up transaction */
  InitiateTopup: PaymentCollectionResponse;
  /** Make a payment to another user */
  MakePayment: Scalars['Boolean'];
  /** Mark specific notifications as read for the authenticated user. */
  MarkNotificationsAsRead?: Maybe<Scalars['Boolean']>;
  /** Monitor an on-ramp transaction */
  MonitorTopupStatus: Scalars['Boolean'];
  /** Redeem GRP tokens */
  RedeemGRPToken: Scalars['Boolean'];
  /** Remove a user as a beneficiary */
  RemoveAsBeneficiary: Scalars['Boolean'];
  /** Resend email OTP */
  ResendEmailOTP: Scalars['Boolean'];
  /** Reset password for user */
  ResetPassword: Scalars['Boolean'];
  /** Save a push notification token for the authenticated user. */
  SavePushNotificationToken?: Maybe<Scalars['Boolean']>;
  /** Sign in a user */
  SignIn: AuthResponse;
  /** Sign up a new user */
  SignUp: User;
  /** Update user password */
  UpdatePassword: Scalars['Boolean'];
  /** Update a user's profile with detailed information */
  UpdateProfile: Scalars['Boolean'];
  /** Verify user identity */
  VerifyUserIdentity: Scalars['Boolean'];
  /** Verify user OTP */
  VerifyUserOTP: Scalars['Boolean'];
  /** send rest password OTP */
  sendResetPasswordOTP: Scalars['Boolean'];
};


export type MutationAddAsBeneficiaryArgs = {
  metadata: Scalars['String'];
  user_uuid: Scalars['String'];
};


export type MutationInitiateTopupArgs = {
  amount: Scalars['Float'];
  currency: Scalars['String'];
  method: Scalars['String'];
  payment_metadata: Scalars['String'];
};


export type MutationMakePaymentArgs = {
  amount: Scalars['Float'];
  currency: Scalars['String'];
  receiver_uuid: Scalars['String'];
};


export type MutationMarkNotificationsAsReadArgs = {
  notification_ids: Array<Scalars['Int']>;
};


export type MutationMonitorTopupStatusArgs = {
  collection_id: Scalars['String'];
};


export type MutationRedeemGrpTokenArgs = {
  grp_amount: Scalars['Float'];
};


export type MutationRemoveAsBeneficiaryArgs = {
  beneficiary_uuid: Scalars['String'];
};


export type MutationResendEmailOtpArgs = {
  email: Scalars['String'];
};


export type MutationResetPasswordArgs = {
  new_password: Scalars['String'];
  otp_code: Scalars['String'];
  user_uuid: Scalars['String'];
};


export type MutationSavePushNotificationTokenArgs = {
  device_token: Scalars['String'];
  device_type: Scalars['String'];
};


export type MutationSignInArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationSignUpArgs = {
  country: Scalars['String'];
  default_currency: Scalars['String'];
  email: Scalars['String'];
  first_name: Scalars['String'];
  last_name: Scalars['String'];
  password: Scalars['String'];
  state: Scalars['String'];
};


export type MutationUpdatePasswordArgs = {
  current_password: Scalars['String'];
  new_password: Scalars['String'];
};


export type MutationUpdateProfileArgs = {
  country?: InputMaybe<Scalars['String']>;
  default_currency?: InputMaybe<Scalars['String']>;
  first_name?: InputMaybe<Scalars['String']>;
  last_name?: InputMaybe<Scalars['String']>;
  profile_photo?: InputMaybe<Scalars['Upload']>;
  state?: InputMaybe<Scalars['String']>;
};


export type MutationVerifyUserIdentityArgs = {
  id_country: Scalars['String'];
  id_number: Scalars['String'];
  id_type: Scalars['String'];
  user_uuid?: InputMaybe<Scalars['String']>;
};


export type MutationVerifyUserOtpArgs = {
  otp: Scalars['String'];
  user_uuid: Scalars['String'];
};


export type MutationSendResetPasswordOtpArgs = {
  email: Scalars['String'];
};

/** A notification on Greep */
export type Notification = {
  __typename?: 'Notification';
  /** User UUID to whom the notification belongs */
  auth_user_id: Scalars['String'];
  /** Notification Content */
  content: Scalars['String'];
  /** Notification Created At */
  created_at: Scalars['DateTime'];
  /** Delivery status of the notification */
  delivery_status: Scalars['String'];
  /** Email address if the notification is an email */
  email?: Maybe<Scalars['String']>;
  /** Unique ID */
  id: Scalars['Int'];
  /** Whether the notification has been read */
  is_read: Scalars['Boolean'];
  /** Notification Title */
  title: Scalars['String'];
  /** Notification Type: Email or Push */
  type: Scalars['String'];
  /** Notification Updated At */
  updated_at: Scalars['DateTime'];
};

/** A paginated list of Notification items. */
export type NotificationPaginator = {
  __typename?: 'NotificationPaginator';
  /** A list of Notification items. */
  data: Array<Notification>;
  /** Pagination information about the list of items. */
  paginatorInfo: PaginatorInfo;
};

/** Allows ordering a list of records. */
export type OrderByClause = {
  /** The column that is used for ordering. */
  column: Scalars['String'];
  /** The direction that is used for ordering. */
  order: SortOrder;
};

/** Aggregate functions when ordering by a relation without specifying a column. */
export enum OrderByRelationAggregateFunction {
  /** Amount of items. */
  Count = 'COUNT'
}

/** Aggregate functions when ordering by a relation that may specify a column. */
export enum OrderByRelationWithColumnAggregateFunction {
  /** Average. */
  Avg = 'AVG',
  /** Amount of items. */
  Count = 'COUNT',
  /** Maximum. */
  Max = 'MAX',
  /** Minimum. */
  Min = 'MIN',
  /** Sum. */
  Sum = 'SUM'
}

/** Information about pagination using a fully featured paginator. */
export type PaginatorInfo = {
  __typename?: 'PaginatorInfo';
  /** Number of items in the current page. */
  count: Scalars['Int'];
  /** Index of the current page. */
  currentPage: Scalars['Int'];
  /** Index of the first item in the current page. */
  firstItem?: Maybe<Scalars['Int']>;
  /** Are there more pages after this one? */
  hasMorePages: Scalars['Boolean'];
  /** Index of the last item in the current page. */
  lastItem?: Maybe<Scalars['Int']>;
  /** Index of the last available page. */
  lastPage: Scalars['Int'];
  /** Number of items per page. */
  perPage: Scalars['Int'];
  /** Number of total available items. */
  total: Scalars['Int'];
};

export type PaymentChannel = {
  __typename?: 'PaymentChannel';
  /** API Status */
  apiStatus: Scalars['String'];
  /** Channel Type */
  channelType: Scalars['String'];
  /** Country */
  country: Scalars['String'];
  /** Country Currency */
  countryCurrency: Scalars['String'];
  /** Payment Channel Created At */
  createdAt: Scalars['DateTime'];
  /** Currency */
  currency: Scalars['String'];
  /** Estimated Settlement Time (in seconds) */
  estimatedSettlementTime: Scalars['Int'];
  /** Local Fee */
  feeLocal: Scalars['Float'];
  /** USD Fee */
  feeUSD: Scalars['Float'];
  /** Payment Channel ID */
  id: Scalars['String'];
  /** Maximum transaction amount */
  max: Scalars['Float'];
  /** Minimum transaction amount */
  min: Scalars['Float'];
  /** Ramp Type */
  rampType: Scalars['String'];
  /** Settlement Type */
  settlementType: Scalars['String'];
  /** Payment Channel Status */
  status: Scalars['String'];
  /** Payment Channel Updated At */
  updatedAt: Scalars['DateTime'];
  /** Vendor ID */
  vendorId: Scalars['String'];
  /** Widget Status */
  widgetStatus: Scalars['String'];
};

export type PaymentCollectionResponse = {
  __typename?: 'PaymentCollectionResponse';
  amount: Scalars['Float'];
  bankInfo: BankInfo;
  channelId: Scalars['String'];
  convertedAmount: Scalars['Float'];
  country: Scalars['String'];
  createdAt: Scalars['String'];
  currency: Scalars['String'];
  depositId: Scalars['String'];
  directSettlement: Scalars['Boolean'];
  expiresAt: Scalars['String'];
  forceAccept: Scalars['Boolean'];
  id: Scalars['String'];
  partnerFeeAmountLocal: Scalars['Float'];
  partnerFeeAmountUSD: Scalars['Float'];
  partnerId: Scalars['String'];
  rate: Scalars['Float'];
  reference: Scalars['String'];
  refundRetry: Scalars['Int'];
  requestSource: Scalars['String'];
  sequenceId: Scalars['String'];
  serviceFeeAmountLocal: Scalars['Float'];
  serviceFeeAmountUSD: Scalars['Float'];
  source: Source;
  status: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type PaymentNetwork = {
  __typename?: 'PaymentNetwork';
  /** Account Number Type */
  accountNumberType: Scalars['String'];
  /** Payment Channel IDs */
  channelIds: Array<Scalars['String']>;
  /** Payment Network Code */
  code: Scalars['String'];
  /** Country */
  country: Scalars['String'];
  /** Country Account Number Type */
  countryAccountNumberType: Scalars['String'];
  /** Payment Network ID */
  id: Scalars['String'];
  /** Payment Network Name */
  name: Scalars['String'];
  /** Payment Network Status */
  status: Scalars['String'];
  /** Payment Network Updated At */
  updatedAt: Scalars['DateTime'];
};

/** A single point transaction */
export type PointTransaction = {
  __typename?: 'PointTransaction';
  /** Transaction Amount */
  amount: Scalars['Float'];
  /** Charge ID */
  charge_id: Scalars['String'];
  /** Chargeable Type */
  chargeable_type: Scalars['String'];
  /** PointTransaction Created At */
  created_at: Scalars['DateTime'];
  /** Currency (default: 'USDC') */
  currency: Scalars['String'];
  /** Point Transaction Description */
  description: Scalars['String'];
  /** Credit or Debit: 'credit' or 'debit' */
  dr_or_cr: Scalars['String'];
  /** Extra Data (JSON string) */
  extra_data?: Maybe<Scalars['String']>;
  /** Point Balance */
  point_balance: Scalars['Float'];
  /** Point Transaction Reference */
  reference: Scalars['String'];
  /** State of the point transaction ('active' or 'archived') */
  state: Scalars['String'];
  /** Point Transaction Status ('default', 'pending', 'successful') */
  status: Scalars['String'];
  /** Point Transaction Updated At */
  updated_at: Scalars['DateTime'];
  /** User ID */
  user_id: Scalars['Int'];
  /** Unique UUID */
  uuid: Scalars['String'];
  /** Wallet ID */
  wallet_id: Scalars['Int'];
};

/** A paginated list of PointTransaction items. */
export type PointTransactionPaginator = {
  __typename?: 'PointTransactionPaginator';
  /** A list of PointTransaction items. */
  data: Array<PointTransaction>;
  /** Pagination information about the list of items. */
  paginatorInfo: PaginatorInfo;
};

/** A user profile on Greep */
export type Profile = {
  __typename?: 'Profile';
  /** User UUID */
  auth_user_id: Scalars['String'];
  /** Profile Created At */
  created_at: Scalars['DateTime'];
  /** The attached customer */
  customer: Customer;
  /** Default Currency */
  default_currency: Scalars['String'];
  /** Profile Picture URL (optional) */
  profile_picture?: Maybe<Scalars['String']>;
  /** Profile Updated At */
  updated_at: Scalars['DateTime'];
  /** User Type: Business, Rider, or Customer */
  user_type: Scalars['String'];
  /** Verification Status */
  verification_status: Scalars['String'];
  /** All attached verifications */
  verifications: Array<Verification>;
};

export type Query = {
  __typename?: 'Query';
  /** Get the authenticated user */
  GetAuthUser?: Maybe<User>;
  /** Get a paginated list of beneficiaries for the authenticated user */
  GetBeneficiaries: BeneficiaryPaginator;
  /** Get the current exchange rate between two currencies */
  GetExchangeRate: ExchangeRate;
  /** Get the global exchange rate between two currencies */
  GetGlobalExchangeRate: GlobalExchangeRate;
  /** Get a paginated list of notifications for the authenticated user */
  GetNotifications: NotificationPaginator;
  /** Get the currently supported on-ramp channels for a specific country */
  GetOnRampChannelsByCountryCode: Array<PaymentChannel>;
  /** Get the currently supported on-ramp currencies */
  GetOnRampCurrencies: Array<SupportedCurrency>;
  /** Get the currently supported on-ramp networks by country code */
  GetOnRampNetworkByCountryCode: Array<PaymentNetwork>;
  /** Get many point transactions */
  GetPointTransactions: PointTransactionPaginator;
  /** Get a single point transaction by UUID */
  GetSinglePointTransaction?: Maybe<PointTransaction>;
  /** Get a single transaction by UUID */
  GetSingleTransaction?: Maybe<Transaction>;
  /** Get many transactions - paginated list of transactions for the authenticated user */
  GetTransactions: TransactionPaginator;
  /** Search users by name */
  SearchUsers: Array<User>;
};


export type QueryGetBeneficiariesArgs = {
  first: Scalars['Int'];
  page?: InputMaybe<Scalars['Int']>;
};


export type QueryGetExchangeRateArgs = {
  from_currency: Scalars['String'];
  to_currency: Scalars['String'];
};


export type QueryGetGlobalExchangeRateArgs = {
  base: Scalars['String'];
  target: Scalars['String'];
};


export type QueryGetNotificationsArgs = {
  first: Scalars['Int'];
  page?: InputMaybe<Scalars['Int']>;
};


export type QueryGetOnRampChannelsByCountryCodeArgs = {
  country_code: Scalars['String'];
};


export type QueryGetOnRampNetworkByCountryCodeArgs = {
  country_code: Scalars['String'];
};


export type QueryGetPointTransactionsArgs = {
  first: Scalars['Int'];
  orderBy?: InputMaybe<Array<QueryGetPointTransactionsOrderByOrderByClause>>;
  page?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<QueryGetPointTransactionsWhereWhereConditions>;
};


export type QueryGetSinglePointTransactionArgs = {
  uuid: Scalars['String'];
};


export type QueryGetSingleTransactionArgs = {
  uuid: Scalars['String'];
};


export type QueryGetTransactionsArgs = {
  first: Scalars['Int'];
  orderBy?: InputMaybe<Array<QueryGetTransactionsOrderByOrderByClause>>;
  page?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<QueryGetTransactionsWhereWhereConditions>;
};


export type QuerySearchUsersArgs = {
  query: Scalars['String'];
};

/** Allowed column names for Query.GetPointTransactions.orderBy. */
export enum QueryGetPointTransactionsOrderByColumn {
  CreatedAt = 'CREATED_AT'
}

/** Order by clause for Query.GetPointTransactions.orderBy. */
export type QueryGetPointTransactionsOrderByOrderByClause = {
  /** The column that is used for ordering. */
  column: QueryGetPointTransactionsOrderByColumn;
  /** The direction that is used for ordering. */
  order: SortOrder;
};

/** Allowed column names for Query.GetPointTransactions.where. */
export enum QueryGetPointTransactionsWhereColumn {
  Amount = 'AMOUNT',
  ChargeableType = 'CHARGEABLE_TYPE',
  Currency = 'CURRENCY',
  DrOrCr = 'DR_OR_CR',
  Reference = 'REFERENCE',
  Status = 'STATUS'
}

/** Dynamic WHERE conditions for the `where` argument of the query `GetPointTransactions`. */
export type QueryGetPointTransactionsWhereWhereConditions = {
  /** A set of conditions that requires all conditions to match. */
  AND?: InputMaybe<Array<QueryGetPointTransactionsWhereWhereConditions>>;
  /** Check whether a relation exists. Extra conditions or a minimum amount can be applied. */
  HAS?: InputMaybe<QueryGetPointTransactionsWhereWhereConditionsRelation>;
  /** A set of conditions that requires at least one condition to match. */
  OR?: InputMaybe<Array<QueryGetPointTransactionsWhereWhereConditions>>;
  /** The column that is used for the condition. */
  column?: InputMaybe<QueryGetPointTransactionsWhereColumn>;
  /** The operator that is used for the condition. */
  operator?: InputMaybe<SqlOperator>;
  /** The value that is used for the condition. */
  value?: InputMaybe<Scalars['Mixed']>;
};

/** Dynamic HAS conditions for WHERE conditions for the `where` argument of the query `GetPointTransactions`. */
export type QueryGetPointTransactionsWhereWhereConditionsRelation = {
  /** The amount to test. */
  amount?: InputMaybe<Scalars['Int']>;
  /** Additional condition logic. */
  condition?: InputMaybe<QueryGetPointTransactionsWhereWhereConditions>;
  /** The comparison operator to test against the amount. */
  operator?: InputMaybe<SqlOperator>;
  /** The relation that is checked. */
  relation: Scalars['String'];
};

/** Allowed column names for Query.GetTransactions.orderBy. */
export enum QueryGetTransactionsOrderByColumn {
  CreatedAt = 'CREATED_AT'
}

/** Order by clause for Query.GetTransactions.orderBy. */
export type QueryGetTransactionsOrderByOrderByClause = {
  /** The column that is used for ordering. */
  column: QueryGetTransactionsOrderByColumn;
  /** The direction that is used for ordering. */
  order: SortOrder;
};

/** Allowed column names for Query.GetTransactions.where. */
export enum QueryGetTransactionsWhereColumn {
  Amount = 'AMOUNT',
  ChargeableType = 'CHARGEABLE_TYPE',
  Currency = 'CURRENCY',
  DrOrCr = 'DR_OR_CR',
  Reference = 'REFERENCE',
  Status = 'STATUS'
}

/** Dynamic WHERE conditions for the `where` argument of the query `GetTransactions`. */
export type QueryGetTransactionsWhereWhereConditions = {
  /** A set of conditions that requires all conditions to match. */
  AND?: InputMaybe<Array<QueryGetTransactionsWhereWhereConditions>>;
  /** Check whether a relation exists. Extra conditions or a minimum amount can be applied. */
  HAS?: InputMaybe<QueryGetTransactionsWhereWhereConditionsRelation>;
  /** A set of conditions that requires at least one condition to match. */
  OR?: InputMaybe<Array<QueryGetTransactionsWhereWhereConditions>>;
  /** The column that is used for the condition. */
  column?: InputMaybe<QueryGetTransactionsWhereColumn>;
  /** The operator that is used for the condition. */
  operator?: InputMaybe<SqlOperator>;
  /** The value that is used for the condition. */
  value?: InputMaybe<Scalars['Mixed']>;
};

/** Dynamic HAS conditions for WHERE conditions for the `where` argument of the query `GetTransactions`. */
export type QueryGetTransactionsWhereWhereConditionsRelation = {
  /** The amount to test. */
  amount?: InputMaybe<Scalars['Int']>;
  /** Additional condition logic. */
  condition?: InputMaybe<QueryGetTransactionsWhereWhereConditions>;
  /** The comparison operator to test against the amount. */
  operator?: InputMaybe<SqlOperator>;
  /** The relation that is checked. */
  relation: Scalars['String'];
};

/** The available SQL operators that are used to filter query results. */
export enum SqlOperator {
  /** Whether a value is within a range of values (`BETWEEN`) */
  Between = 'BETWEEN',
  /** Equal operator (`=`) */
  Eq = 'EQ',
  /** Greater than operator (`>`) */
  Gt = 'GT',
  /** Greater than or equal operator (`>=`) */
  Gte = 'GTE',
  /** Whether a value is within a set of values (`IN`) */
  In = 'IN',
  /** Whether a value is not null (`IS NOT NULL`) */
  IsNotNull = 'IS_NOT_NULL',
  /** Whether a value is null (`IS NULL`) */
  IsNull = 'IS_NULL',
  /** Simple pattern matching (`LIKE`) */
  Like = 'LIKE',
  /** Less than operator (`<`) */
  Lt = 'LT',
  /** Less than or equal operator (`<=`) */
  Lte = 'LTE',
  /** Not equal operator (`!=`) */
  Neq = 'NEQ',
  /** Whether a value is not within a range of values (`NOT BETWEEN`) */
  NotBetween = 'NOT_BETWEEN',
  /** Whether a value is not within a set of values (`NOT IN`) */
  NotIn = 'NOT_IN',
  /** Negation of simple pattern matching (`NOT LIKE`) */
  NotLike = 'NOT_LIKE'
}

/** Directions for ordering a list of records. */
export enum SortOrder {
  /** Sort records in ascending order. */
  Asc = 'ASC',
  /** Sort records in descending order. */
  Desc = 'DESC'
}

export type Source = {
  __typename?: 'Source';
  accountNumber: Scalars['String'];
  accountType: Scalars['String'];
  networkId: Scalars['String'];
};

export type SupportedCurrency = {
  __typename?: 'SupportedCurrency';
  code: Scalars['String'];
  country: Scalars['String'];
  currency: Scalars['String'];
  supported_methods: Array<Scalars['String']>;
};

/** A single transaction */
export type Transaction = {
  __typename?: 'Transaction';
  /** Transaction Amount */
  amount: Scalars['Float'];
  /** Charge ID */
  charge_id: Scalars['String'];
  /** Chargeable Type */
  chargeable_type: Scalars['String'];
  /** Charges */
  charges: Scalars['Float'];
  /** Transaction Created At */
  created_at: Scalars['DateTime'];
  /** Currency (default: 'USDC') */
  currency: Scalars['String'];
  /** Transaction Description */
  description: Scalars['String'];
  /** Credit or Debit: 'credit' or 'debit' */
  dr_or_cr: Scalars['String'];
  /** Gateway (default: 'Greep-wallet') */
  gateway: Scalars['String'];
  /** Transaction Reference */
  reference: Scalars['String'];
  /** State of the transaction ('active' or 'archived') */
  state: Scalars['String'];
  /** Transaction Status ('default', 'pending', 'successful') */
  status: Scalars['String'];
  /** Transaction Updated At */
  updated_at: Scalars['DateTime'];
  /** User ID */
  user_id: Scalars['Int'];
  /** Unique UUID */
  uuid: Scalars['String'];
  /** Wallet Balance */
  wallet_balance: Scalars['Float'];
  /** Wallet ID */
  wallet_id: Scalars['Int'];
};

/** A paginated list of Transaction items. */
export type TransactionPaginator = {
  __typename?: 'TransactionPaginator';
  /** A list of Transaction items. */
  data: Array<Transaction>;
  /** Pagination information about the list of items. */
  paginatorInfo: PaginatorInfo;
};

/** Specify if you want to include or exclude trashed results from a query. */
export enum Trashed {
  /** Only return trashed results. */
  Only = 'ONLY',
  /** Return both trashed and non-trashed results. */
  With = 'WITH',
  /** Only return non-trashed results. */
  Without = 'WITHOUT'
}

/** An account trustline */
export type Trustline = {
  __typename?: 'Trustline';
  /** Account UUID */
  account_id?: Maybe<Scalars['String']>;
  /** Asset Code */
  asset_code: Scalars['String'];
  /** Asset Issuer */
  asset_issuer: Scalars['String'];
  /** Trustline Created At */
  created_at?: Maybe<Scalars['DateTime']>;
  /** Unique UUID */
  id: Scalars['String'];
  /** Trustline Status */
  status: Scalars['String'];
  /** Trust Limit */
  trust_limit?: Maybe<Scalars['Float']>;
};

/** A User in Greep */
export type User = {
  __typename?: 'User';
  /** The user created at */
  created_at: Scalars['DateTime'];
  /** The user email */
  email: Scalars['String'];
  /** The user email verified at */
  email_verified_at?: Maybe<Scalars['DateTime']>;
  /** The user first name */
  first_name: Scalars['String'];
  /** The user last name */
  last_name: Scalars['String'];
  /** The user phone */
  phone?: Maybe<Scalars['String']>;
  /** The user phone verified at */
  phone_verified_at?: Maybe<Scalars['DateTime']>;
  /** The attached profile */
  profile: Profile;
  /** The user status */
  status: Scalars['String'];
  /** The user updated at */
  updated_at: Scalars['DateTime'];
  /** The user username */
  username?: Maybe<Scalars['String']>;
  /** Unique UUID */
  uuid: Scalars['String'];
  /** The attached wallet */
  wallet: Wallet;
};

/** A single verification */
export type Verification = {
  __typename?: 'Verification';
  /** Verification Created At */
  created_at: Scalars['DateTime'];
  /** Document Type: International Passport, Resident Permit, Driver's License, Student ID, Passport */
  document_type: Scalars['String'];
  /** Document URL */
  document_url: Scalars['String'];
  /** Unique ID */
  id: Scalars['String'];
  /** Verification Status: Pending, Approved, Rejected */
  status: Scalars['String'];
  /** Verification Updated At */
  updated_at: Scalars['DateTime'];
  /** User Type: Business, Rider, Customer */
  user_type: Scalars['String'];
  /** Verification Data (optional) */
  verification_data?: Maybe<Scalars['String']>;
};

/** A single wallet */
export type Wallet = {
  __typename?: 'Wallet';
  /** Cash Per Point */
  cash_per_point: Scalars['Float'];
  /** Cash Point Balance */
  cash_point_balance: Scalars['Float'];
  /** Wallet Created At */
  created_at: Scalars['DateTime'];
  /** Credited Amount */
  credited_amount: Scalars['Float'];
  /** Credited Point Amount */
  credited_point_amount: Scalars['Float'];
  /** Currency (default: 'USDC') */
  currency: Scalars['String'];
  /** Debited Amount */
  debited_amount: Scalars['Float'];
  /** Debited Point Amount */
  debited_point_amount: Scalars['Float'];
  /** Locked Balance */
  locked_balance: Scalars['Float'];
  /** Point Balance */
  point_balance: Scalars['Float'];
  /** Wallet State ('active' or 'archived') */
  state: Scalars['String'];
  /** Total Balance */
  total_balance: Scalars['Float'];
  /** Wallet Updated At */
  updated_at: Scalars['DateTime'];
  /** Unique UUID */
  uuid: Scalars['String'];
};

/** Dynamic WHERE conditions for queries. */
export type WhereConditions = {
  /** A set of conditions that requires all conditions to match. */
  AND?: InputMaybe<Array<WhereConditions>>;
  /** Check whether a relation exists. Extra conditions or a minimum amount can be applied. */
  HAS?: InputMaybe<WhereConditionsRelation>;
  /** A set of conditions that requires at least one condition to match. */
  OR?: InputMaybe<Array<WhereConditions>>;
  /** The column that is used for the condition. */
  column?: InputMaybe<Scalars['String']>;
  /** The operator that is used for the condition. */
  operator?: InputMaybe<SqlOperator>;
  /** The value that is used for the condition. */
  value?: InputMaybe<Scalars['Mixed']>;
};

/** Dynamic HAS conditions for WHERE condition queries. */
export type WhereConditionsRelation = {
  /** The amount to test. */
  amount?: InputMaybe<Scalars['Int']>;
  /** Additional condition logic. */
  condition?: InputMaybe<WhereConditions>;
  /** The comparison operator to test against the amount. */
  operator?: InputMaybe<SqlOperator>;
  /** The relation that is checked. */
  relation: Scalars['String'];
};
