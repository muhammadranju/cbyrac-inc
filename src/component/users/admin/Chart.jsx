import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ChevronDown } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/Card";
import { Button } from "../../ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/DropDownMenu";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserFilters } from "../../../redux/feature/overview/userFilterSlice";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 transition-all duration-200 ease-in-out transform">
        <p className="text-sm font-medium text-gray-900 mb-2">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 mb-1">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-gray-600 capitalize">
              {entry.dataKey}:
            </span>
            <span className="text-sm font-semibold text-gray-900">
              {entry.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const Chart = () => {
  const dispatch = useDispatch();
  const [selectedYear, setSelectedYear] = useState("2025");
  const years = ["2025", "2026", "2027", "2028", "2029", "2030"];

  const { monthlyStats, loading } = useSelector((state) => state.userFilters);

  useEffect(() => {
    dispatch(fetchUserFilters(selectedYear));
  }, [dispatch, selectedYear]);

  // ✅ Use API data (fallback to static data if API empty)
  const chartData =
    monthlyStats && monthlyStats.length > 0
      ? monthlyStats
      : [
          { month: "Jan", intern: 0, temporary: 0 },
          { month: "Feb", intern: 0, temporary: 0 },
          { month: "Mar", intern: 0, temporary: 0 },
          { month: "Apr", intern: 0, temporary: 0 },
          { month: "May", intern: 0, temporary: 0 },
          { month: "Jun", intern: 0, temporary: 0 },
          { month: "Jul", intern: 0, temporary: 0 },
          { month: "Aug", intern: 0, temporary: 0 },
          { month: "Sep", intern: 0, temporary: 0 },
          { month: "Oct", intern: 0, temporary: 0 },
          { month: "Nov", intern: 0, temporary: 0 },
          { month: "Dec", intern: 0, temporary: 0 },
        ];

  return (
    <div className="mt-11">
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardDescription className="text-sm text-muted-foreground">
              Statistics
            </CardDescription>
            <CardTitle className="text-xl font-semibold">
              User Comparison
            </CardTitle>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1 bg-transparent"
              >
                {selectedYear}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-24">
              {years.map((year) => (
                <DropdownMenuItem
                  key={year}
                  onClick={() => setSelectedYear(year)}
                  className="cursor-pointer"
                >
                  {year}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>

        <CardContent>
          {loading ? (
            // ✅ Spinner
            <div className="flex justify-center items-center h-[300px]">
              <div className="relative flex justify-center items-center">
                <div className="w-16 h-16 border-4 border-dashed border-blue-500 rounded-full animate-spin"></div>
                <span className="absolute text-blue-500 font-semibold">
                  Loading
                </span>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-6 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gray-600"></div>
                  <span className="text-sm text-muted-foreground">Intern</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <span className="text-sm text-muted-foreground">
                    Temporary
                  </span>
                </div>
              </div>

              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={chartData}
                    margin={{ top: 5, right: 30, left: 5, bottom: 8 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "#666" }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "#666" }}
                      tickFormatter={(value) => `${value}`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="intern"
                      stroke="#6b7280"
                      strokeWidth={2}
                      dot={{ fill: "#6b7280", strokeWidth: 2, r: 4 }}
                      activeDot={{
                        r: 6,
                        fill: "#6b7280",
                        stroke: "#fff",
                        strokeWidth: 2,
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="temporary"
                      stroke="#eab308"
                      strokeWidth={2}
                      dot={{ fill: "#eab308", strokeWidth: 2, r: 4 }}
                      activeDot={{
                        r: 6,
                        fill: "#eab308",
                        stroke: "#fff",
                        strokeWidth: 2,
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Chart;
