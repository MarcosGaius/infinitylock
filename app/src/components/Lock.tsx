"use client";

import abi from "@/config/abi.json";
import { address } from "@/config/contract";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useAccount, useReadContract } from "wagmi";
import { BigNumber } from "ethers";
import { publishMessage } from "@/services";

export const Lock = () => {
  const params = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [unlocking, setUnlocking] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState(false);
  const hasUnlocked = params.get("c") === "1";
  const { address: userAddress, isConnected, isDisconnected } = useAccount();

  const { data, isLoading } = useReadContract({
    abi,
    address: address as `0x${string}`,
    functionName: "balanceOf",
    args: [userAddress],
    account: userAddress as `0x${string}`,
  });
  const quantity = data ? BigNumber.from(data ?? 0).toNumber() : null;

  const setQueryParam = useCallback(
    (value: string) => {
      const current = new URLSearchParams(Array.from(params.entries()));
      current.set("c", value);
      const search = current.toString();
      const query = search ? `?${search}` : "";
      router.push(`${pathname}${query}`);
    },
    [params, pathname, router]
  );

  const handleUnlock = useCallback(async () => {
    try {
      setUnlocking(true);
      await publishMessage();
    } catch (error) {
      console.log(error);
      setError(true);
    } finally {
      setUnlocking(false);
      setUnlocked(true);
      setTimeout(() => setUnlocked(false), 5000);
      if (hasUnlocked) return;
      // We set the query param in case the user unlocked one time. To prevent repeatedly unlocking when reloading.
      setQueryParam("1");
    }
  }, [hasUnlocked, setQueryParam]);

  useEffect(() => {
    if (hasUnlocked || !quantity || !isConnected) return;
    handleUnlock();
  }, [handleUnlock, hasUnlocked, quantity, isConnected]);

  useEffect(() => {
    if (!isDisconnected) return;
    setQueryParam("0");
  }, [isDisconnected, setQueryParam]);

  if (!isConnected) return null;

  if (error) return <section>Algo deu errado. Tente novamente mais tarde.</section>;

  if (isLoading)
    return (
      <section>
        <h1>Verificando seu acesso...</h1>
      </section>
    );

  if (unlocking) return <section>Estamos liberando seu acesso 🙂</section>;

  return (
    <section className="flex flex-col items-center gap-2">
      {!quantity && <h1>Acesso negado.</h1>}
      {quantity && quantity > 0 && unlocked && <h1>Tranca liberada! #goinfinity</h1>}
      {quantity && hasUnlocked && (
        <button onClick={handleUnlock} className="px-5 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 duration-300">
          Destrancar
        </button>
      )}
    </section>
  );
};
