import { BigNumber } from "ethers";

export interface RiskObservable {
  updateType: string;
  updateName: string;
  market: string;
  rTokenAddr: string;
  assetAddr: string;
  assetSymbol: string;
}

export interface RiskParamUpdate {
  updateType: string;
  updateId: number;
  market: string;
  timestamp: number;
  newValue: BigNumber;
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
