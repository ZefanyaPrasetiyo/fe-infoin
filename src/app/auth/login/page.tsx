import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Infoin Login Page",
};

export default function SignIn() {
  return <SignInForm />;
}
