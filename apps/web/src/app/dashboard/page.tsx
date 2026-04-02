"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { adminUserAPI, adminOrderAPI } from "@/lib/adminServices";
import { Order } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatusBadge } from "@/components/dashboard/shared/StatusBadge";
import { ShoppingCart, ArrowRight, TrendingUp, Globe, Users, Wallet,} from "lucide-react";
import { StatsCard } from "@/components/admin/StatsCard";

type Stats = {
  totalProducts: number;
  totalOrders: number;
  totalCustomers: number;
  totalRevenue: number;
};

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [statsData, ordersData] = await Promise.all([
        adminUserAPI.getStats(),
        adminOrderAPI.getAll(),
      ]);
      setStats(statsData);
      setRecentOrders(ordersData.slice(0, 10));
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };



  if (loading) {
    return (
      <div className="admin-page-loading">
        <div className="admin-loading-spinner" />
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Overview of your store performance</p>
        </div>
        <button onClick={loadData} className="btn btn-outline btn-icon" title="Refresh">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
            <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
            <path d="M16 16h5v5" />
          </svg>
        </button>
      </div>

      {/* Stats Cards */}
      {!stats ? (
        <div className="rounded-lg border bg-muted/50 p-6 text-center">
          <p className="text-muted-foreground">No sales data available</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Products"
            value={stats.totalProducts}
            icon={Globe}
            to="/dashboard/products"
          />
          <StatsCard
            title="Total Orders"
            value={stats.totalOrders}
            icon={TrendingUp}
            to="/dashboard/orders"
          />
          <StatsCard
            title="Total Customers"
            value={stats.totalCustomers}
            icon={Users}
            to="/dashboard/customers"
          />
          <StatsCard
            title="Total Revenue"
            value={stats.totalRevenue.toFixed(2)}
            icon={Wallet}
          />
        </div>
      )}

      {/* Recent Orders Table */}
      <Card className="border card-border shadow-lg shadow-[#2E2D740D] rounded-[10px] overflow-hidden bg-card mt-8">
        <CardHeader className="flex flex-row items-center justify-between bg-[#FAFAFB] dark:bg-[#191B1F] sm:px-6 px-4 py-4 border-b border-default">
          <div className="space-y-1">
            <CardTitle className="text-xl font-bold">Recent Orders</CardTitle>
            <CardDescription className="text-sm">Latest 10 orders placed</CardDescription>
          </div>
          <Button asChild variant="outline" size="sm" className="hidden sm:flex h-9 shadow-sm hover:bg-slate-50">
            <Link href="/dashboard/orders">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {recentOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
              <ShoppingCart className="h-10 w-10 mb-4 opacity-50 text-slate-400" />
              <p>No orders yet</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order #</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order: any) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-semibold">{order.orderNumber}</TableCell>
                    <TableCell>
                      {order.user?.firstName
                        ? `${order.user.firstName} ${order.user.lastName || ""}`
                        : order.user?.email || order.userId}
                    </TableCell>
                    <TableCell className="font-medium">${Number(order.totalAmount).toFixed(2)}</TableCell>
                    <TableCell>
                      <StatusBadge status={order.status} />
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      
      {/* Mobile view all link */}
      <div className="sm:hidden mt-4 text-center">
        <Button asChild variant="outline" className="w-full">
          <Link href="/dashboard/orders">
            View All Orders
          </Link>
        </Button>
      </div>
    </div>
  );
}
