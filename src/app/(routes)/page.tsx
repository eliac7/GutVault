import {
  Hero,
  SocialProof,
  Features,
  HowItWorks,
  InstallPWA,
  TechStack,
  Privacy,
  Analytics,
} from "@/sections/home/ui";

export default function Page() {
  return (
    <>
      <Hero />
      <SocialProof />
      <Features />
      <HowItWorks />
      <Privacy />
      <TechStack />
      <Analytics />
      <InstallPWA />
    </>
  );
}
