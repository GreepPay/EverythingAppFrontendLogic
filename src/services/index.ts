import AuthApi from "./AuthApi"
import WalletApi from "./WalletApi"
import BeneficiaryApi from "./BeneficiaryApi"
import UserApi from "./UserApi"
import NotificationApi from "./NotificationApi"

export const $api = {
  auth: new AuthApi(),
  beneficiary: new BeneficiaryApi(),
  user: new UserApi(),
  wallet: new WalletApi(),
  notification: new NotificationApi(),
}
