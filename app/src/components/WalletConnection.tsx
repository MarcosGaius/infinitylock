import { useAccount } from "wagmi";

export const WalletConnection = () => {
  const { isConnected } = useAccount();
  if (isConnected) return null;
  return (
    <div>
      <w3m-button label="Conectar carteira" loadingLabel="Conectando" />
    </div>
  );
};
