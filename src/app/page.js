import Calculator from "@/Components/SIPCalculator";
import SIPCalculator from "@/Components/SIPCalculator";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex  flex-col items-center justify-between">
      <h2>SIP Calculator</h2>
      <Calculator />
    </main>
  );
}
