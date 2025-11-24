import { ccc } from "@ckb-ccc/connector-react"
import { CkbSigner } from '@superise/ckb'

export class SuperiseSignersController extends ccc.SignersController {
  override async addRealSigners(context: ccc.SignersControllerRefreshContext) {
    const { appName, appIcon, client, preferredNetworks } = context;
    await this.addSigners(
      "SupeRISE Wallet",
      '/superise/logo.png',
      [
        new CkbSigner(
          window.superise,
          client,
        )
      ],
      context,
    );
  }
  override async addDummySigners() {}
}