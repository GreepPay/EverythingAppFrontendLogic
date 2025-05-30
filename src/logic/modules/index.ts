import CommonModule from "./Common"
import FormModule from "./form"
import AuthModule from "./Auth"
import BeneficiaryModule from "./Beneficiary"
import DeliveryModule from "./Delivery"
import MarketModule from "./Market"
import NotificationModule from "./Notification"
import OrderModule from "./Order"
import PaymentModule from "./Payment"
import ProductModule from "./Product"
import TicketModule from "./Ticket"
import TransactionModule from "./Transaction"
import UserModule from "./User"

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
  Product: new ProductModule(),
  Ticket: new TicketModule(),
  Transaction: new TransactionModule(),
  User: new UserModule(),
}
