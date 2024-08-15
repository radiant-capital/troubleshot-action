import { ActionFn, Context, Event, TransactionEvent } from "@tenderly/actions";
import { ethers } from "ethers";
import { RISK_ORACLE_ABI } from "./constants";
import { ChainConfig, RiskParamUpdate } from "./types";
import { getConfig, handleRiskParamUpdate } from "./utils";
import { postProposalToTelegram } from "./messaging";

const chainConfig = getConfig("bsc") as ChainConfig;

export const watchFn: ActionFn = async (context: Context, event: Event) => {
  let txEvent = event as TransactionEvent;
  const riskOracleIface = new ethers.utils.Interface(RISK_ORACLE_ABI);
  const oracleEvent = riskOracleIface.decodeEventLog(
    "ParameterUpdated",
    txEvent.logs[0].data,
    txEvent.logs[0].topics
  );
  console.log("oracleEvent:", oracleEvent);
  const { updateType, updateId, market, timestamp, newValue } = oracleEvent;
  const paramUpdate: RiskParamUpdate = {
    updateType,
    updateId,
    market,
    timestamp,
    newValue,
  };
  const result = await handleRiskParamUpdate(context, paramUpdate, chainConfig);
  if (result !== undefined) {
    await postProposalToTelegram(
      context,
      chainConfig.chainName,
      result.nonce,
      result.riskObservable.updateName,
      paramUpdate.newValue
    );
  }
};
