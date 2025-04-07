import CommonModule from "./Common"
import FormModule from "./form"

import AuthModule from "./Auth"
import BeneficiaryModule from "./Beneficiary"
import NotificationModule from "./Notification"
import UserModule from "./User"
import WalletModule from "./Wallet"

export const Logic = {
  Auth: new AuthModule(),
  Beneficiary: new BeneficiaryModule(),
  Notification: new NotificationModule(),
  User: new UserModule(),
  Wallet: new WalletModule(),
  Common: new CommonModule(),
  Form: new FormModule(),
}
