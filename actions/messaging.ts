import { Context } from "@tenderly/actions";
import axios from "axios";
import { ethers } from "ethers";
import { ChainConfig, RiskObservable } from "./types";

const BPS_PRECISION = 10_000;
const PERCENT = 100;

const SAFE_CHAIN_NAMES = {
  56: "bnb",
  42161: "arb",
};

export const postProposalToTelegram = async (
  context: Context,
  chainConfig: ChainConfig,
  nonce: number,
  observable: RiskObservable,
  newValue: ethers.BigNumber,
  previousValue: ethers.BigNumber
) => {
  const url = "https://api.telegram.org/bot";
  const commonLinkUrl = "https://app.safe.global/transactions/queue?safe=";

  const chat_id = await context.secrets.get("RISK_ORACLE_CHAT_ID");
  const bot_id = await context.secrets.get("RISK_ORACLE_BOT_TOKEN");

  let subMessage: string;
  switch (observable.updateName) {
    case "Reserve Factor":
      const newFactor = parseInt(newValue.toString(), 16);
      const oldFactor = parseInt(previousValue.toString(), 16);
      const newPercent = (newFactor * PERCENT) / BPS_PRECISION;
      const oldPercent = (oldFactor * PERCENT) / BPS_PRECISION;
      subMessage = `
      Reserve factor for ${observable.assetSymbol} in ${String(observable.lendingPoolType)} update:
      <b> Should be: ${newPercent}% </b> 
      Was: ${oldPercent}%,
      rTokenAddr: ${observable.rTokenAddr}
      `;
      break;
    default:
      subMessage = `Unknown update type: ${observable.updateName} pushed`;
  }

  const link = `${commonLinkUrl}${SAFE_CHAIN_NAMES[chainConfig.chainId as keyof typeof SAFE_CHAIN_NAMES]}:${chainConfig.adminSafeAddr}`;
  const msg = `
  TEST TEST TEST TEST
  -----------------------------------------
  <b> Nonce ${nonce} - ${chainConfig.chainName} </b>
  Chaos Labs posted a proposal:
  ${subMessage} 
  Checkout Safe-txs queue: <a href="${link}">Link</a>
  -----------------------------------------
  `;

  await axios.post(
    `${url}${bot_id}/sendMessage`,
    {
      chat_id: chat_id,
      text: msg,
      parse_mode: "HTML",
      disable_web_page_preview: true,
    },
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  );
  console.log("Posted proposal to telegram");
};
