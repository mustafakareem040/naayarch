import Dashboard from "@/components/Dashboard";
import { SpeedInsights } from "@vercel/speed-insights/next"

export default function Home() {
    return (
        <>
        <SpeedInsights />
        <Dashboard />
            </>
  );
}
