"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Loader2 } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import Dropdown from "./shared/Dropdown";
import { toast } from "sonner";
import { loginSetCookie } from "@/app/action";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { OTPInput } from "input-otp";

const schema = z.object({
  phoneNumber: z.string().regex(/^\d{10}$/, "Phone number must be 10 digits"),
  countryCode: z.string().min(1, "Country code is required"),
});

type FormType = z.infer<typeof schema> & {
  otp?: string;
};

export default function LoginPage({ data }: any) {
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const methods = useForm<FormType>({
    defaultValues: {
      phoneNumber: "",
      otp: "",
      countryCode: "",
    },
    resolver: zodResolver(schema),
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const phoneNumber = methods.watch("phoneNumber");
  const countryCode = methods.watch("countryCode");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const countryOptions = data.map((country: any) => ({
    label: `${country.countryName} ${
      country.callingCode ? `(${country.callingCode})` : ""
    }`,
    value: country.callingCode,
  }));

  const fullPhoneNumber = `${countryCode} ${phoneNumber}`;

  const handleSendOtp = (formdata: any) => {
    setIsLoading(true);
    toast.success("OTP sent successfully!");

    setTimeout(() => {
      setIsLoading(false);
      toast.info(`Please check your phone ${fullPhoneNumber} for the OTP.`);
      setStep("otp");
    }, 1000);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(async () => {
      const resp = await loginSetCookie();
      if (!resp.status) {
        toast.error("Failed to login. Please try again.");
        return;
      }
      setIsLoading(false);
      toast.success("OTP verified successfully!");

      router.push("/dashboard");
    }, 1000);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-sm">
        {step === "phone" ? (
          <form onSubmit={methods.handleSubmit(handleSendOtp)}>
            <CardHeader>
              <CardTitle className="text-2xl">Login</CardTitle>
              <CardDescription>
                Enter your phone number to receive a verification code.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 my-4">
              <div className="grid grid-cols-1 space-y-2 w-full">
                <Controller
                  control={methods.control}
                  name="countryCode"
                  render={({ field }) => (
                    <Dropdown
                      {...field}
                      options={countryOptions}
                      placeholder="Select Country Code"
                    />
                  )}
                />
                <Input
                  {...methods.register("phoneNumber")}
                  name="phoneNumber"
                  type="tel"
                  placeholder="Phone number"
                  className="col-span-2"
                  required
                  maxLength={10}
                />
                {methods.formState.errors.phoneNumber && (
                  <p className="text-red-500 text-sm">
                    {methods.formState.errors.phoneNumber.message}
                  </p>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                type="submit"
                disabled={
                  isLoading ||
                  phoneNumber.toString().length < 10 ||
                  !countryCode
                }
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Send OTP
              </Button>
            </CardFooter>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp}>
            <CardHeader>
              <CardTitle className="text-2xl">Enter OTP</CardTitle>
              <CardDescription>
                We've sent a code to <strong>{fullPhoneNumber}</strong>. Please
                enter it below.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center my-2">
              <Controller
                name="otp"
                control={methods.control}
                rules={{ required: "OTP is required" }}
                render={({ field }) => (
                  <OTPInput
                    value={field.value}
                    onChange={field.onChange}
                    maxLength={6}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </OTPInput>
                )}
              />
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Verify & Login
              </Button>
              <Button
                variant="link"
                className="p-0 font-normal"
                type="button"
                onClick={() => {
                  setStep("phone");
                  methods.reset({
                    phoneNumber: "",
                    otp: "",
                    countryCode: "",
                  });
                }}
              >
                Use a different number
              </Button>
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  );
}
