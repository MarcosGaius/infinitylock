import Image from "next/image";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section className="p-4 space-y-4">
      <div className="flex items-center justify-center">
        <Image src="/infinity-block.png" alt="Logo" width={100} height={100} />
        <span>
          <p>Beer Tap</p>
          <small>by Infinity Web3</small>
        </span>
      </div>
      {children}
    </section>
  );
}
