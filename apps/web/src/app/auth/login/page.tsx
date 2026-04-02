import { LoginForm } from "@/components/LoginForm";
import SecondaryHeader from "@/components/SecondaryHeader";

export default function LoginPage() {
  return (
    <main className="min-h-svh pt-24 pb-12 flex justify-center items-center w-full bg-linear-to-b from-white to-[#EDFFFA] dark:from-[#141414] dark:to-[#2b2b2b]">
      <SecondaryHeader />
      <LoginForm />
    </main>
  );
}
