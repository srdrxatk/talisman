import { DbTokenRates } from "@talismn/token-rates"
import { Dexie } from "dexie"

import { ProtectorSources, ProtectorStorage } from "../domains/app/protector/ParaverseProtector"
import { DiscoveredBalance } from "../domains/assetDiscovery/types"
import { TalismanMetadataDef } from "../domains/substrate/types"
import { WalletTransaction } from "../domains/transactions/types"
import { upgradeRemoveSymbolFromNativeTokenId } from "./upgrades"

export const MIGRATION_ERROR_MSG = "Talisman Dexie Migration Error"

class TalismanDatabase extends Dexie {
  assetDiscovery!: Dexie.Table<DiscoveredBalance, string>
  metadata!: Dexie.Table<TalismanMetadataDef, string>
  phishing!: Dexie.Table<ProtectorStorage, ProtectorSources>
  tokenRates!: Dexie.Table<DbTokenRates, string>
  transactions!: Dexie.Table<WalletTransaction, string>

  constructor() {
    super("Talisman")

    // https://dexie.org/docs/Tutorial/Design#database-versioning
    this.version(8)
      .stores({
        // You only need to specify properties that you wish to index.
        // The object store will allow any properties on your stored objects but you can only query them by indexed properties
        // https://dexie.org/docs/API-Reference#declare-database
        //
        // Never index properties containing images, movies or large (huge) strings. Store them in IndexedDB, yes! but just don’t index them!
        // https://dexie.org/docs/Version/Version.stores()#warning
        assetDiscovery: "id, tokenId, address",
        metadata: "genesisHash",
        phishing: "source, commitSha",
        tokenRates: "tokenId",
        transactions: "hash, status, timestamp",

        balances: null, // delete legacy table
        chainMetadataRpc: null, // delete legacy table
        chains: null, // delete legacy table
        evmNetworks: null, // delete legacy table
        metadataRpc: null, // delete legacy table
        tokens: null, // delete legacy table
      })
      .upgrade(upgradeRemoveSymbolFromNativeTokenId)
  }
}

export const db = new TalismanDatabase()
