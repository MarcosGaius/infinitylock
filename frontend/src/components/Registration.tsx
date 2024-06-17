"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useAccount } from "wagmi";
import Webcam from "react-webcam";
import z from "zod";
import { signUpApi } from "@/services/auth";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const schema = z.object({
  firstName: z.string().min(1, "Required field"),
  lastName: z.string().min(1, "Required field"),
  email: z.string().email("Email inválido").min(1, "Required field"),
  password: z.string().min(6, "Mininum six characters"),
});

type RegistrationSchema = z.infer<typeof schema>;

const videoConstraints: MediaTrackConstraints = {
  // width: 1280,
  // height: 720,
  // aspectRatio: { ideal: 1 },
  facingMode: "user",
};

export default function Registration() {
  const router = useRouter();
  const webcamRef = useRef<Webcam>(null);
  const [image, setImage] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const { isConnected, address } = useAccount();

  const {
    formState: { errors, isValid },
    getValues,
    trigger,
    register,
  } = useForm<RegistrationSchema>({
    mode: "onBlur",
    resolver: zodResolver(schema),
  });

  const handleNext = async () => {
    if (step === 1) {
      const isValid = await trigger(["firstName", "lastName", "email", "password"]);
      if (!isValid) return;
      setStep(2);
    }
    if (step === 2 && isConnected) setStep(3);
    if (step === 3) onSubmit();
  };

  const handleBack = () => setStep(step - 1);

  const handleCapture = async () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (!imageSrc) return;
    setImage(imageSrc);
  };

  const onSubmit = async () => {
    if (!address || !image) return;
    const form = getValues();
    const data = { ...form, face: image.split(",")[1], address: address.toString() };
    try {
      await signUpApi(data);
      router.push("/");
    } catch (error) {
      console.log(error);
      alert("Erro ao registrar. Tente novamente");
    }
  };

  const FirstStep = () => (
    <div className="grid grid-cols-2 gap-4">
      <div className="col-span-1 space-y-2">
        <Label htmlFor="firstName">First Name</Label>
        <Input id="firstName" placeholder="John" required {...register("firstName")} error={!!errors.firstName} />
        {errors.firstName && <p className="text-sm text-red-500">{errors.firstName?.message}</p>}
      </div>
      <div className="col-span-1 space-y-2">
        <Label htmlFor="lastName">Last Name</Label>
        <Input id="lastName" placeholder="Doe" required {...register("lastName")} error={!!errors.lastName} />
        {errors.lastName && <p className="text-sm text-red-500">{errors.lastName?.message}</p>}
      </div>
      <div className="col-span-2 space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input id="email" placeholder="john@doe.com" required {...register("email")} error={!!errors.email} />
        {errors.email && <p className="text-sm text-red-500">{errors.email?.message}</p>}
      </div>
      <div className="col-span-2 space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" placeholder="*******" type="password" required {...register("password")} error={!!errors.password} />
        {errors.password && <p className="text-sm text-red-500">{errors.password?.message}</p>}
      </div>
    </div>
  );

  const SecondStep = () => (
    <div className="mx-auto space-y-2">
      <p>Connect with your wallet to continue. We only need your address :)</p>
      <w3m-button label="Conectar carteira" loadingLabel="Conectando" />
    </div>
  );

  const ThirdStep = () => (
    <div style={{ textAlign: "center" }}>
      {image ? (
        <div className="space-y-4">
          <p>Is your face centralized and clear?</p>
          <img src={image} alt="captured" />
          <div className="space-x-4">
            <Button variant="outline" onClick={() => setImage(null)} disabled={loading} className={cn(loading && "animate-pulse")}>
              New photo
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="w-fit h-fit">
            <Webcam
              audio={false}
              placeholder="Loading..."
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
            />
          </div>
          <Button onClick={handleCapture} disabled={loading} className={cn(loading && "animate-pulse")}>
            Capture photo
          </Button>
        </div>
      )}
    </div>
  );
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Welcome!</h1>
        <p className="text-zinc-500 dark:text-zinc-400">Let&apos;s get some basic information to get started 🍻</p>
      </div>
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Step {step}</h2>
        {step === 1 && <FirstStep />}
        {step === 2 && <SecondStep />}
        {step === 3 && <ThirdStep />}
        <div className="space-x-2">
          {step > 1 && (
            <Button variant="secondary" onClick={handleBack} disabled={loading} className={cn(loading && "animate-pulse")}>
              Previous
            </Button>
          )}
          <Button variant="outline" onClick={handleNext} disabled={loading} className={cn(loading && "animate-pulse")}>
            {step === 3 ? "Finish" : "Next"}
          </Button>
        </div>
      </div>
    </div>
  );
}
