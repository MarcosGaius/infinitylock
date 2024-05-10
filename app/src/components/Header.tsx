import Image from "next/image";
import { useAccount } from "wagmi";

export const Header = () => {
  const { isConnected } = useAccount();

  return (
    <header className="w-full fixed z-30 bg-gray-950">
      <div className="flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto px-2 py-4">
        <div className="flex items-center ">
          <Image src="/infinity-block.png" alt="Logo Infinity Web3" width={80} height={80} />
          <h1>
            <strong>Infinity Lock</strong>
          </h1>
        </div>
        <div>{isConnected && <w3m-account-button />}</div>
      </div>
    </header>
  );
};
