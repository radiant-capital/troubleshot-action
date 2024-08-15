import { Context } from "@tenderly/actions";
import axios from "axios";
import { ethers } from "ethers";

export const postProposalToTelegram = async (
  context: Context,
  chainName: string,
  nonce: number,
  updateName: string,
  newValue: ethers.BigNumber
) => {
  const url = "https://api.telegram.org/bot";
  const chat_id = await context.secrets.get("DEV_ALERT_CHAT_ID");
  const bot_id = await context.secrets.get("BOT_TOKEN");

  let subMessage: string;
  switch (updateName) {
    case "Reserve Factor":
      subMessage = `Reserve factor updated to ${newValue}`;
      break;
    default:
      subMessage = `Unknown update type: ${updateName}`;
  }

  const msg = `
    TEST TEST TEST TEST
    <b> Nonce ${nonce} - ${chainName} </b> \n
    Chaos lab posted a proposal: \n
   ${subMessage} \n
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
};
