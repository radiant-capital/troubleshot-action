import dotenv from "dotenv";
dotenv.config();
import { ChainConfig } from "../actions/types";
import { getConfig } from "../actions/utils";
import { sampleTx } from "./sampleTx";
import { TestRuntime, TestTransactionEvent } from "@tenderly/actions-test";
import { watchFn } from "../actions/riskOracle_bsc";

const chainConfig = getConfig("bsc") as ChainConfig;

/*
 * Running Web3 Actions code locally.
 * TestRuntime is a helper class that allows you to run the functions,
 * and set storage and secrets before running the function
 **/
const main = async () => {
  const testRuntime = new TestRuntime();

  if (!process.env.RISK_ORACLE_PROPOSER)
    throw new Error("Missing RISK_ORACLE_PROPOSER env var");
  if (!process.env.BSC_RPC_URL) throw new Error("Missing BSC_RPC_URL env var");
  if (!process.env.RISK_ORACLE_CHAT_ID)
    throw new Error("Missing RISK_ORACLE_CHAT_ID env var");
  if (!process.env.RISK_ORACLE_BOT_TOKEN)
    throw new Error("Missing BOT_TOKEN env var");

  testRuntime.context.secrets.put(
    chainConfig.signerSecret,
    `${process.env.RISK_ORACLE_PROPOSER}`
  );
  testRuntime.context.secrets.put(
    chainConfig.rpcUrlSecret,
    `${process.env.BSC_RPC_URL}`
  );
  testRuntime.context.secrets.put(
    "RISK_ORACLE_CHAT_ID",
    `${process.env.RISK_ORACLE_CHAT_ID}`
  );
  testRuntime.context.secrets.put(
    "RISK_ORACLE_BOT_TOKEN",
    `${process.env.RISK_ORACLE_BOT_TOKEN}`
  );

  const te = new TestTransactionEvent();
  te.blockHash = sampleTx.blockHash;
  te.blockNumber = sampleTx.blockNumber;
  te.from = sampleTx.from;
  te.hash = sampleTx.hash;
  te.network = String(chainConfig.chainId);
  te.to = chainConfig.riskOracleAddr;
  te.logs = sampleTx.logs;
  te.input = sampleTx.input;
  te.value = sampleTx.value;
  te.nonce = sampleTx.nonce;
  te.gas = sampleTx.gas;
  te.gasUsed = sampleTx.gasUsed;
  te.cumulativeGasUsed = sampleTx.cumulativeGasUsed;
  te.gasPrice = sampleTx.gasPrice;
  te.gasTipCap = sampleTx.gasTipCap;
  te.gasFeeCap = sampleTx.gasFeeCap;
  te.transactionHash = sampleTx.hash;

  await testRuntime.execute(watchFn, te);
};

(async () => await main())();
