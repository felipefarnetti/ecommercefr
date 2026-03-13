"use client";

import React from "react";
import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatPrice } from "@utils/helper";

interface Props {
  data: {
    day: string;
    sale: number;
  }[];
}

export default function SalesChart({ data }: Props) {
  return (
    <div className="w-full h-[250px] md:h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="saleGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="day"
            tick={{ fontSize: 12, fill: "#64748b" }}
            axisLine={{ stroke: "#e2e8f0" }}
            tickLine={false}
          />
          <YAxis
            tickFormatter={(value) => formatPrice(value)}
            tick={{ fontSize: 11, fill: "#64748b" }}
            axisLine={false}
            tickLine={false}
            width={80}
          />
          <Tooltip
            formatter={(value: number) => [formatPrice(value), "Ventes"]}
            contentStyle={{
              borderRadius: "8px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 4px 6px -1px rgba(0,0,0,.1)",
              fontSize: "13px",
            }}
          />
          <Area
            type="monotone"
            dataKey="sale"
            stroke="#f59e0b"
            strokeWidth={2.5}
            fill="url(#saleGradient)"
            dot={{ fill: "#f59e0b", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: "#d97706" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
