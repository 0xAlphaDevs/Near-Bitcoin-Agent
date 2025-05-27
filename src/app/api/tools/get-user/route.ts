import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { contracts, chainAdapters } from "signet.js";

const CONTRACT = new contracts.near.ChainSignatureContract({
  networkId: "mainnet",
  contractId: "v1.signer",
});

const btcRpcAdapter = new chainAdapters.btc.BTCRpcAdapters.Mempool(
  "https://mempool.space/api"
);

const bitcoin = new chainAdapters.btc.Bitcoin({
  network: "mainnet",
  contract: CONTRACT,
  btcRpcAdapter,
});

export async function GET(request: Request) {
  const mbMetadataHeader = (await headers()).get("mb-metadata");
  const mbMetadata: { accountId: string } =
    mbMetadataHeader && JSON.parse(mbMetadataHeader);

  const { accountId } = mbMetadata || {};

  const { address } = await bitcoin.deriveAddressAndPublicKey(
    accountId as string,
    "bitcoin-1"
  );

  const btcAddress = address;

  if (!accountId) {
    return NextResponse.json(
      {
        error: "Unable to find user data in the request",
      },
      {
        status: 500,
      }
    );
  }

  return NextResponse.json(
    { nearAccountId: accountId, btcAddress: btcAddress },
    { status: 200 }
  );
}
