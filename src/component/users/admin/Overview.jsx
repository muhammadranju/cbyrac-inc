import React, { useEffect } from "react";
// import { Card, CardContent } from "@/components/ui/card"
import { Users } from "lucide-react";
import { Card, CardContent } from "../../ui/Card";
import Chart from "./Chart";
import OverviewTable from "./OverviewTable";

import { useDispatch, useSelector } from "react-redux";
import { fetchUserStatistics } from "../../../redux/feature/overview/userStatisticSlice";
import { fetchUserFilters } from "../../../redux/feature/overview/userFilterSlice";

function DashboardCard({ title, value, change }) {
  return (
    <Card className="bg-white border-0 shadow-lg">
      <CardContent className="p-6 pt-6">
        <div className="flex items-start justify-between mb-4">
          <div className="p-2 bg-slate-100 rounded-lg">
            <Users className="h-5 w-5 text-slate-600" />
          </div>
          <div className="text-green-600 text-sm font-medium">{change}</div>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-slate-600">{title}</p>
          <p className="text-2xl font-bold text-slate-900">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

const Overview = () => {
  const { stats, loading, error } = useSelector(
    (state) => state.userStatistics
  );
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchUserStatistics());
  }, [dispatch]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div>
      <div className="flex space-x-[450px] mb-14 text-white">
        <div className="text-sm">
          <div className="font-bold text-lg mb-2">CBYRAC, INC</div>
          <div>123 MAIN STREET SUITE 100</div>
          <div>ANYTOWN, STATE 12345</div>
          <div>PHONE: 555-555-5555</div>
          <div>EMAIL: info@cbyrac.com</div>
        </div>
        <div className="w-24 h-24 bg-white rounded justify-center">
          <img src="/cbyrac-logo.png" alt="" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((card, index) => (
          <DashboardCard
            key={index}
            title={card.title}
            value={card.value}
            change={card.change}
          />
        ))}
      </div>
      <Chart></Chart>
      <OverviewTable></OverviewTable>
    </div>
  );
};

export default Overview;
