import { Context } from "@tenderly/actions";
import { ChainConfig, RiskObservable, RiskParamUpdate } from "./types";
import {
  CONFIGS,
  LENDING_POOL_CONFIGURATOR_ABI,
  RESERVE_FACTOR_TYPE,
} from "./constants";
import { ethers } from "ethers";
import SafeApiKit from "@safe-global/api-kit";
import Safe from "@safe-global/protocol-kit";
import {
  MetaTransactionData,
  OperationType,
} from "@safe-global/safe-core-sdk-types";

export function getConfig(chainName: string): ChainConfig {
  const config = CONFIGS[chainName];
  if (!config) {
    throw new Error(`Configuration for chain ${chainName} not found`);
  }
  return config;
}

export function prepareRiskUpdateMetaTx(
  param: RiskParamUpdate,
  config: ChainConfig,
  observable: RiskObservable
): MetaTransactionData {
  const lpConfigIface = new ethers.utils.Interface(
    LENDING_POOL_CONFIGURATOR_ABI
  );
  switch (param.updateType) {
    case RESERVE_FACTOR_TYPE:
      return {
        to: config.lendingPoolConfiguratorAddr,
        value: "0",
        data: lpConfigIface.encodeFunctionData("setReserveFactor", [
          observable.assetAddr,
          param.newValue,
        ]),
        operation: OperationType.Call,
      };
    case "anotherType":
      return {
        to: "0x",
        value: "0x",
        data: "0x",
        operation: OperationType.Call,
      };
    default:
      throw new Error(`Unknown updateType: ${param.updateType}`);
  }
}

export async function handleRiskParamUpdate(
  context: Context,
  param: RiskParamUpdate,
  config: ChainConfig
): Promise<
  | {
      riskObservable: RiskObservable;
      nonce: number;
    }
  | undefined
> {
  const wallet = new ethers.Wallet(
    await context.secrets.get(config.signerSecret)
  );
  for (const observable of config.observables) {
    if (
      observable.updateType === param.updateType &&
      observable.market === param.market
    ) {
      // Propose a new risk update in the Safe-multisig
      // 1. Initialize the Protocol Kit with Risk Proposer Address
      const protocolKitRPA = await Safe.init({
        provider: await context.secrets.get(config.rpcUrlSecret),
        signer: await context.secrets.get(config.signerSecret),
        safeAddress: config.adminSafeAddr,
      });
      // 2. Create a Safe transaction
      const safeTxData = prepareRiskUpdateMetaTx(param, config, observable);
      const safeTx = await protocolKitRPA.createTransaction({
        transactions: [safeTxData],
      });
      // 3. Sign the transaction with Risk Proposer Address
      const safeTxHash = await protocolKitRPA.getTransactionHash(safeTx);
      const signature = await protocolKitRPA.signHash(safeTxHash);
      // 4. Send the transaction to the Transaction Service
      const apiKit = new SafeApiKit({
        chainId: BigInt(config.chainId),
      });
      await apiKit.proposeTransaction({
        safeAddress: config.adminSafeAddr,
        safeTransactionData: safeTx.data,
        safeTxHash,
        senderAddress: wallet.address,
        senderSignature: signature.data,
      });
      // 5. Return the observable, nonce, and new value
      return {
        riskObservable: observable,
        nonce: safeTx.data.nonce,
      };
    }
  }
  return undefined;
}
