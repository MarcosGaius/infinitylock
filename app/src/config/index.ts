import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";
import { cookieStorage, createConfig, createStorage, http } from "wagmi";
import { polygon, polygonAmoy } from "wagmi/chains";
import { coinbaseWallet, injected, walletConnect } from "wagmi/connectors";

export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID!;

const metadata = {
  name: "Infinity Lock",
  description: "Infinity Lock allows you to use tokens as keys for locks.",
  url: "localhost:3000",
  icons: ["https://cdn.sonicadigital.com.br/0x2275e8a5e69be437c45a611ec818a2b650cecbea/storage/custom-page/5351/64e4bf700696d.png"],
};

export const config = createConfig({
  chains: [
    // polygonAmoy,
    polygon,
  ],
  transports: {
    // [polygonAmoy.id]: http(),
    [polygon.id]: http(),
  },
  connectors: [
    walletConnect({ projectId, metadata, showQrModal: false }),
    injected({ shimDisconnect: true }),
    coinbaseWallet({
      appName: metadata.name,
      appLogoUrl: metadata.icons[0],
    }),
  ],
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
});
