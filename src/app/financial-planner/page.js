import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import FinancialPlanner from "@/Components/FinancialPlanner";
import SIPCalculator from "@/Components/SIPCalculator";

export default function Page() {
  return (
    <div>
      <Tabs defaultValue="sip-calculator">
        <TabsList className="flex space-x-2 p-2">
          <TabsTrigger value="sip-calculator" className="whitespace-nowrap">
            SIP Calculator
          </TabsTrigger>
          <TabsTrigger value="financial-planner" className="whitespace-nowrap">
            Financial Planner
          </TabsTrigger>
        </TabsList>
          <TabsContent value="sip-calculator">
            <SIPCalculator />
          </TabsContent>
          <TabsContent value="financial-planner">
            <FinancialPlanner />
          </TabsContent>
      </Tabs>
    </div>
  );
}
   
