"use client";

import { Lock } from "@/components/Lock";
import { Page } from "@/components/Page";
import { WalletConnection } from "@/components/WalletConnection";

export default function Home() {
  return (
    <Page>
      <WalletConnection />
      <Lock />
    </Page>
  );
}
