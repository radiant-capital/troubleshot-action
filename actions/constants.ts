import { ChainConfig, LendingPoolType } from "./types";

export const RESERVE_FACTOR_TYPE =
  "0x7bc72ee4bd04451b3580b1e0b03f3f25aca8c380c59336d69c4988cfd3617c11"; // keccak256("ReserveFactor")

export const BNB_TEST_CONFIG: ChainConfig = {
  chainId: 56,
  chainName: "Binance Smart Chain",
  signerSecret: "RISK_ORACLE_PROPOSER",
  rpcUrlSecret: "BSC_RPC_URL",
  riskOracleAddr: "0xca12c01966ab3b7067c94013e1d231e391d685a4", // RiskOracle for testing
  adminSafeAddr: "0x1792FCBAccE5c67c96cE781A4C77e449F551726B", // adminSafe for testing
  lendingPoolConfiguratorAddr: "0x71aE996454ef2229C8C9512D70b122226DEbe765",
  observables: [
    {
      assetAddr: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
      assetSymbol: "USDC",
      lendingPoolType: LendingPoolType.CORE_V2,
      market:
        "0x2e07ab8730ced335f58fd4db08dc7cfcdd6482f230921ac9218e252963732a02", // keccak256(tokenAddress-USDC)
      rTokenAddr: "0x3bDCEf9e656fD9D03eA98605946b4fbF362C342b",
      updateName: "Reserve Factor",
      updateType: RESERVE_FACTOR_TYPE,
    },
  ],
} as const;

export const ARB_TEST_CONFIG: ChainConfig = {
  chainId: 42161,
  chainName: "Arbitrum",
  signerSecret: "RISK_ORACLE_PROPOSER",
  rpcUrlSecret: "ARB_RPC_URL",
  riskOracleAddr: "0x0d33160a6f4912c953c098fa169891f27eb16dfc", // RiskOracle for testing
  adminSafeAddr: "arb1:0x99fDC09151000d6531A34af45e37A7b634D6e2e1", // adminSafe for testing
  lendingPoolConfiguratorAddr: "0xe51dFE7188D0B9A84141ff47d04aB07aeB82B89D",
  observables: [
    {
      assetAddr: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
      assetSymbol: "USDC",
      lendingPoolType: LendingPoolType.CORE_V2,
      market:
        "0xb7da25363b87f26ed97405d909ff799fa027906d0d37a2f8ee2f5876defdaf9f", // keccak256(rTokenAddr-USDC)
      rTokenAddr: "0x3a2d44e354f2d88EF6DA7A5A4646fd70182A7F55",
      updateName: "Reserve Factor",
      updateType: RESERVE_FACTOR_TYPE,
    },
  ],
} as const;

export const CONFIGS: { [key: string]: ChainConfig } = {
  bsc: BNB_TEST_CONFIG,
  arbitrum: ARB_TEST_CONFIG,
};

export const RISK_ORACLE_ABI = [
  {
    type: "constructor",
    inputs: [
      {
        name: "initialSenders",
        type: "address[]",
        internalType: "address[]",
      },
      {
        name: "initialUpdateTypes",
        type: "string[]",
        internalType: "string[]",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "addAuthorizedSender",
    inputs: [{ name: "sender", type: "address", internalType: "address" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "addUpdateType",
    inputs: [{ name: "newUpdateType", type: "string", internalType: "string" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "getAllUpdateTypes",
    inputs: [],
    outputs: [{ name: "", type: "string[]", internalType: "string[]" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getLatestUpdateByParameterAndMarket",
    inputs: [
      { name: "updateType", type: "string", internalType: "string" },
      { name: "market", type: "bytes", internalType: "bytes" },
    ],
    outputs: [
      {
        name: "",
        type: "tuple",
        internalType: "struct RiskOracle.RiskParameterUpdate",
        components: [
          {
            name: "timestamp",
            type: "uint256",
            internalType: "uint256",
          },
          { name: "newValue", type: "bytes", internalType: "bytes" },
          {
            name: "referenceId",
            type: "string",
            internalType: "string",
          },
          {
            name: "previousValue",
            type: "bytes",
            internalType: "bytes",
          },
          {
            name: "updateType",
            type: "string",
            internalType: "string",
          },
          {
            name: "updateId",
            type: "uint256",
            internalType: "uint256",
          },
          { name: "market", type: "bytes", internalType: "bytes" },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getLatestUpdateByType",
    inputs: [{ name: "updateType", type: "string", internalType: "string" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        internalType: "struct RiskOracle.RiskParameterUpdate",
        components: [
          {
            name: "timestamp",
            type: "uint256",
            internalType: "uint256",
          },
          { name: "newValue", type: "bytes", internalType: "bytes" },
          {
            name: "referenceId",
            type: "string",
            internalType: "string",
          },
          {
            name: "previousValue",
            type: "bytes",
            internalType: "bytes",
          },
          {
            name: "updateType",
            type: "string",
            internalType: "string",
          },
          {
            name: "updateId",
            type: "uint256",
            internalType: "uint256",
          },
          { name: "market", type: "bytes", internalType: "bytes" },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getUpdateById",
    inputs: [{ name: "updateId", type: "uint256", internalType: "uint256" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        internalType: "struct RiskOracle.RiskParameterUpdate",
        components: [
          {
            name: "timestamp",
            type: "uint256",
            internalType: "uint256",
          },
          { name: "newValue", type: "bytes", internalType: "bytes" },
          {
            name: "referenceId",
            type: "string",
            internalType: "string",
          },
          {
            name: "previousValue",
            type: "bytes",
            internalType: "bytes",
          },
          {
            name: "updateType",
            type: "string",
            internalType: "string",
          },
          {
            name: "updateId",
            type: "uint256",
            internalType: "uint256",
          },
          { name: "market", type: "bytes", internalType: "bytes" },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "isAuthorized",
    inputs: [{ name: "sender", type: "address", internalType: "address" }],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "owner",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "publishBulkRiskParameterUpdates",
    inputs: [
      {
        name: "referenceIds",
        type: "string[]",
        internalType: "string[]",
      },
      { name: "newValues", type: "bytes[]", internalType: "bytes[]" },
      {
        name: "updateTypes",
        type: "string[]",
        internalType: "string[]",
      },
      { name: "markets", type: "bytes[]", internalType: "bytes[]" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "publishRiskParameterUpdate",
    inputs: [
      { name: "referenceId", type: "string", internalType: "string" },
      { name: "newValue", type: "bytes", internalType: "bytes" },
      { name: "updateType", type: "string", internalType: "string" },
      { name: "market", type: "bytes", internalType: "bytes" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "removeAuthorizedSender",
    inputs: [{ name: "sender", type: "address", internalType: "address" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "renounceOwnership",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "transferOwnership",
    inputs: [{ name: "newOwner", type: "address", internalType: "address" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "updateCounter",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "event",
    name: "OwnershipTransferred",
    inputs: [
      {
        name: "previousOwner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "newOwner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "ParameterUpdated",
    inputs: [
      {
        name: "referenceId",
        type: "string",
        indexed: false,
        internalType: "string",
      },
      {
        name: "newValue",
        type: "bytes",
        indexed: false,
        internalType: "bytes",
      },
      {
        name: "previousValue",
        type: "bytes",
        indexed: false,
        internalType: "bytes",
      },
      {
        name: "timestamp",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "updateType",
        type: "string",
        indexed: true,
        internalType: "string",
      },
      {
        name: "updateId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "market",
        type: "bytes",
        indexed: true,
        internalType: "bytes",
      },
    ],
    anonymous: false,
  },
  {
    type: "error",
    name: "OwnableInvalidOwner",
    inputs: [{ name: "owner", type: "address", internalType: "address" }],
  },
  {
    type: "error",
    name: "OwnableUnauthorizedAccount",
    inputs: [{ name: "account", type: "address", internalType: "address" }],
  },
] as const;

export const LENDING_POOL_CONFIGURATOR_ABI = [
  {
    type: "function",
    name: "setReserveFactor",
    inputs: [
      {
        internalType: "address",
        name: "asset",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "reserveFactor",
        type: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
] as const;
