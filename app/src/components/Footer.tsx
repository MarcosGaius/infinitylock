import Image from "next/image";

export const Footer = () => {
  return (
    <footer className="w-full fixed bottom-0 z-30">
      <div className="flex flex-col gap-2 lg:gap-0 lg:flex-row items-center justify-center max-w-7xl mx-auto px-2 py-4">
        <div className="flex items-center ">
          <Image src="/infinity-block.png" alt="Logo Infinity Web3" width={40} height={40} />
        </div>
        <p className="text-gray-400 font-light text-sm text-center">
          Desenvolvido com ❤️ por{" "}
          <a href="https://infinityweb3.com" target="_blank" rel="noreferrer" className="hover:underline font-light text-gray-300">
            infinityweb3.com
          </a>
        </p>
      </div>
    </footer>
  );
};
