import { Context, Event, TransactionEvent } from "@tenderly/actions";
import { ethers } from "ethers";
import { RISK_ORACLE_ABI } from "./constants";
import { ChainConfig, RiskParamUpdate } from "./types";
import { handleRiskParamUpdate } from "./utils";
import { postProposalToTelegram } from "./messaging";

export const riskOracleWatchFn = async (
  context: Context,
  event: Event,
  chainConfig: ChainConfig
) => {
  let txEvent = event as TransactionEvent;
  const riskOracleIface = new ethers.utils.Interface(RISK_ORACLE_ABI);
  const oracleEvent = riskOracleIface.decodeEventLog(
    "ParameterUpdated",
    txEvent.logs[0].data,
    txEvent.logs[0].topics
  );
  const { updateType, updateId, market, timestamp, newValue, previousValue } =
    oracleEvent;
  const paramUpdate: RiskParamUpdate = {
    updateType,
    updateId,
    market,
    timestamp,
    newValue,
    previousValue,
  };
  paramUpdate.updateType =
    typeof paramUpdate.updateType === "string"
      ? paramUpdate.updateType
      : paramUpdate.updateType.hash;
  paramUpdate.market =
    typeof paramUpdate.market === "string"
      ? paramUpdate.market
      : paramUpdate.market.hash;
  console.log("Caught 'ParameterUpdated' event:", paramUpdate);

  const result = await handleRiskParamUpdate(context, paramUpdate, chainConfig);
  if (result !== undefined) {
    console.log("Successfully proposed safe-tx:nonce:", result.nonce);
    await postProposalToTelegram(
      context,
      chainConfig,
      result.nonce,
      result.riskObservable,
      paramUpdate.newValue,
      paramUpdate.previousValue
    );
  }
};
