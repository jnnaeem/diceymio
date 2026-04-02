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
import { ShoppingCart, RotateCw, ArrowRight } from "lucide-react";

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
      {stats && (
        <div className="stats-grid">
          <Link href="/dashboard/products" className="stats-card stats-card-blue">
            <div className="stats-card-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m7.5 4.27 9 5.15" />
                <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                <path d="m3.3 7 8.7 5 8.7-5" />
                <path d="M12 22V12" />
              </svg>
            </div>
            <div className="stats-card-content">
              <p className="stats-card-label">Total Products</p>
              <p className="stats-card-value">{stats.totalProducts}</p>
            </div>
          </Link>

          <Link href="/dashboard/orders" className="stats-card stats-card-indigo">
            <div className="stats-card-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="8" cy="21" r="1" />
                <circle cx="19" cy="21" r="1" />
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
              </svg>
            </div>
            <div className="stats-card-content">
              <p className="stats-card-label">Total Orders</p>
              <p className="stats-card-value">{stats.totalOrders}</p>
            </div>
          </Link>

          <Link href="/dashboard/customers" className="stats-card stats-card-emerald">
            <div className="stats-card-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <div className="stats-card-content">
              <p className="stats-card-label">Total Customers</p>
              <p className="stats-card-value">{stats.totalCustomers}</p>
            </div>
          </Link>

          <div className="stats-card stats-card-amber">
            <div className="stats-card-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" x2="12" y1="2" y2="22" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
            <div className="stats-card-content">
              <p className="stats-card-label">Total Revenue</p>
              <p className="stats-card-value">${stats.totalRevenue.toFixed(2)}</p>
            </div>
          </div>
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
