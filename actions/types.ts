import { BigNumber } from "ethers";

export enum LendingPoolType {
  CORE_V2 = "CORE-V2",
  RIZ = "RIZ-MARKET",
}

export interface Indexed {
  _isIndexed: boolean;
  hash: string;
}

export interface RiskObservable {
  assetAddr: string;
  assetSymbol: string;
  lendingPoolType: LendingPoolType;
  market: string;
  rTokenAddr: string;
  updateName: string;
  updateType: string;
}

export interface RiskParamUpdate {
  updateType: string | Indexed;
  updateId: number;
  market: string | Indexed;
  timestamp: number;
  newValue: BigNumber;
  previousValue: BigNumber;
}

export interface ChainConfig {
  chainId: number;
  chainName: string;
  signerSecret: string;
  rpcUrlSecret: string;
  riskOracleAddr: string;
  adminSafeAddr: string;
  lendingPoolConfiguratorAddr: string;
  observables: readonly RiskObservable[];
}
