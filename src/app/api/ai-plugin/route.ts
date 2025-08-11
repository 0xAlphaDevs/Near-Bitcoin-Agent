import { ACCOUNT_ID, PLUGIN_URL } from "@/app/config";
import { NextResponse } from "next/server";

export async function GET() {
  const pluginData = {
    openapi: "3.0.0",
    info: {
      title: "Bitcoin Assistant",
      description: "API for the Bitcoin Agent",
      version: "1.0.0",
    },
    servers: [
      {
        url: "https://bitcoin-agent.xyz",
      },
    ],
    "x-mb": {
      "account-id": ACCOUNT_ID,
      assistant: {
        name: "Bitcoin Assistant",
        description: `An assistant that gives information about the user's BTC wallet address and BTC balance, creates a Bitcoin txn and also helps with deposit and swap for Bitcoin. 
          Supports deposit of assets from any wallet and swapping into BTC enabled by NEAR Intents.`,
        instructions: `You create bitcoin mainnet txns powered by chain signatures and send them on btc mainnet, tell the user's near account id and get their BTC balance. 
          You do not help create native NEAR transactions and only help in creating bitcoin transactions. 
          For bitcoin transactions, first generate a transaction payload using the endpoint /api/tools/create-btc-mpc-txn, 
          then explicitly use the 'generate-transaction' tool to sign received payload using NEAR account. 
          After this txn is signed, use 'api/tools/send-btc-txn' to relay it to BTC mainnet, make sure to provide the 'txHash' (received from signed near txn), 'btcReceiver' address, 'btcAmountInSatoshi' parameters when calling /api/tools/send-btc-txn. 
          If any parameter is not provided, then ask for it explicitly.
          You can also help users deposit assets from any wallet and swap them into BTC, enabled by NEAR Intents. This supports chain-agnostic asset input, seamless settlement via NEAR Intents, and eliminates the need for bridging.`,
        tools: [
          { type: "generate-transaction" },
          { type: "sign-message" },
          { type: "intents" },
        ],
        image:
          "https://pbs.twimg.com/profile_images/1912478540060041216/21DZcXns_400x400.jpg",
        categories: ["Bitcoin", "DeFi"],
      },
    },
    paths: {
      "/api/tools/get-user": {
        get: {
          summary: "get user information",
          description: "Respond with user account ID and BTC address",
          operationId: "get-user",
          responses: {
            "200": {
              description: "Successful response",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      nearAccountId: {
                        type: "string",
                        description: "The user's Near account ID",
                      },
                      btcAddress: {
                        type: "string",
                        description: "The user's BTC address",
                      },
                    },
                  },
                },
              },
            },
            "400": {
              description: "Bad request",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      error: {
                        type: "string",
                        description: "Error message",
                      },
                    },
                  },
                },
              },
            },
            "500": {
              description: "Error response",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      error: {
                        type: "string",
                        description: "Error message",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/api/tools/get-btc-balance": {
        get: {
          operationId: "get-btc-balance",
          summary: "Get BTC balance",
          description: "Respond with BTC address and balance",
          responses: {
            "200": {
              description: "Successful response",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      btcBalance: {
                        type: "string",
                        description: "The current BTC balance of the user",
                      },
                      btcAddress: {
                        type: "string",
                        description: "The user's BTC address",
                      },
                    },
                  },
                },
              },
            },
            "400": {
              description: "Bad request",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      error: {
                        type: "string",
                        description: "Error message",
                      },
                    },
                  },
                },
              },
            },
            "500": {
              description: "Error response",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      error: {
                        type: "string",
                        description: "Error message",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/api/tools/create-btc-mpc-txn": {
        get: {
          operationId: "create-btc-mpc-txn",
          summary:
            "Creates a NEAR txn that utilizes near chain signatures to send transaction on bitcoin mainnet",
          description:
            "Generates a NEAR transaction payload for MPC contract to send bitcoin on bitcoin mainnet. Convert BTC amount to satoshi if required before making this tool call. Received payload from this tool can be used directly in the generate-transaction tool.",
          parameters: [
            {
              name: "btcReceiver",
              in: "query",
              required: true,
              schema: {
                type: "string",
              },
              description: "The Bitcoin mainnet wallet address of receiver",
            },
            {
              name: "btcAmountInSatoshi",
              in: "query",
              required: true,
              schema: {
                type: "string",
              },
              description: "The amount BTC in satoshi to transfer",
            },
          ],
          responses: {
            "200": {
              description: "Successful response",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      transactionPayload: {
                        type: "object",
                        properties: {
                          signerId: {
                            type: "string",
                            description: "The signer's NEAR account ID",
                          },
                          receiverId: {
                            type: "string",
                            description: "The receiver's NEAR account ID",
                          },
                          actions: {
                            type: "array",
                            items: {
                              type: "object",
                              properties: {
                                type: {
                                  type: "string",
                                  description:
                                    "The type of action (e.g., 'Transfer')",
                                },
                                params: {
                                  type: "object",
                                  properties: {
                                    deposit: {
                                      type: "string",
                                      description:
                                        "The amount to transfer in yoctoNEAR",
                                    },
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            "400": {
              description: "Bad request",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      error: {
                        type: "string",
                        description: "Error message",
                      },
                    },
                  },
                },
              },
            },
            "500": {
              description: "Error response",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      error: {
                        type: "string",
                        description: "Error message",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/api/tools/send-btc-txn": {
        get: {
          operationId: "send-btc-txn",
          summary: "Send the signed payload to BTC mainnet",
          description:
            "Send signed transaction to BTC mainnet. The signature is received from the txHash of the signed NEAR transaction. Other parameters are the BTC receiver address, BTC amount in satoshi.",
          parameters: [
            {
              name: "btcReceiver",
              in: "query",
              required: true,
              schema: {
                type: "string",
              },
              description: "The BTC address of the receiver",
            },
            {
              name: "btcAmountInSatoshi",
              in: "query",
              required: true,
              schema: {
                type: "string",
              },
              description: "The amount of BTC to transfer in satoshi",
            },
            {
              name: "txHash",
              in: "query",
              required: true,
              schema: {
                type: "string",
              },
              description: "The txHash of the signed txn from near",
            },
          ],
          responses: {
            "200": {
              description: "Successful response",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      txHash: {
                        type: "string",
                        description:
                          "The txHash of the txn relayed to BTC mainnet",
                      },
                    },
                  },
                },
              },
            },
            "400": {
              description: "Bad request",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      error: {
                        type: "string",
                        description: "Error message",
                      },
                    },
                  },
                },
              },
            },
            "500": {
              description: "Server error",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      error: {
                        type: "string",
                        description: "Error message",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      // TO DO
      "/api/tools/check-supported-token": {
        get: {
          operationId: "check-supported-token",
          summary: "Check supported token for swap to BTC on NEAR",
          description:
            "Checks if asset is supported for swap to BTC through NEAR intents on NEAR blockchain.",
          responses: {
            "200": {
              description: "Successful response",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      depositIntents: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            intentId: {
                              type: "string",
                              description: "Unique ID of the deposit intent",
                            },
                            asset: {
                              type: "string",
                              description: "Asset being deposited",
                            },
                            amount: {
                              type: "string",
                              description: "Amount of asset being deposited",
                            },
                            status: {
                              type: "string",
                              description:
                                "Current status of the deposit intent",
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            "400": {
              description: "Bad request",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      error: {
                        type: "string",
                        description: "Error message",
                      },
                    },
                  },
                },
              },
            },
            "500": {
              description: "Server error",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      error: {
                        type: "string",
                        description: "Error message",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      // TO DO
      "/api/tools/swap-to-bitcoin": {
        get: {
          operationId: "swap-to-bitcoin",
          summary: "Swap assets to Bitcoin",
          description:
            "Swaps any deposited asset to bitcoin using NEAR intents and withdraw to your MPC bitcoin wallet..",
          responses: {
            "200": {
              description: "Successful response",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      depositIntents: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            intentId: {
                              type: "string",
                              description: "Unique ID of the deposit intent",
                            },
                            asset: {
                              type: "string",
                              description: "Asset being deposited",
                            },
                            amount: {
                              type: "string",
                              description: "Amount of asset being deposited",
                            },
                            status: {
                              type: "string",
                              description:
                                "Current status of the deposit intent",
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            "400": {
              description: "Bad request",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      error: {
                        type: "string",
                        description: "Error message",
                      },
                    },
                  },
                },
              },
            },
            "500": {
              description: "Server error",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      error: {
                        type: "string",
                        description: "Error message",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  };

  return NextResponse.json(pluginData);
}
