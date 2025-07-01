import AuthApi from "./AuthApi"
import BeneficiaryApi from "./BeneficiaryApi"
import DeliveryApi from "./DeliveryApi"
import MarketApi from "./MarketApi"
import NotificationApi from "./NotificationApi"
import OrderApi from "./OrderApi"
import PaymentApi from "./PaymentApi"
import ProductApi from "./ProductApi"
import TicketApi from "./TicketApi"
import TransactionApi from "./TransactionApi"
import UserApi from "./UserApi"
import WalletApi from "./WalletApi"

export const $api = {
  auth: new AuthApi(),
  beneficiary: new BeneficiaryApi(),
  delivery: new DeliveryApi(),
  market: new MarketApi(),
  notification: new NotificationApi(),
  order: new OrderApi(),
  payment: new PaymentApi(),
  product: new ProductApi(),
  ticket: new TicketApi(),
  transaction: new TransactionApi(),
  user: new UserApi(),
  wallet: new WalletApi(),
}
