"use client";
import {
  CalendarClock,
  CalendarIcon,
  ChevronRight,
  ScrollText,
} from "lucide-react";
import React from "react";
import { parseDate } from "chrono-node";
import { Label } from "@radix-ui/react-label";
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
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { cn } from "@/lib/utils"; // Assumed utility for conditional classes

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

// C. Data Table Component (from image 2)
const bookingData = [
  {
    date: "2022-01-05",
    type: "Suite",
    id: "GKLMDC",
    checkIn: "2022-01-05",
    checkOut: "2022-01-05",
    refundable: "Yes",
    tariff: "$1200",
    payment: "Card",
    status: "Paid",
  },
  {
    date: "2022-01-05",
    type: "Royal Suite",
    id: "GKLMDC",
    checkIn: "2022-01-05",
    checkOut: "2022-01-05",
    refundable: "No",
    tariff: "$1200",
    payment: "Card",
    status: "Unpaid",
  },
  {
    date: "2022-01-05",
    type: "Deluxe",
    id: "GKLMDC",
    checkIn: "2022-01-05",
    checkOut: "2022-01-05",
    refundable: "Yes",
    tariff: "$1200",
    payment: "Cash",
    status: "Paid",
  },
  {
    date: "2022-01-05",
    type: "Luxury",
    id: "GKLMDC",
    checkIn: "2022-01-05",
    checkOut: "2022-01-05",
    refundable: "No",
    tariff: "$1200",
    payment: "Card",
    status: "Unpaid",
  },
  {
    date: "2022-01-05",
    type: "Deluxe",
    id: "GKLMDC",
    checkIn: "2022-01-05",
    checkOut: "2022-01-05",
    refundable: "Yes",
    tariff: "$1200",
    payment: "Card",
    status: "Paid",
  },
  {
    date: "2022-01-05",
    type: "Deluxe",
    id: "GKLMDC",
    checkIn: "2022-01-05",
    checkOut: "2022-01-05",
    refundable: "No",
    tariff: "$1200",
    payment: "Card",
    status: "Unpaid",
  },
  {
    date: "2022-01-05",
    type: "Deluxe",
    id: "GKLMDC",
    checkIn: "2022-01-05",
    checkOut: "2022-01-05",
    refundable: "Yes",
    tariff: "$1200",
    payment: "Card",
    status: "Paid",
  },
  {
    date: "2022-01-05",
    type: "Deluxe",
    id: "GKLMDC",
    checkIn: "2022-01-05",
    checkOut: "2022-01-05",
    refundable: "No",
    tariff: "$1200",
    payment: "Card",
    status: "Unpaid",
  },
  {
    date: "2022-01-05",
    type: "Deluxe",
    id: "GKLMDC",
    checkIn: "2022-01-05",
    checkOut: "2022-01-05",
    refundable: "Yes",
    tariff: "$1200",
    payment: "Card",
    status: "Paid",
  },
];

const getStatusColor = (status: string) => {
  if (status === "Paid") return "text-green-600 bg-green-50";
  if (status === "Unpaid") return "text-red-600 bg-red-50";
  return "text-gray-600 bg-gray-50";
};

const getRefundableColor = (refundable: string) => {
  if (refundable === "Yes") return "text-green-600 font-medium";
  if (refundable === "No") return "text-red-600 font-medium";
  return "text-gray-900";
};

function formatDate(date: Date | undefined) {
  if (!date) {
    return "";
  }
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

const page = () => {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("In 2 days");
  const [date, setDate] = React.useState<Date | undefined>(
    parseDate(value) || undefined
  );
  const [month, setMonth] = React.useState<Date | undefined>(date);
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    if (!chartRef.current) return;

    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;

    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
        datasets: [
          {
            label: "Bookings",
            data: [
              4200, 6000, 5900, 4800, 5000, 4900, 3500, 2200, 2600, 4300, 3900,
              4100,
            ],
            borderColor: "#9a4d13",
            backgroundColor: "rgba(154, 77, 19, 0.15)",
            borderWidth: 3,
            pointBackgroundColor: "#9a4d13",
            pointRadius: 5,
            tension: 0.4,
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) =>
                ctx.parsed.y !== null ? `$${ctx.parsed.y.toLocaleString()}` : "",
            },
            backgroundColor: "white",
            bodyColor: "black",
            borderColor: "#e5e7eb",
            borderWidth: 1,
          },
        },
        scales: {
          y: {
            beginAtZero: false,
            ticks: {
              callback: (v) => {
                if (typeof v === "number") {
                  return `${v / 1000}k`;
                }
                return v;
              },
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
  }, []);
  return (
    <div className="w-full px-2 md:px-0 pt-4 md:pt-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">All Reports</h2>
          <p className="flex items-center gap-2">
            <a href="/">Miscellaneous</a> <ChevronRight size={16} /> Reports{" "}
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
                      setValue(formatDate(date));
                      setOpen(false);
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
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
                      setValue(formatDate(date));
                      setOpen(false);
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      </div>
      {/* stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          {
            title: "Total Bookings",
            value: "1,234",
            icon: <CalendarClock size={24} />,
          },
          {
            title: "Total Listings",
            value: "1,234",
            icon: <ScrollText size={24} />,
          },
          {
            title: "Pending Requests",
            value: "1,234",
            icon: <CalendarClock size={24} />,
          },
        ].map((stat, index) => (
          <div
            key={index}
            className="flex items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-center bg-[#FFF6ED] p-3 rounded-lg">
              <div className="text-[#99582A]">
                {stat.icon}
              </div>
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
        {/* Card One (70%) */}
        <div className="w-full lg:w-[70%]">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Booking Analysis</h2>
              <select className="border rounded-md px-3 py-1 text-sm bg-transparent outline-none focus:ring-2 focus:ring-orange-500/20">
                <option>Yearly</option>
                <option>Monthly</option>
              </select>
            </div>
            <div className="relative h-[300px] w-full">
              <canvas ref={chartRef}></canvas>
            </div>
          </div>
        </div>
        {/* Card Two (30%) */}
        <div className="w-full lg:w-[30%]">
          <Card className="rounded-xl shadow-sm border border-gray-100 p-0 overflow-hidden h-full">
            {" "}
            {/* Adjusted padding for a tighter look */}
            <CardHeader className="pb-2 px-6 pt-6">
              {" "}
              {/* Adjusted padding for header */}
              <CardTitle className="text-xl font-bold text-gray-900">
                Top Booking Source
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {" "}
              {/* Remove padding from card content */}
              <div className="max-h-[300px] overflow-y-auto">
                {" "}
                {/* Max height with scrollbar */}
                <Table>
                  <TableHeader className="sticky top-0 bg-white z-10 border-b border-gray-100">
                    <TableRow className="hover:bg-transparent">
                      {" "}
                      {/* Prevent hover effect on header */}
                      <TableHead className="text-gray-500 font-medium text-sm px-6 py-3">
                        Source Name
                      </TableHead>
                      <TableHead className="text-gray-500 font-medium text-sm text-right px-6 py-3">
                        Booking No
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { sourceName: "Booking.com", bookingNo: 987 },
                      { sourceName: "Lillians apartment", bookingNo: 987 },
                      { sourceName: "Booking.com", bookingNo: 987 },
                      { sourceName: "Hotka", bookingNo: 987 },
                      { sourceName: "Gozayan", bookingNo: 987 },
                      { sourceName: "Trip Plus", bookingNo: 987 },
                      { sourceName: "Booking.com", bookingNo: 987 },
                      // Add more data as needed to show scrollbar
                      { sourceName: "Airbnb", bookingNo: 720 },
                      { sourceName: "Expedia", bookingNo: 610 },
                      { sourceName: "Direct", bookingNo: 550 },
                      { sourceName: "Trivago", bookingNo: 480 },
                    ].map((item, index) => (
                      <TableRow
                        key={index}
                        className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50"
                      >
                        <TableCell className="font-medium text-gray-800 px-6 py-3">
                          {item.sourceName}
                        </TableCell>
                        <TableCell className="text-right text-gray-800 font-medium px-6 py-3">
                          {item.bookingNo}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Report Table */}
      <div className="container mx-auto py-6 mt-8">
        <div>
          <h2 className="text-2xl font-medium mb-2">
            Apartment Booking Report
          </h2>
        </div>
        {/* --- Horizontal Line --- */}
        <hr className="border-gray-200" />

        {/* Data Table Section (Image 2) */}
        <Card className="p-6 border-gray-200 shadow-md">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            {/* Search Input */}
            <div className="relative w-full md:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search"
                className="pl-9 h-10 rounded-lg border-gray-300 focus-visible:ring-0"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 flex-wrap justify-end">
              <Button
                variant="outline"
                className="border-gray-300 text-gray-700 h-10 rounded-lg px-4"
              >
                Download <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
              </Button>
              <Button
                variant="outline"
                className="border-gray-300 text-gray-700 h-10 rounded-lg px-4"
              >
                Show <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
              </Button>
              <Button
                variant="outline"
                className="border-gray-300 text-gray-700 h-10 rounded-lg px-4"
              >
                Columns <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
              </Button>
              <Button
                variant="outline"
                className="border-gray-300 text-gray-700 h-10 rounded-lg px-4"
              >
                Filter
              </Button>
              <Button
                variant="outline"
                className="border-gray-300 text-gray-700 h-10 rounded-lg px-4"
              >
                View
              </Button>
              <Button className="bg-orange-500 hover:bg-orange-600 text-white h-10 rounded-lg px-4">
                All Bookings <ChevronDown className="ml-2 h-4 w-4 opacity-70" />
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow className="border-b-gray-200">
                  {[
                    "Booking Date",
                    "Booking Type",
                    "Booking ID",
                    "Check-In Date",
                    "Check-Out Date",
                    "Refundable",
                    "Booking Tariff",
                    "Payment Method",
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
                {bookingData.map((booking, index) => (
                  <TableRow
                    key={index}
                    className="border-b-gray-100 hover:bg-gray-50"
                  >
                    <TableCell className="text-gray-800">
                      {booking.date}
                    </TableCell>
                    <TableCell className="text-gray-800 font-medium">
                      {booking.type}
                    </TableCell>
                    <TableCell className="text-gray-500">
                      {booking.id}
                    </TableCell>
                    <TableCell className="text-gray-800">
                      {booking.checkIn}
                    </TableCell>
                    <TableCell className="text-gray-800">
                      {booking.checkOut}
                    </TableCell>
                    <TableCell
                      className={getRefundableColor(booking.refundable)}
                    >
                      {booking.refundable}
                    </TableCell>
                    <TableCell className="text-gray-800">
                      {booking.tariff}
                    </TableCell>
                    <TableCell className="text-gray-800">
                      {booking.payment}
                    </TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
                          getStatusColor(booking.status)
                        )}
                      >
                        {booking.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-100 mt-4">
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="h-9 px-4 rounded-lg border-gray-300 text-gray-500"
                disabled
              >
                ← Previous
              </Button>
              <Button className="h-9 px-4 rounded-lg bg-green-500 hover:bg-green-600 text-white font-medium">
                1
              </Button>
              <Button
                variant="outline"
                className="h-9 px-4 rounded-lg border-gray-300 text-gray-500"
              >
                2
              </Button>
              <Button
                variant="outline"
                className="h-9 px-4 rounded-lg border-gray-300 text-gray-500"
              >
                3
              </Button>
              <Button
                variant="outline"
                className="h-9 px-4 rounded-lg border-gray-300 text-gray-500"
              >
                Next →
              </Button>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="h-9 px-4 rounded-lg border-gray-300 text-gray-500"
                >
                  Show 10 entries{" "}
                  <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Show 5 entries</DropdownMenuItem>
                <DropdownMenuItem>Show 10 entries</DropdownMenuItem>
                <DropdownMenuItem>Show 20 entries</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default page;
