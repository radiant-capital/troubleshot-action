import { ActionFn, Context, Event } from "@tenderly/actions";
import { ChainConfig } from "./types";
import { getConfig } from "./utils";
import { riskOracleWatchFn } from "./riskOracleCommon";

const chainConfig = getConfig("arbitrum") as ChainConfig;

export const watchFn: ActionFn = async (context: Context, event: Event) => {
  return riskOracleWatchFn(context, event, chainConfig);
};
