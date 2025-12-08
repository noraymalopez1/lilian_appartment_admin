"use client";
import {
  CalendarClock,
  CalendarIcon,
  ChevronRight,
  Car,
  Building2,
  Clock,
} from "lucide-react";
import React, { useState } from "react";
import { parseDate } from "chrono-node";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Search, ChevronDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Filler,
  Tooltip,
} from "chart.js";
import { useDashboardStats } from "@/hooks/useDashboardStats";

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Filler,
  Tooltip
);

const getStatusColor = (status: string) => {
  if (status === "confirmed" || status === "completed") return "text-green-600 bg-green-50";
  if (status === "pending") return "text-yellow-600 bg-yellow-50";
  if (status === "cancelled") return "text-red-600 bg-red-50";
  return "text-gray-600 bg-gray-50";
};

function formatDateDisplay(date: Date | undefined) {
  if (!date) return "";
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function formatTableDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

const Dashboard = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("In 2 days");
  const [date, setDate] = useState<Date | undefined>(parseDate(value) || undefined);
  const [month, setMonth] = useState<Date | undefined>(date);
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);

  const [chartType, setChartType] = useState<"yearly" | "monthly">("yearly");
  const [listingTypeFilter, setListingTypeFilter] = useState<string>("all");
  const [entriesCount, setEntriesCount] = useState<number>(10);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const {
    stats,
    monthlyData,
    recentBookings,
    loading,
    error,
    fetchStats,
    fetchMonthlyData,
    fetchRecentBookings,
  } = useDashboardStats();

  useEffect(() => {
    fetchStats();
    fetchMonthlyData("yearly");
    fetchRecentBookings(10);
  }, [fetchStats, fetchMonthlyData, fetchRecentBookings]);

  useEffect(() => {
    fetchMonthlyData(chartType);
  }, [chartType, fetchMonthlyData]);

  useEffect(() => {
    fetchRecentBookings(entriesCount, listingTypeFilter);
  }, [entriesCount, listingTypeFilter, fetchRecentBookings]);

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    if (!chartRef.current) return;

    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;

    const chartData = monthlyData.length > 0
      ? monthlyData.map((m) => m.count)
      : Array(12).fill(0);

    const labels = monthlyData.length > 0
      ? monthlyData.map((m) => m.month)
      : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Bookings",
            data: chartData,
            borderColor: "#9a4d13",
            backgroundColor: "rgba(154, 77, 19, 0.15)",
            borderWidth: 3,
            pointBackgroundColor: "#9a4d13",
            pointRadius: 5,
            tension: 0.4,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) =>
                ctx.parsed.y !== null ? `${ctx.parsed.y} bookings` : "",
            },
            backgroundColor: "white",
            bodyColor: "black",
            borderColor: "#e5e7eb",
            borderWidth: 1,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (v) => (typeof v === "number" ? v : v),
              color: "#6b7280",
            },
            grid: { color: "#f3f4f6" },
          },
          x: {
            ticks: { color: "#6b7280" },
            grid: { display: false },
          },
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [monthlyData]);

  const filteredBookings = recentBookings.filter((booking) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      booking.first_name?.toLowerCase().includes(query) ||
      booking.last_name?.toLowerCase().includes(query) ||
      booking.email?.toLowerCase().includes(query) ||
      booking.uid?.toLowerCase().includes(query) ||
      booking.listing_type?.toLowerCase().includes(query)
    );
  });

  const statCards = [
    {
      title: "Total Bookings",
      value: loading ? "..." : stats.totalBookings.toLocaleString(),
      icon: <CalendarClock size={24} />,
    },
    {
      title: "Total Taxi Bookings",
      value: loading ? "..." : stats.totalTaxiBookings.toLocaleString(),
      icon: <Car size={24} />,
    },
    {
      title: "Total Listings",
      value: loading ? "..." : stats.totalListings.toLocaleString(),
      icon: <Building2 size={24} />,
    },
    {
      title: "Total Taxis",
      value: loading ? "..." : stats.totalTaxis.toLocaleString(),
      icon: <Car size={24} />,
    },
    {
      title: "Pending Bookings",
      value: loading ? "..." : stats.pendingBookings.toLocaleString(),
      icon: <Clock size={24} />,
    },
    {
      title: "Pending Taxi Bookings",
      value: loading ? "..." : stats.pendingTaxiBookings.toLocaleString(),
      icon: <Clock size={24} />,
    },
  ];

  return (
    <div className="w-full px-2 md:px-0 pt-4 md:pt-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Dashboard</h2>
          <p className="flex items-center gap-2">
            <a href="/">Home</a> <ChevronRight size={16} /> Dashboard{" "}
            <ChevronRight size={16} />
          </p>
        </div>
        <div className="flex items-center">
          <div className="flex flex-col gap-3">
            <div className="relative flex gap-2">
              <Input
                id="date"
                value={value}
                placeholder="Tomorrow or next week"
                className="bg-background pl-10"
                onChange={(e) => {
                  setValue(e.target.value);
                  const date = parseDate(e.target.value);
                  if (date) {
                    setDate(date);
                    setMonth(date);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setOpen(true);
                  }
                }}
              />
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    id="date-picker"
                    variant="ghost"
                    className="absolute top-1/2 left-2 size-6 -translate-y-1/2"
                  >
                    <CalendarIcon className="size-3.5" />
                    <span className="sr-only">Select date</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto overflow-hidden p-0"
                  align="end"
                >
                  <Calendar
                    mode="single"
                    selected={date}
                    captionLayout="dropdown"
                    month={month}
                    onMonthChange={setMonth}
                    onSelect={(date) => {
                      setDate(date);
                      setValue(formatDateDisplay(date));
                      setOpen(false);
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg">
          Error loading data: {error}
        </div>
      )}

      {/* Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="flex items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-center bg-[#FFF6ED] p-3 rounded-lg">
              <div className="text-[#99582A]">{stat.icon}</div>
            </div>
            <div>
              <p className="text-sm text-gray-500">{stat.title}</p>
              <h2 className="text-2xl font-bold text-gray-900">{stat.value}</h2>
            </div>
          </div>
        ))}
      </div>

      {/* Chart and sidebar Section */}
      <div className="flex flex-col lg:flex-row w-full mt-8 gap-6">
        {/* Chart Card */}
        <div className="w-full lg:w-[70%]">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 w-full h-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Booking Analysis</h2>
              <Select
                value={chartType}
                onValueChange={(val) => setChartType(val as "yearly" | "monthly")}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yearly">Yearly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="h-[350px] w-full">
              <canvas ref={chartRef}></canvas>
            </div>
          </div>
        </div>
        {/* Quick Stats Card */}
        <div className="w-full lg:w-[30%]">
          <Card className="rounded-xl shadow-sm border border-gray-100 p-0 overflow-hidden h-full">
            <CardHeader className="pb-2 px-6 pt-6">
              <CardTitle className="text-xl font-bold text-gray-900">
                Quick Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">All Bookings</span>
                  <span className="font-bold text-gray-900">
                    {loading ? "..." : (stats.totalBookings + stats.totalTaxiBookings).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">All Listings</span>
                  <span className="font-bold text-gray-900">
                    {loading ? "..." : stats.totalListings.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Active Taxis</span>
                  <span className="font-bold text-gray-900">
                    {loading ? "..." : stats.totalTaxis.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                  <span className="text-yellow-700">Pending</span>
                  <span className="font-bold text-yellow-700">
                    {loading ? "..." : (stats.pendingBookings + stats.pendingTaxiBookings).toLocaleString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Report Table */}
      <div className="container mx-auto py-6 mt-8">
        <div>
          <h2 className="text-2xl font-medium mb-2">Recent Booking Report</h2>
        </div>
        <hr className="border-gray-200" />

        <Card className="p-6 border-gray-200 shadow-md">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <div className="relative w-full md:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search bookings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-10 rounded-lg border-gray-300 focus-visible:ring-0"
              />
            </div>

            <div className="flex gap-3 flex-wrap justify-end">
              <Select
                value={listingTypeFilter}
                onValueChange={setListingTypeFilter}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Filter Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="apartment">Apartment</SelectItem>
                  <SelectItem value="attraction">Attraction</SelectItem>
                </SelectContent>
              </Select>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="border-gray-300 text-gray-700 h-10 rounded-lg px-4"
                  >
                    Show {entriesCount} <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setEntriesCount(5)}>Show 5 entries</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setEntriesCount(10)}>Show 10 entries</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setEntriesCount(20)}>Show 20 entries</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow className="border-b-gray-200">
                  {[
                    "Booking Date",
                    "Customer",
                    "Booking ID",
                    "Type",
                    "Check-In",
                    "Check-Out",
                    "Total Price",
                    "Status",
                  ].map((header) => (
                    <TableHead
                      key={header}
                      className="text-gray-600 font-medium whitespace-nowrap"
                    >
                      {header}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-gray-500 py-8">
                      No bookings found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBookings.map((booking, index) => (
                    <TableRow
                      key={booking.uid || index}
                      className="border-b-gray-100 hover:bg-gray-50"
                    >
                      <TableCell className="text-gray-800">
                        {formatTableDate(booking.created_at)}
                      </TableCell>
                      <TableCell className="text-gray-800 font-medium">
                        {booking.first_name} {booking.last_name}
                      </TableCell>
                      <TableCell className="text-gray-500 font-mono text-xs">
                        {booking.uid?.slice(0, 8)}...
                      </TableCell>
                      <TableCell className="text-gray-800 capitalize">
                        {booking.listing_type}
                      </TableCell>
                      <TableCell className="text-gray-800">
                        {formatTableDate(booking.check_in)}
                      </TableCell>
                      <TableCell className="text-gray-800">
                        {formatTableDate(booking.check_out)}
                      </TableCell>
                      <TableCell className="text-gray-800 font-medium">
                        ${booking.total_price?.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold capitalize",
                            getStatusColor(booking.status)
                          )}
                        >
                          {booking.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-gray-100 mt-4">
            <p className="text-sm text-gray-500">
              Showing {filteredBookings.length} of {recentBookings.length} entries
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
