import CommonModule from "./Common"
import FormModule from "./form"
import AuthModule from "./Auth"
import BeneficiaryModule from "./Beneficiary"
import DeliveryModule from "./Delivery"
import MarketModule from "./Market"
import NotificationModule from "./Notification"
import OrderModule from "./Order"
import PaymentModule from "./Payment"
import TicketModule from "./Ticket"
import TransactionModule from "./Transaction"
import UserModule from "./User"
import WalletModule from "./Wallet"
import Product from "./Product"
import ConstantModule from "./ConstantModule"

export const Logic = {
  Common: new CommonModule(),
  Form: new FormModule(),
  Auth: new AuthModule(),
  Beneficiary: new BeneficiaryModule(),
  Delivery: new DeliveryModule(),
  Market: new MarketModule(),
  Notification: new NotificationModule(),
  Order: new OrderModule(),
  Payment: new PaymentModule(),
  Product: new Product(),
  Ticket: new TicketModule(),
  Transaction: new TransactionModule(),
  User: new UserModule(),
  Wallet: new WalletModule(),
  Constant: new ConstantModule(),
}
