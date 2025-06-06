"use client";

import { NearContext } from "@/context/context";
import { BitteWidgetChat } from "@bitte-ai/chat";
import "@bitte-ai/chat/styles.css";
import { Wallet } from "@near-wallet-selector/core";
import { useContext } from "react";
import { BitteAiChat } from "@bitte-ai/chat";

export default function Chat() {
  const { signedInWallet } = useContext(NearContext);
  console.log("Chat component rendered with signedInWallet:", signedInWallet);

  return (
    <div>
      <BitteAiChat
        agentId="bitcoin-agent.xyz"
        historyApiUrl="/api/widget/history"
        apiUrl="api/widget/chat"
        wallet={{ near: { wallet: signedInWallet } }}
      />
    </div>
  );
}
