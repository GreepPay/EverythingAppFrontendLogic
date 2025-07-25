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

export type AddressInput = {
  city?: InputMaybe<Scalars['String']>;
  country?: InputMaybe<Scalars['String']>;
  phone?: InputMaybe<Scalars['String']>;
  postalCode?: InputMaybe<Scalars['String']>;
  state?: InputMaybe<Scalars['String']>;
  street?: InputMaybe<Scalars['String']>;
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

export type Billing = {
  __typename?: 'Billing';
  gracePeriod: Scalars['Int'];
  interval: BillingInterval;
  trialDays: Scalars['Int'];
};

export enum BillingInterval {
  Annual = 'ANNUAL',
  Custom = 'CUSTOM',
  Monthly = 'MONTHLY'
}

/** Business profile details. */
export type Business = {
  __typename?: 'Business';
  /** Business banner URL. */
  banner?: Maybe<Scalars['String']>;
  /** Business name. */
  business_name?: Maybe<Scalars['String']>;
  /** Default Currency */
  default_currency?: Maybe<Scalars['String']>;
  /** Business description. */
  description?: Maybe<Scalars['String']>;
  eventProducts?: Maybe<Array<Maybe<Product>>>;
  /** Unique identifier for the business. */
  id: Scalars['String'];
  /** Business logo URL. */
  logo?: Maybe<Scalars['String']>;
  products?: Maybe<Array<Maybe<Product>>>;
  /** Attached user */
  user?: Maybe<User>;
  /** Business UUID. */
  uuid: Scalars['String'];
  /** Business website URL. */
  website?: Maybe<Scalars['String']>;
};

/** A paginated list of Business items. */
export type BusinessPaginator = {
  __typename?: 'BusinessPaginator';
  /** A list of Business items. */
  data: Array<Business>;
  /** Pagination information about the list of items. */
  paginatorInfo: PaginatorInfo;
};

/** A category */
export type Category = {
  __typename?: 'Category';
  /** Category Created At */
  createdAt: Scalars['String'];
  /** Unique ID */
  id: Scalars['Int'];
  /** Category Name */
  name: Scalars['String'];
  /** Products */
  products: Array<Product>;
  /** Category Slug */
  slug: Scalars['String'];
  /** Category Updated At */
  updatedAt: Scalars['String'];
  /** UUID */
  uuid: Scalars['String'];
};

/** A paginated list of Category items. */
export type CategoryPaginator = {
  __typename?: 'CategoryPaginator';
  /** A list of Category items. */
  data: Array<Category>;
  /** Pagination information about the list of items. */
  paginatorInfo: PaginatorInfo;
};

/** A conversation */
export type Conversation = {
  __typename?: 'Conversation';
  /** Conversation Created At */
  created_at: Scalars['DateTime'];
  /** Entity Type */
  entity_type?: Maybe<Scalars['String']>;
  /** Unique ID */
  id: Scalars['Int'];
  /** Messages */
  messages: Array<Message>;
  /** Conversation Name */
  name: Scalars['String'];
  /** Owner ID */
  owner_id: Scalars['Int'];
  /** Participants */
  participants: Array<Participant>;
  /** Stage */
  stage?: Maybe<Scalars['String']>;
  /** State */
  state: Scalars['String'];
  /** Conversation Type */
  type: Scalars['String'];
  /** Conversation Updated At */
  updated_at: Scalars['DateTime'];
};

export type Coordinates = {
  __typename?: 'Coordinates';
  lat: Scalars['Float'];
  lng: Scalars['Float'];
};

export type CreateOrderInput = {
  billingAddress?: InputMaybe<AddressInput>;
  customerId?: InputMaybe<Scalars['Int']>;
  items?: InputMaybe<Array<InputMaybe<OrderItemInput>>>;
  paymentMethod?: InputMaybe<Scalars['String']>;
  shippingAddress?: InputMaybe<AddressInput>;
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

/** A delivery */
export type Delivery = {
  __typename?: 'Delivery';
  /** Actual Delivery Date */
  actualDeliveryDate?: Maybe<Scalars['String']>;
  /** Delivery Created At */
  createdAt: Scalars['String'];
  /** Delivery Address */
  deliveryAddress: Scalars['String'];
  /** Delivery Attempts */
  deliveryAttempts: Scalars['String'];
  /** Estimated Delivery Date */
  estimatedDeliveryDate: Scalars['String'];
  /** Unique ID */
  id: Scalars['Int'];
  /** Metadata */
  metadata: Scalars['String'];
  /** Order */
  order: Order;
  /** Status */
  status: Scalars['String'];
  /** Tracking Number */
  trackingNumber: Scalars['String'];
  /** Tracking Updates */
  trackingUpdates: Scalars['String'];
  /** Delivery Updated At */
  updatedAt: Scalars['String'];
  /** UUID */
  uuid: Scalars['String'];
};

/** A paginated list of Delivery items. */
export type DeliveryPaginator = {
  __typename?: 'DeliveryPaginator';
  /** A list of Delivery items. */
  data: Array<Delivery>;
  /** Pagination information about the list of items. */
  paginatorInfo: PaginatorInfo;
};

/** Destination Details */
export type Destination = {
  __typename?: 'Destination';
  /** Account Name */
  accountName: Scalars['String'];
  /** Account Number */
  accountNumber: Scalars['String'];
  /** Account Type */
  accountType: Scalars['String'];
  /** Network ID */
  networkId: Scalars['String'];
};

export type DigitalProduct = {
  __typename?: 'DigitalProduct';
  download: Download;
  fileInfo: FileInfo;
  license?: Maybe<License>;
};

export type Dimensions = {
  __typename?: 'Dimensions';
  height: Scalars['Float'];
  length: Scalars['Float'];
  width: Scalars['Float'];
};

export type Download = {
  __typename?: 'Download';
  accessExpiration?: Maybe<Scalars['DateTime']>;
  downloadLimit?: Maybe<Scalars['Int']>;
  url: Scalars['String'];
};

export type EventDetails = {
  __typename?: 'EventDetails';
  capacity?: Maybe<Scalars['Int']>;
  endDate: Scalars['DateTime'];
  location?: Maybe<Location>;
  onlineUrl?: Maybe<Scalars['String']>;
  registeredCount: Scalars['Int'];
  startDate: Scalars['DateTime'];
  venueName?: Maybe<Scalars['String']>;
  waitlistEnabled: Scalars['Boolean'];
};

export type EventProduct = {
  __typename?: 'EventProduct';
  eventDetails: EventDetails;
  eventType: EventType;
};

export enum EventType {
  Hybrid = 'HYBRID',
  Offline = 'OFFLINE',
  Online = 'ONLINE'
}

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

export type FileInfo = {
  __typename?: 'FileInfo';
  format: Scalars['String'];
  size: Scalars['Int'];
};

export type FinancialSummaryInput = {
  from?: InputMaybe<Scalars['String']>;
  to?: InputMaybe<Scalars['String']>;
  type: Scalars['String'];
};

export type FinancialSummaryResponse = {
  __typename?: 'FinancialSummaryResponse';
  credit: Scalars['Float'];
  debit: Scalars['Float'];
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

export type Inventory = {
  __typename?: 'Inventory';
  isBackorderAllowed: Scalars['Boolean'];
  lowStockThreshold: Scalars['Int'];
  stock: Scalars['Int'];
};

export type License = {
  __typename?: 'License';
  key: Scalars['String'];
  type: LicenseType;
};

export enum LicenseType {
  Multi = 'MULTI',
  Perpetual = 'PERPETUAL',
  Single = 'SINGLE'
}

export type Location = {
  __typename?: 'Location';
  address: Scalars['String'];
  city: Scalars['String'];
  coordinates?: Maybe<Coordinates>;
  country: Scalars['String'];
  postalCode?: Maybe<Scalars['String']>;
  state?: Maybe<Scalars['String']>;
};

/** A message */
export type Message = {
  __typename?: 'Message';
  /** Message Content */
  content: Scalars['String'];
  /** Conversation */
  conversation: Conversation;
  /** Conversation ID */
  conversation_id: Scalars['Int'];
  /** Message Created At */
  created_at: Scalars['DateTime'];
  /** Unique ID */
  id: Scalars['Int'];
  /** Sender */
  participant: Participant;
  /** Replied Message */
  replied_message: Message;
  /** Sender ID */
  sender_id: Scalars['Int'];
  /** Message State */
  state: Scalars['String'];
  /** Message Status */
  status: Scalars['String'];
  /** Message Updated At */
  updated_at: Scalars['DateTime'];
  /** Unique UUID */
  uuid: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  /** Add a user as a beneficiary */
  AddAsBeneficiary: Beneficiary;
  /** Confirm withdrawal */
  ConfirmWithdrawal?: Maybe<OffRamp>;
  CreateOrder?: Maybe<Order>;
  /** Create a saved account */
  CreateSavedAccount: UserBank;
  /** Delete User */
  DeleteUser: Scalars['Boolean'];
  /** Initiate a top-up transaction */
  InitiateTopup: PaymentCollectionResponse;
  /** Initiate withdrawal */
  InitiateWithdrawal?: Maybe<OffRamp>;
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
  /** Remove a saved account */
  RemoveSavedAccount: Scalars['Boolean'];
  /** Resend email OTP */
  ResendEmailOTP: Scalars['Boolean'];
  /** Reset password for user */
  ResetPassword: Scalars['Boolean'];
  /** Save a push notification token for the authenticated user. */
  SavePushNotificationToken?: Maybe<Scalars['Boolean']>;
  /** Sign in a user */
  SignIn: AuthResponse;
  /** Sign out a user */
  SignOut: Scalars['Boolean'];
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


export type MutationConfirmWithdrawalArgs = {
  amount: Scalars['Float'];
  currency: Scalars['String'];
  metadata?: InputMaybe<Scalars['String']>;
  uuid: Scalars['String'];
};


export type MutationCreateOrderArgs = {
  input: CreateOrderInput;
};


export type MutationCreateSavedAccountArgs = {
  metadata: Scalars['String'];
  type: Scalars['String'];
  unique_id: Scalars['String'];
  uploads?: InputMaybe<Array<Scalars['Upload']>>;
};


export type MutationInitiateTopupArgs = {
  amount: Scalars['Float'];
  currency: Scalars['String'];
  method: Scalars['String'];
  payment_metadata: Scalars['String'];
};


export type MutationInitiateWithdrawalArgs = {
  amount: Scalars['Float'];
  saved_account_uuid: Scalars['String'];
  withdrawal_currency: Scalars['String'];
};


export type MutationMakePaymentArgs = {
  amount: Scalars['Float'];
  business_uuid?: InputMaybe<Scalars['String']>;
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


export type MutationRemoveSavedAccountArgs = {
  saved_account_uuid: Scalars['String'];
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
  profile_picture?: InputMaybe<Scalars['Upload']>;
  state: Scalars['String'];
};


export type MutationUpdatePasswordArgs = {
  current_password: Scalars['String'];
  new_password: Scalars['String'];
};


export type MutationUpdateProfileArgs = {
  auth_passcode?: InputMaybe<Scalars['String']>;
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

/** Offramp Transaction */
export type OffRamp = {
  __typename?: 'OffRamp';
  /** Withdrawal Amount */
  amount: Scalars['String'];
  /** Offramp Created At */
  created_at: Scalars['String'];
  /** Currency of Withdrawal */
  currency: Scalars['String'];
  /** Withdrawal Description */
  description: Scalars['String'];
  /** Additional Data */
  extra_data?: Maybe<Scalars['String']>;
  /** Unique ID */
  id: Scalars['Int'];
  /** Payment Channel */
  payment_channel: Scalars['String'];
  /** Payment Reference */
  payment_reference: Scalars['String'];
  /** Additional ID Number (if applicable) */
  senderAdditionalIdNumber?: Maybe<Scalars['String']>;
  /** Additional ID Type (if applicable) */
  senderAdditionalIdType?: Maybe<Scalars['String']>;
  /** Sender's Address */
  senderAddress?: Maybe<Scalars['String']>;
  /** Sender's Business ID (if institution) */
  senderBusinessId?: Maybe<Scalars['String']>;
  /** Sender's Business Name (if institution) */
  senderBusinessName?: Maybe<Scalars['String']>;
  /** Sender's Country */
  senderCountry?: Maybe<Scalars['String']>;
  /** Sender's Date of Birth */
  senderDob?: Maybe<Scalars['String']>;
  /** Sender's Email Address */
  senderEmail?: Maybe<Scalars['String']>;
  /** Type of Sender's ID */
  senderIdType?: Maybe<Scalars['String']>;
  /** Sender's Full Name */
  senderName?: Maybe<Scalars['String']>;
  /** Sender's Phone Number */
  senderPhone?: Maybe<Scalars['String']>;
  /** Transaction State ('active' or 'archived') */
  state: Scalars['String'];
  /** Transaction Status */
  status: Scalars['String'];
  /** Offramp Updated At */
  updated_at: Scalars['String'];
  /** Unique UUID */
  uuid: Scalars['String'];
  /** Yellow card payment */
  yellow_card_payment?: Maybe<PaymentRequestResponse>;
};

/** An order */
export type Order = {
  __typename?: 'Order';
  /** Applied Discounts */
  appliedDiscounts?: Maybe<Scalars['String']>;
  /** Billing Address */
  billingAddress?: Maybe<Scalars['String']>;
  /** Order Created At */
  createdAt: Scalars['String'];
  /** Currency */
  currency: Scalars['String'];
  /** Customer ID */
  customerId: Scalars['Int'];
  /** Deliveries */
  deliveries: Array<Delivery>;
  /** Discount Amount */
  discountAmount: Scalars['Float'];
  /** Unique ID */
  id: Scalars['Int'];
  /** Items */
  items: Scalars['String'];
  /** Order Number */
  orderNumber: Scalars['String'];
  /** Payment Details */
  paymentDetails?: Maybe<Scalars['String']>;
  /** Payment Method */
  paymentMethod?: Maybe<Scalars['String']>;
  /** Payment Status */
  paymentStatus: Scalars['String'];
  /** Refund Details */
  refundDetails?: Maybe<Scalars['String']>;
  /** Sale */
  sale: Sale;
  /** Shipping Address */
  shippingAddress?: Maybe<Scalars['String']>;
  /** Status */
  status: Scalars['String'];
  /** Status History */
  statusHistory: Scalars['String'];
  /** Subtotal Amount */
  subtotalAmount: Scalars['Float'];
  /** Tax Amount */
  taxAmount: Scalars['Float'];
  /** Tax Details */
  taxDetails?: Maybe<Scalars['String']>;
  /** Total Amount */
  totalAmount: Scalars['Float'];
  /** Order Updated At */
  updatedAt: Scalars['String'];
  /** The attached user */
  user: User;
  /** UUID */
  uuid: Scalars['String'];
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

export type OrderItemInput = {
  price?: InputMaybe<Scalars['Float']>;
  productId?: InputMaybe<Scalars['String']>;
  quantity?: InputMaybe<Scalars['Int']>;
  sku?: InputMaybe<Scalars['String']>;
  variantId?: InputMaybe<Scalars['String']>;
};

/** A paginated list of Order items. */
export type OrderPaginator = {
  __typename?: 'OrderPaginator';
  /** A list of Order items. */
  data: Array<Order>;
  /** Pagination information about the list of items. */
  paginatorInfo: PaginatorInfo;
};

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

/** A participant */
export type Participant = {
  __typename?: 'Participant';
  /** Conversation */
  conversation: Conversation;
  /** Participant Created At */
  created_at: Scalars['DateTime'];
  /** Unique ID */
  id: Scalars['Int'];
  /** Messages */
  messages: Array<Message>;
  /** Participant State */
  state: Scalars['String'];
  /** Participant Updated At */
  updated_at: Scalars['DateTime'];
  /** Attached user */
  user: User;
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

/** Payment Request Response */
export type PaymentRequestResponse = {
  __typename?: 'PaymentRequestResponse';
  /** Amount */
  amount: Scalars['Float'];
  /** Channel ID */
  channelId: Scalars['String'];
  /** Converted Amount */
  convertedAmount: Scalars['Float'];
  /** Country */
  country: Scalars['String'];
  /** Created At */
  createdAt: Scalars['String'];
  /** Currency */
  currency: Scalars['String'];
  /** Destination Information */
  destination: Destination;
  /** Expiration Time */
  expiresAt: Scalars['String'];
  /** Unique ID */
  id: Scalars['String'];
  /** Rate */
  rate: Scalars['Float'];
  /** Reason */
  reason: Scalars['String'];
  /** Sender Information */
  sender: Sender;
  /** Sequence ID */
  sequenceId: Scalars['String'];
  /** Status */
  status: Scalars['String'];
  /** Updated At */
  updatedAt: Scalars['String'];
};

export type PhysicalProduct = {
  __typename?: 'PhysicalProduct';
  dimensions: Dimensions;
  inventory: Inventory;
  shippingClass: ShippingClass;
  weight: Scalars['Float'];
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

/** A product */
export type Product = {
  __typename?: 'Product';
  /** Billing Interval */
  billingInterval?: Maybe<Scalars['String']>;
  /** Attached business */
  business: Business;
  /** Business ID */
  businessId: Scalars['Int'];
  /** Product Created At */
  createdAt: Scalars['String'];
  /** Currency */
  currency: Scalars['String'];
  /** Description */
  description: Scalars['String'];
  /** Dimensions */
  dimensions?: Maybe<Scalars['String']>;
  /** Download Limit */
  downloadLimit?: Maybe<Scalars['Int']>;
  /** Download URL */
  downloadUrl?: Maybe<Scalars['String']>;
  /** Event Capacity */
  eventCapacity?: Maybe<Scalars['Int']>;
  /** Event End Date */
  eventEndDate?: Maybe<Scalars['String']>;
  /** Event Location */
  eventLocation?: Maybe<Scalars['String']>;
  /** Event Online URL */
  eventOnlineUrl?: Maybe<Scalars['String']>;
  /** Event Registered Count */
  eventRegisteredCount: Scalars['Int'];
  /** Event Start Date */
  eventStartDate?: Maybe<Scalars['String']>;
  /** Event Type */
  eventType?: Maybe<Scalars['String']>;
  /** Event Waitlist Enabled */
  eventWaitlistEnabled: Scalars['Boolean'];
  /** Features */
  features?: Maybe<Scalars['String']>;
  /** FileInfo */
  fileInfo?: Maybe<Scalars['String']>;
  /** Grace Period */
  gracePeriod?: Maybe<Scalars['Int']>;
  /** Unique ID */
  id: Scalars['Int'];
  /** Images */
  images: Scalars['String'];
  /** Inventory Count */
  inventoryCount?: Maybe<Scalars['Int']>;
  /** Is Backorder Allowed */
  isBackorderAllowed: Scalars['Boolean'];
  /** Is Visible */
  isVisible: Scalars['Boolean'];
  /** License */
  license?: Maybe<Scalars['String']>;
  /** Meta Description */
  metaDescription?: Maybe<Scalars['String']>;
  /** Meta Title */
  metaTitle?: Maybe<Scalars['String']>;
  /** Product Name */
  name: Scalars['String'];
  /** Price */
  price: Scalars['Float'];
  /** Renewal */
  renewal?: Maybe<Scalars['String']>;
  /** SKU */
  sku: Scalars['String'];
  /** Product Slug */
  slug: Scalars['String'];
  /** Status */
  status: Scalars['String'];
  /** Stock Threshold */
  stockThreshold?: Maybe<Scalars['Int']>;
  /** Tax Code */
  taxCode?: Maybe<Scalars['String']>;
  /** Trial Period Days */
  trialPeriodDays?: Maybe<Scalars['Int']>;
  /** Type */
  type: Scalars['String'];
  /** Product Updated At */
  updatedAt: Scalars['String'];
  /** UUID */
  uuid: Scalars['String'];
  /** Variants */
  variants: Scalars['String'];
  /** Venue Name */
  venueName?: Maybe<Scalars['String']>;
  /** Weight */
  weight?: Maybe<Scalars['Float']>;
};

export type ProductImage = {
  __typename?: 'ProductImage';
  altText?: Maybe<Scalars['String']>;
  isPrimary?: Maybe<Scalars['Boolean']>;
  url: Scalars['String'];
};

/** A paginated list of Product items. */
export type ProductPaginator = {
  __typename?: 'ProductPaginator';
  /** A list of Product items. */
  data: Array<Product>;
  /** Pagination information about the list of items. */
  paginatorInfo: PaginatorInfo;
};

export enum ProductStatus {
  Active = 'ACTIVE',
  Archived = 'ARCHIVED',
  Discontinued = 'DISCONTINUED',
  Draft = 'DRAFT'
}

export enum ProductType {
  Digital = 'digital',
  Event = 'event',
  Physical = 'physical',
  Subscription = 'subscription'
}

export type ProductVariant = {
  __typename?: 'ProductVariant';
  attributes?: Maybe<Array<Maybe<Scalars['String']>>>;
  id: Scalars['ID'];
  inventory?: Maybe<Scalars['Int']>;
  priceAdjustment: Scalars['Float'];
  sku: Scalars['String'];
};

/** A user profile on Greep */
export type Profile = {
  __typename?: 'Profile';
  /** User UUID */
  auth_user_id: Scalars['String'];
  /** The attached business */
  business?: Maybe<Business>;
  /** Profile Created At */
  created_at: Scalars['DateTime'];
  /** The attached customer */
  customer?: Maybe<Customer>;
  /** Default Currency */
  default_currency?: Maybe<Scalars['String']>;
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
  /** Get bank account details */
  GetBankAccountDetails: Scalars['String'];
  /** Get a paginated list of beneficiaries for the authenticated user */
  GetBeneficiaries: BeneficiaryPaginator;
  GetCategories: CategoryPaginator;
  GetDeliveries: DeliveryPaginator;
  /** Get the current exchange rate between two currencies */
  GetExchangeRate: ExchangeRate;
  /** Get financial summary */
  GetFinancialSummary: FinancialSummaryResponse;
  /** Get the global exchange rate between two currencies */
  GetGlobalExchangeRate: GlobalExchangeRate;
  GetMarkets: BusinessPaginator;
  GetMyTickets: TicketPaginator;
  /** Get a paginated list of notifications for the authenticated user */
  GetNotifications: NotificationPaginator;
  /** Get the currently supported on-ramp channels for a specific country */
  GetOnRampChannelsByCountryCode: Array<PaymentChannel>;
  /** Get the currently supported on-ramp currencies */
  GetOnRampCurrencies: Array<SupportedCurrency>;
  /** Get the currently supported on-ramp networks by country code */
  GetOnRampNetworkByCountryCode: Array<PaymentNetwork>;
  /** Get a order by UUID */
  GetOrder?: Maybe<Order>;
  GetOrders: OrderPaginator;
  /** Get many point transactions */
  GetPointTransactions: PointTransactionPaginator;
  /** Get a product by UUID */
  GetProduct?: Maybe<Product>;
  GetProducts: ProductPaginator;
  /** Get a paginated list of saved accounts for the authenticated user */
  GetSavedAccounts: UserBankPaginator;
  GetSingleDelivery?: Maybe<Delivery>;
  /** Get a single point transaction by UUID */
  GetSinglePointTransaction?: Maybe<PointTransaction>;
  /** Get a Ticker by UUID */
  GetSingleTicket?: Maybe<Ticket>;
  /** Get a single transaction by UUID */
  GetSingleTransaction?: Maybe<Transaction>;
  /** Get user by UUID */
  GetSingleUser?: Maybe<User>;
  /** Get many transactions - paginated list of transactions for the authenticated user */
  GetTransactions: TransactionPaginator;
  /** Get withdrawal info */
  GetWithdrawInfo: WithdrawInfo;
  /** Get yellow card networks */
  GetYellowCardNetwork: Array<YellowcardNetwork>;
  /** Search businesses by name */
  SearchBusinesses: Array<Business>;
  /** Search users by name */
  SearchUsers: Array<User>;
};


export type QueryGetBankAccountDetailsArgs = {
  accountNumber: Scalars['String'];
  networkId: Scalars['String'];
};


export type QueryGetBeneficiariesArgs = {
  first: Scalars['Int'];
  page?: InputMaybe<Scalars['Int']>;
};


export type QueryGetCategoriesArgs = {
  first: Scalars['Int'];
  orderBy?: InputMaybe<Array<QueryGetCategoriesOrderByOrderByClause>>;
  page?: InputMaybe<Scalars['Int']>;
};


export type QueryGetDeliveriesArgs = {
  first: Scalars['Int'];
  orderBy?: InputMaybe<Array<QueryGetDeliveriesOrderByOrderByClause>>;
  page?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<QueryGetDeliveriesWhereWhereConditions>;
};


export type QueryGetExchangeRateArgs = {
  from_currency: Scalars['String'];
  to_currency: Scalars['String'];
};


export type QueryGetFinancialSummaryArgs = {
  input: FinancialSummaryInput;
};


export type QueryGetGlobalExchangeRateArgs = {
  base: Scalars['String'];
  target: Scalars['String'];
};


export type QueryGetMarketsArgs = {
  first: Scalars['Int'];
  orderBy?: InputMaybe<Array<QueryGetMarketsOrderByOrderByClause>>;
  page?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<QueryGetMarketsWhereWhereConditions>;
};


export type QueryGetMyTicketsArgs = {
  first: Scalars['Int'];
  page?: InputMaybe<Scalars['Int']>;
};


export type QueryGetNotificationsArgs = {
  first: Scalars['Int'];
  page?: InputMaybe<Scalars['Int']>;
  type: Scalars['String'];
};


export type QueryGetOnRampChannelsByCountryCodeArgs = {
  country_code: Scalars['String'];
};


export type QueryGetOnRampNetworkByCountryCodeArgs = {
  country_code: Scalars['String'];
};


export type QueryGetOrderArgs = {
  uuid: Scalars['String'];
};


export type QueryGetOrdersArgs = {
  first: Scalars['Int'];
  orderBy?: InputMaybe<Array<QueryGetOrdersOrderByOrderByClause>>;
  page?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<QueryGetOrdersWhereWhereConditions>;
};


export type QueryGetPointTransactionsArgs = {
  first: Scalars['Int'];
  orderBy?: InputMaybe<Array<QueryGetPointTransactionsOrderByOrderByClause>>;
  page?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<QueryGetPointTransactionsWhereWhereConditions>;
};


export type QueryGetProductArgs = {
  uuid: Scalars['String'];
};


export type QueryGetProductsArgs = {
  first: Scalars['Int'];
  orderBy?: InputMaybe<Array<QueryGetProductsOrderByOrderByClause>>;
  page?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<QueryGetProductsWhereWhereConditions>;
};


export type QueryGetSavedAccountsArgs = {
  first: Scalars['Int'];
  page?: InputMaybe<Scalars['Int']>;
};


export type QueryGetSingleDeliveryArgs = {
  uuid: Scalars['String'];
};


export type QueryGetSinglePointTransactionArgs = {
  uuid: Scalars['String'];
};


export type QueryGetSingleTicketArgs = {
  uuid: Scalars['String'];
};


export type QueryGetSingleTransactionArgs = {
  uuid: Scalars['String'];
};


export type QueryGetSingleUserArgs = {
  uuid: Scalars['String'];
};


export type QueryGetTransactionsArgs = {
  first: Scalars['Int'];
  orderBy?: InputMaybe<Array<QueryGetTransactionsOrderByOrderByClause>>;
  page?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<QueryGetTransactionsWhereWhereConditions>;
};


export type QueryGetWithdrawInfoArgs = {
  amount: Scalars['Float'];
  country_code?: InputMaybe<Scalars['String']>;
  currency?: InputMaybe<Scalars['String']>;
};


export type QueryGetYellowCardNetworkArgs = {
  country_code: Scalars['String'];
};


export type QuerySearchBusinessesArgs = {
  query: Scalars['String'];
};


export type QuerySearchUsersArgs = {
  query: Scalars['String'];
};

/** Allowed column names for Query.GetCategories.orderBy. */
export enum QueryGetCategoriesOrderByColumn {
  Name = 'NAME'
}

/** Order by clause for Query.GetCategories.orderBy. */
export type QueryGetCategoriesOrderByOrderByClause = {
  /** The column that is used for ordering. */
  column: QueryGetCategoriesOrderByColumn;
  /** The direction that is used for ordering. */
  order: SortOrder;
};

/** Allowed column names for Query.GetDeliveries.orderBy. */
export enum QueryGetDeliveriesOrderByColumn {
  CreatedAt = 'CREATED_AT'
}

/** Order by clause for Query.GetDeliveries.orderBy. */
export type QueryGetDeliveriesOrderByOrderByClause = {
  /** The column that is used for ordering. */
  column: QueryGetDeliveriesOrderByColumn;
  /** The direction that is used for ordering. */
  order: SortOrder;
};

/** Allowed column names for Query.GetDeliveries.where. */
export enum QueryGetDeliveriesWhereColumn {
  OrderId = 'ORDER_ID',
  Status = 'STATUS'
}

/** Dynamic WHERE conditions for the `where` argument of the query `GetDeliveries`. */
export type QueryGetDeliveriesWhereWhereConditions = {
  /** A set of conditions that requires all conditions to match. */
  AND?: InputMaybe<Array<QueryGetDeliveriesWhereWhereConditions>>;
  /** Check whether a relation exists. Extra conditions or a minimum amount can be applied. */
  HAS?: InputMaybe<QueryGetDeliveriesWhereWhereConditionsRelation>;
  /** A set of conditions that requires at least one condition to match. */
  OR?: InputMaybe<Array<QueryGetDeliveriesWhereWhereConditions>>;
  /** The column that is used for the condition. */
  column?: InputMaybe<QueryGetDeliveriesWhereColumn>;
  /** The operator that is used for the condition. */
  operator?: InputMaybe<SqlOperator>;
  /** The value that is used for the condition. */
  value?: InputMaybe<Scalars['Mixed']>;
};

/** Dynamic HAS conditions for WHERE conditions for the `where` argument of the query `GetDeliveries`. */
export type QueryGetDeliveriesWhereWhereConditionsRelation = {
  /** The amount to test. */
  amount?: InputMaybe<Scalars['Int']>;
  /** Additional condition logic. */
  condition?: InputMaybe<QueryGetDeliveriesWhereWhereConditions>;
  /** The comparison operator to test against the amount. */
  operator?: InputMaybe<SqlOperator>;
  /** The relation that is checked. */
  relation: Scalars['String'];
};

/** Allowed column names for Query.GetMarkets.orderBy. */
export enum QueryGetMarketsOrderByColumn {
  CreatedAt = 'CREATED_AT'
}

/** Order by clause for Query.GetMarkets.orderBy. */
export type QueryGetMarketsOrderByOrderByClause = {
  /** The column that is used for ordering. */
  column: QueryGetMarketsOrderByColumn;
  /** The direction that is used for ordering. */
  order: SortOrder;
};

/** Allowed column names for Query.GetMarkets.where. */
export enum QueryGetMarketsWhereColumn {
  AuthUserId = 'AUTH_USER_ID',
  BusinessName = 'BUSINESS_NAME'
}

/** Dynamic WHERE conditions for the `where` argument of the query `GetMarkets`. */
export type QueryGetMarketsWhereWhereConditions = {
  /** A set of conditions that requires all conditions to match. */
  AND?: InputMaybe<Array<QueryGetMarketsWhereWhereConditions>>;
  /** Check whether a relation exists. Extra conditions or a minimum amount can be applied. */
  HAS?: InputMaybe<QueryGetMarketsWhereWhereConditionsRelation>;
  /** A set of conditions that requires at least one condition to match. */
  OR?: InputMaybe<Array<QueryGetMarketsWhereWhereConditions>>;
  /** The column that is used for the condition. */
  column?: InputMaybe<QueryGetMarketsWhereColumn>;
  /** The operator that is used for the condition. */
  operator?: InputMaybe<SqlOperator>;
  /** The value that is used for the condition. */
  value?: InputMaybe<Scalars['Mixed']>;
};

/** Dynamic HAS conditions for WHERE conditions for the `where` argument of the query `GetMarkets`. */
export type QueryGetMarketsWhereWhereConditionsRelation = {
  /** The amount to test. */
  amount?: InputMaybe<Scalars['Int']>;
  /** Additional condition logic. */
  condition?: InputMaybe<QueryGetMarketsWhereWhereConditions>;
  /** The comparison operator to test against the amount. */
  operator?: InputMaybe<SqlOperator>;
  /** The relation that is checked. */
  relation: Scalars['String'];
};

/** Allowed column names for Query.GetOrders.orderBy. */
export enum QueryGetOrdersOrderByColumn {
  CreatedAt = 'CREATED_AT'
}

/** Order by clause for Query.GetOrders.orderBy. */
export type QueryGetOrdersOrderByOrderByClause = {
  /** The column that is used for ordering. */
  column: QueryGetOrdersOrderByColumn;
  /** The direction that is used for ordering. */
  order: SortOrder;
};

/** Allowed column names for Query.GetOrders.where. */
export enum QueryGetOrdersWhereColumn {
  Status = 'STATUS'
}

/** Dynamic WHERE conditions for the `where` argument of the query `GetOrders`. */
export type QueryGetOrdersWhereWhereConditions = {
  /** A set of conditions that requires all conditions to match. */
  AND?: InputMaybe<Array<QueryGetOrdersWhereWhereConditions>>;
  /** Check whether a relation exists. Extra conditions or a minimum amount can be applied. */
  HAS?: InputMaybe<QueryGetOrdersWhereWhereConditionsRelation>;
  /** A set of conditions that requires at least one condition to match. */
  OR?: InputMaybe<Array<QueryGetOrdersWhereWhereConditions>>;
  /** The column that is used for the condition. */
  column?: InputMaybe<QueryGetOrdersWhereColumn>;
  /** The operator that is used for the condition. */
  operator?: InputMaybe<SqlOperator>;
  /** The value that is used for the condition. */
  value?: InputMaybe<Scalars['Mixed']>;
};

/** Dynamic HAS conditions for WHERE conditions for the `where` argument of the query `GetOrders`. */
export type QueryGetOrdersWhereWhereConditionsRelation = {
  /** The amount to test. */
  amount?: InputMaybe<Scalars['Int']>;
  /** Additional condition logic. */
  condition?: InputMaybe<QueryGetOrdersWhereWhereConditions>;
  /** The comparison operator to test against the amount. */
  operator?: InputMaybe<SqlOperator>;
  /** The relation that is checked. */
  relation: Scalars['String'];
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

/** Allowed column names for Query.GetProducts.orderBy. */
export enum QueryGetProductsOrderByColumn {
  CreatedAt = 'CREATED_AT'
}

/** Order by clause for Query.GetProducts.orderBy. */
export type QueryGetProductsOrderByOrderByClause = {
  /** The column that is used for ordering. */
  column: QueryGetProductsOrderByColumn;
  /** The direction that is used for ordering. */
  order: SortOrder;
};

/** Allowed column names for Query.GetProducts.where. */
export enum QueryGetProductsWhereColumn {
  BusinessId = 'BUSINESS_ID',
  Id = 'ID',
  Name = 'NAME',
  Type = 'TYPE'
}

/** Dynamic WHERE conditions for the `where` argument of the query `GetProducts`. */
export type QueryGetProductsWhereWhereConditions = {
  /** A set of conditions that requires all conditions to match. */
  AND?: InputMaybe<Array<QueryGetProductsWhereWhereConditions>>;
  /** Check whether a relation exists. Extra conditions or a minimum amount can be applied. */
  HAS?: InputMaybe<QueryGetProductsWhereWhereConditionsRelation>;
  /** A set of conditions that requires at least one condition to match. */
  OR?: InputMaybe<Array<QueryGetProductsWhereWhereConditions>>;
  /** The column that is used for the condition. */
  column?: InputMaybe<QueryGetProductsWhereColumn>;
  /** The operator that is used for the condition. */
  operator?: InputMaybe<SqlOperator>;
  /** The value that is used for the condition. */
  value?: InputMaybe<Scalars['Mixed']>;
};

/** Dynamic HAS conditions for WHERE conditions for the `where` argument of the query `GetProducts`. */
export type QueryGetProductsWhereWhereConditionsRelation = {
  /** The amount to test. */
  amount?: InputMaybe<Scalars['Int']>;
  /** Additional condition logic. */
  condition?: InputMaybe<QueryGetProductsWhereWhereConditions>;
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

export type Renewal = {
  __typename?: 'Renewal';
  autoRenew: Scalars['Boolean'];
  price?: Maybe<Scalars['Float']>;
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

/** A sale */
export type Sale = {
  __typename?: 'Sale';
  /** Applied Discounts */
  appliedDiscounts?: Maybe<Scalars['String']>;
  /** Sale Created At */
  createdAt: Scalars['String'];
  /** Currency */
  currency: Scalars['String'];
  /** Customer ID */
  customerId: Scalars['Int'];
  /** Discount Amount */
  discountAmount: Scalars['Float'];
  /** Unique ID */
  id: Scalars['Int'];
  /** Items */
  items: Scalars['String'];
  /** Metadata */
  metadata?: Maybe<Scalars['String']>;
  /** Payment Details */
  paymentDetails: Scalars['String'];
  /** Refund Details */
  refundDetails?: Maybe<Scalars['String']>;
  /** Status */
  status: Scalars['String'];
  /** Subtotal Amount */
  subtotalAmount: Scalars['Float'];
  /** Tax Amount */
  taxAmount: Scalars['Float'];
  /** Tax Details */
  taxDetails?: Maybe<Scalars['String']>;
  /** Total Amount */
  totalAmount: Scalars['Float'];
  /** Transaction ID */
  transactionId: Scalars['String'];
  /** Sale Updated At */
  updatedAt: Scalars['String'];
  /** The attached user */
  user: User;
  /** UUID */
  uuid: Scalars['String'];
};

/** Sender Details */
export type Sender = {
  __typename?: 'Sender';
  /** Sender's Address */
  address: Scalars['String'];
  /** Sender's Country */
  country: Scalars['String'];
  /** Sender's Date of Birth */
  dob: Scalars['String'];
  /** Sender's Email */
  email: Scalars['String'];
  /** Sender's ID Number */
  idNumber: Scalars['String'];
  /** Sender's ID Type */
  idType: Scalars['String'];
  /** Sender's Name */
  name: Scalars['String'];
  /** Sender's Phone Number */
  phone: Scalars['String'];
};

export enum ShippingClass {
  Express = 'EXPRESS',
  Oversized = 'OVERSIZED',
  Standard = 'STANDARD'
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

export type SubscriptionProduct = {
  __typename?: 'SubscriptionProduct';
  billing: Billing;
  features: Array<Scalars['String']>;
  renewal: Renewal;
};

export type SupportedCurrency = {
  __typename?: 'SupportedCurrency';
  code: Scalars['String'];
  country: Scalars['String'];
  currency: Scalars['String'];
  supported_methods: Array<Scalars['String']>;
};

/** A ticket */
export type Ticket = {
  __typename?: 'Ticket';
  /** Ticket Created At */
  createdAt: Scalars['String'];
  /** Unique ID */
  id: Scalars['Int'];
  /** Price */
  price: Scalars['Float'];
  /** Product */
  product: Product;
  /** QR Code */
  qrCode?: Maybe<Scalars['String']>;
  /** Sale */
  sale: Sale;
  /** Sale ID */
  saleId?: Maybe<Scalars['Int']>;
  /** Status */
  status: Scalars['String'];
  /** Ticket Type */
  ticketType: Scalars['String'];
  /** Ticket Updated At */
  updatedAt: Scalars['String'];
  /** User ID */
  userId: Scalars['Int'];
  /** UUID */
  uuid: Scalars['String'];
  /** Variant ID */
  variantId?: Maybe<Scalars['String']>;
};

/** A paginated list of Ticket items. */
export type TicketPaginator = {
  __typename?: 'TicketPaginator';
  /** A list of Ticket items. */
  data: Array<Ticket>;
  /** Pagination information about the list of items. */
  paginatorInfo: PaginatorInfo;
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
  /** The associated point transaction */
  point_transaction?: Maybe<PointTransaction>;
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
  /** The attached businesses */
  businesses: Array<Business>;
  /** The user created at */
  created_at: Scalars['String'];
  /** The user email */
  email: Scalars['String'];
  /** The user email verified at */
  email_verified_at?: Maybe<Scalars['String']>;
  /** The user first name */
  first_name: Scalars['String'];
  /** The user unique ID */
  id: Scalars['ID'];
  /** The user last name */
  last_name: Scalars['String'];
  /** The user phone */
  phone?: Maybe<Scalars['String']>;
  /** The user phone verified at */
  phone_verified_at?: Maybe<Scalars['String']>;
  /** The attached profile */
  profile: Profile;
  /** The user status */
  status: Scalars['String'];
  /** The auth passcode */
  transaction_pin?: Maybe<Scalars['String']>;
  /** The user updated at */
  updated_at: Scalars['String'];
  /** The user username */
  username?: Maybe<Scalars['String']>;
  /** Unique UUID */
  uuid: Scalars['String'];
  /** The attached wallet */
  wallet: Wallet;
};

/** A single beneficiary */
export type UserBank = {
  __typename?: 'UserBank';
  /** Account Number */
  account_no: Scalars['String'];
  /** Bank Code */
  bank_code: Scalars['String'];
  /** Bank Name */
  bank_name: Scalars['String'];
  /** Currency (default: 'USDC') */
  currency: Scalars['String'];
  /** Is Verified */
  is_verified: Scalars['Boolean'];
  /** Metadata associated with the beneficiary */
  meta_data?: Maybe<Scalars['String']>;
  /** State of the beneficiary (active or archived) */
  state: Scalars['String'];
  /** Unique UUID */
  uuid: Scalars['String'];
  /** Wallet ID */
  wallet_id: Scalars['Int'];
};

/** A paginated list of UserBank items. */
export type UserBankPaginator = {
  __typename?: 'UserBankPaginator';
  /** A list of UserBank items. */
  data: Array<UserBank>;
  /** Pagination information about the list of items. */
  paginatorInfo: PaginatorInfo;
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
  /** The Wallet ID */
  id: Scalars['Int'];
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

export type WithdrawInfo = {
  __typename?: 'WithdrawInfo';
  currency?: Maybe<Scalars['String']>;
  methods: Array<WithdrawMethod>;
};

export type WithdrawMethod = {
  __typename?: 'WithdrawMethod';
  description?: Maybe<Scalars['String']>;
  fee?: Maybe<Scalars['String']>;
  max_amount?: Maybe<Scalars['Float']>;
  min_amount?: Maybe<Scalars['Float']>;
  name: Scalars['String'];
  unique_id?: Maybe<Scalars['String']>;
};

/** Yellowcard Network */
export type YellowcardNetwork = {
  __typename?: 'YellowcardNetwork';
  /** Account Number Type */
  accountNumberType?: Maybe<Scalars['String']>;
  /** Channel IDs */
  channelIds?: Maybe<Array<Maybe<Scalars['String']>>>;
  /** Network Code */
  code?: Maybe<Scalars['String']>;
  /** Country Code */
  country?: Maybe<Scalars['String']>;
  /** Country Account Number Type */
  countryAccountNumberType?: Maybe<Scalars['String']>;
  /** Has branch */
  hasBranch?: Maybe<Scalars['Boolean']>;
  /** Unique ID */
  id: Scalars['String'];
  /** Network Name */
  name?: Maybe<Scalars['String']>;
  /** Status */
  status?: Maybe<Scalars['String']>;
};
