"use client" // Required for using hooks like useState and useEffect

import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import FinancialPlanner from "@/Components/FinancialPlanner";
import MobileFinancialPlanner from "@/Components/MobileFinancialPlanner"; // Import MobileFinancialPlanner
import SIPCalculator from "@/Components/SIPCalculator";

// Custom hook for media query
const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => {
      setMatches(media.matches);
    };
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
};

export default function Page() {
  const isMobile = useMediaQuery('(max-width: 768px)');

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
            {isMobile ? <MobileFinancialPlanner /> : <FinancialPlanner />}
          </TabsContent>
      </Tabs>
    </div>
  );
}
