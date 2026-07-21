"use client"

import * as React from "react"
import { Label, Pie, PieChart, Sector } from "recharts"
import type {
  PieSectorShapeProps,
} from "recharts/types/polar/Pie"

import {
  ChartContainer,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CATEGORIES } from "../lib/categories"
import { getTransactions, type Transaction } from "../lib/transaction"
import { useEffect, useMemo, useState } from "react"
import { supabase } from "../lib/supabase"

// Builds the chart's color/label config from CATEGORIES, one entry per
// category, e.g. { Food: { label: "Food", color: "var(--chart-4)" }, ... }.
// Each category gets its own --chart-N CSS variable (defined in index.css)
// so every slice/dropdown swatch has a distinct color.
const chartConfig = CATEGORIES.reduce<ChartConfig>((config, category, index) => {
  config[category] = {
    label: category,
    color: `var(--chart-${index + 1})`,
  }
  return config
}, {}) satisfies ChartConfig

export function ChartPieInteractive() {

   // status shows loading/error/empty messages above the chart
   const [status, setStatus] = useState<string>("Loading...")
   const [transactions, setTransactions] = useState<Transaction[]>([])


  const id = "pie-interactive"
  // which category's slice is currently "active" (selected from the dropdown,
  // or the one being hovered) — drives the highlighted slice + center label
  const [activeCategory, setActiveCategory] = React.useState<string>(CATEGORIES[0])

   // fetch this user's transactions once, on mount
   useEffect(() => {
          async function load() {
              const {
                  data: { user },
              } = await supabase.auth.getUser()

              if (!user) {
                  setStatus("You must be logged in to view your history.")
                  return
              }

              try {
                  const data = await getTransactions(user.id)
                  setTransactions(data)
                  setStatus(data.length === 0 ? "No transactions yet." : "")
              } catch (error) {
                  setStatus(error instanceof Error ? error.message : "Failed to load transactions.")
              }
          }

          load()
      }, [])

  // total spent per category — only counts expenses (positive amounts), ONLY POSITIVE !!!
  // so income/refunds (negative, per Plaid's sign convention) don't throw
  // off the pie chart's slice proportions
  const spendingByCategory = useMemo(() => {
    const totals: Record<string, number> = {}
    for (const tx of transactions) {
      if (!tx.category || tx.amount <= 0) continue
      totals[tx.category] = (totals[tx.category] ?? 0) + tx.amount
    }
    return totals
  }, [transactions])

  // recharts' <Pie> wants one data point per slice: { category, amount, fill }.
  // Every category is always included, even ones with $0 spent, so the
  // dropdown/legend stay complete — a $0 slice just renders with no arc.
  const chartData = useMemo(
    () =>
      CATEGORIES.map((category) => ({
        category,
        amount: spendingByCategory[category] ?? 0,
        fill: `var(--color-${category})`,
      })),
    [spendingByCategory]
  )

  // position (0-8) of the active category within chartData — used to
  // figure out which slice to visually highlight and what to show in the
  // center label
  const activeIndex = React.useMemo(
    () => chartData.findIndex((item) => item.category === activeCategory),
    [chartData, activeCategory]
  )

  // custom slice renderer: the active slice gets drawn slightly bigger plus
  // an extra outer ring, so it visually "pops" compared to the rest — every
  // other slice just renders normally
  const renderPieShape = React.useCallback(
    ({ index, outerRadius = 0, ...props }: PieSectorShapeProps) => {
      if (index === activeIndex) {
        return (
          <g>
            <Sector {...props} outerRadius={outerRadius + 10} />
            <Sector
              {...props}
              outerRadius={outerRadius + 25}
              innerRadius={outerRadius + 12}
            />
          </g>
        )
      }

      return <Sector {...props} outerRadius={outerRadius} />
    },
    [activeIndex]
  )

  return (
    <div data-chart={id} className="flex h-full flex-col">
      {/* loading / error / empty-state message, hidden once data loads fine */}
      {status && <p className="text-sm text-muted-foreground">{status}</p>}
      {/* injects the --color-<category> CSS variables from chartConfig so
          the inline styles below (e.g. backgroundColor: var(--color-Food))
          resolve to real colors */}
      <ChartStyle id={id} config={chartConfig} />

      {/* category picker — selecting one sets activeCategory, which
          highlights that slice and updates the center label */}
      <Select
        value={activeCategory}
        onValueChange = {(value)=> {
        if (value) setActiveCategory(value) }}>
        <SelectTrigger
          className="ml-auto h-7 w-[130px] rounded-lg pl-2.5"
          aria-label="Select a value"
        >
          <SelectValue placeholder="Select category" />
        </SelectTrigger>
        <SelectContent align="end" className="rounded-xl">
          {CATEGORIES.map((key) => {
            const config = chartConfig[key as keyof typeof chartConfig]

            if (!config) {
              return null
            }

            return (
              <SelectItem
                key={key}
                value={key}
                className="rounded-lg [&_span]:flex"
              >
                <div className="flex items-center gap-2 text-xs">
                  {/* small color swatch matching this category's slice color */}
                  <span
                    className="flex h-3 w-3 shrink-0 rounded-xs"
                    style={{
                      backgroundColor: `var(--color-${key})`,
                    }}
                  />
                  {config?.label}
                </div>
              </SelectItem>
            )
          })}
        </SelectContent>
      </Select>

      <ChartContainer
        id={id}
        config={chartConfig}
        className="mx-auto aspect-square w-full max-w-[300px] flex-1"
      >
        <PieChart>
          {/* hovering any slice shows a tooltip with its category + amount —
              this is handled automatically by ChartTooltipContent reading
              chartConfig + the hovered data point, no extra code needed */}
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Pie
            data={chartData}
            dataKey="amount"
            nameKey="category"
            innerRadius={60}
            strokeWidth={5}
            shape={renderPieShape}
          >
            {/* text rendered in the empty center of the donut, showing the
                active category's total spend */}
            <Label
              content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy}
                        className="fill-foreground text-3xl font-bold"
                      >
                        {activeIndex >= 0
                          ? `$${chartData[activeIndex].amount.toLocaleString()}`
                          : "$0"}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 24}
                        className="fill-muted-foreground"
                      >
                        Spent
                      </tspan>
                    </text>
                  )
                }
              }}
            />
          </Pie>
        </PieChart>
      </ChartContainer>
    </div>
  )
}
