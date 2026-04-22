import Layout from "@/app/components/layout";
import Breakbout from "@/app/components/ui/breakbout";
import DashboardUI from "@/app/components/ui/DashboardUI";
export default function DashboardPage() {
  return (
    <Layout>
      <Breakbout menu="Dashboard" />

      <DashboardUI />
    </Layout>
  );
}