import { useEffect, useMemo, useState } from "react"
///useMemo: React tool that says "only recalculate this value when its inputs change, otherwise reuse the last result."
import Navbar from "./Navbar"
import Footer from "./Footer"
import { supabase } from "../lib/supabase"
import { getTransactions, type Transaction } from "../lib/transaction"
import { CATEGORIES } from "../lib/categories"
//Pulls in the fixed list of category names ("Groceries", "Dining", etc.) that already existed elsewhere in the app (used by the Add Expense form too). We reuse it here so the category dropdown always matches the categories the rest of the app understands.
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Search,
    Calendar,
    ShoppingCart,
    UtensilsCrossed,
    Car,
    Home,
    Zap,
    Film,
    ShoppingBag,
    HeartPulse,
    TrendingUp,
    CircleDollarSign,
} from "lucide-react"

const CATEGORY_ICONS: Record<string, typeof CircleDollarSign> = {
    Groceries: ShoppingCart,
    Dining: UtensilsCrossed,
    Transportation: Car,
    Housing: Home,
    Entertainment: Film,
    Misc: CircleDollarSign,
}
//rows per page
const PAGE_SIZE = 10
const ALL_CATEGORIES = "All"

export default function History() {
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [status, setStatus] = useState<string>("Loading...")
    const [search, setSearch] = useState<string>("")
    const [category, setCategory] = useState<string>(ALL_CATEGORIES)
    const [dateFrom, setDateFrom] = useState<string>("")
    const [dateTo, setDateTo] = useState<string>("")
    const [page, setPage] = useState<number>(1)

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

    const filtered = useMemo(() => {
        const query = search.trim().toLowerCase()
        return transactions.filter((tx) => {
            const matchesSearch = !query || tx.merchant_name.toLowerCase().includes(query)
            const matchesCategory = category === ALL_CATEGORIES || tx.category === category
            const matchesDateFrom = !dateFrom || tx.date >= dateFrom
            const matchesDateTo = !dateTo || tx.date <= dateTo
            return matchesSearch && matchesCategory && matchesDateFrom && matchesDateTo
        })
    }, [transactions, search, category, dateFrom, dateTo])

//filtered.length / PAGE_SIZE gives a decimal (e.g. 23 results / 10 = 2.3 pages). Math.ceil rounds that up to 3, because a partial page still counts as a page. Math.max(1, ...) makes sure we never show "0 pages" even if the list is empty — there's always at least 1 (empty) page.
    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
    const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
    const rangeStart = filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1
    const rangeEnd = Math.min(page * PAGE_SIZE, filtered.length)

    return (
        <div>
            <Navbar>
                <div className="flex flex-col gap-4 p-4">
                    <div>
                        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                            Financial Ledger
                        </p>
                        <h1 className="font-heading text-2xl font-semibold">Transaction History</h1>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <div className="relative w-full max-w-xs">
                            <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search entries..."
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value)
                                    setPage(1)
                                }}
                                className="pl-8"
                            />
                        </div>
                        <Select
                            value={category}
                            onValueChange={(value) => {
                                setCategory(value ?? ALL_CATEGORIES)
                                setPage(1)
                            }}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={ALL_CATEGORIES}>All Categories</SelectItem>
                                {CATEGORIES.map((c) => (
                                    <SelectItem key={c} value={c}>
                                        {c}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <DropdownMenu>
                            <DropdownMenuTrigger
                                render={
                                    <Button variant="outline" size="sm">
                                        <Calendar className="size-4" />
                                        {dateFrom || dateTo
                                            ? `${dateFrom || "..."} to ${dateTo || "..."}`
                                            : "Date Range"}
                                    </Button>
                                }
                            />
                            <DropdownMenuContent className="w-auto p-3">
                                <div className="flex flex-col gap-2">
                                    <label className="flex flex-col gap-1 text-xs text-muted-foreground">
                                        From
                                        <Input
                                            type="date"
                                            value={dateFrom}
                                            onChange={(e) => {
                                                setDateFrom(e.target.value)
                                                setPage(1)
                                            }}
                                        />
                                    </label>
                                    <label className="flex flex-col gap-1 text-xs text-muted-foreground">
                                        To
                                        <Input
                                            type="date"
                                            value={dateTo}
                                            onChange={(e) => {
                                                setDateTo(e.target.value)
                                                setPage(1)
                                            }}
                                        />
                                    </label>
                                    {(dateFrom || dateTo) && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                                setDateFrom("")
                                                setDateTo("")
                                                setPage(1)
                                            }}
                                        >
                                            Clear
                                        </Button>
                                    )}
                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {status && <p className="text-sm text-muted-foreground">{status}</p>}

                    {pageItems.length > 0 && (
                        <Card size="sm">
                            <CardContent className="p-0">
                                <div className="grid grid-cols-[110px_1fr_140px_110px] gap-2 border-b border-foreground/10 px-4 py-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                                    <span>Date</span>
                                    <span>Description</span>
                                    <span>Category</span>
                                    <span className="text-right">Amount</span>
                                </div>
                                <div className="divide-y divide-foreground/10">
                                    {pageItems.map((tx) => {
                                        const Icon = (tx.category && CATEGORY_ICONS[tx.category]) || CircleDollarSign
                                        return (
                                            <div
                                                key={tx.id}
                                                className="grid grid-cols-[110px_1fr_140px_110px] items-center gap-2 px-4 py-3"
                                            >
                                                <span className="text-sm text-muted-foreground">{tx.date}</span>
                                                <span className="flex items-center gap-2 text-sm">
                                                    <Icon className="size-4 shrink-0 text-muted-foreground" />
                                                    {tx.merchant_name}
                                                </span>
                                                <span>
                                                    {tx.category && (
                                                        <span className="inline-flex rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                                                            {tx.category}
                                                        </span>
                                                    )}
                                                </span>
                                                <span
                                                    className={
                                                        "text-right text-sm font-medium " +
                                                        (tx.amount > 0 ? "text-green-500" : "text-foreground")
                                                    }
                                                >
                                                    {tx.amount > 0 ? "+" : ""}
                                                    ${tx.amount.toFixed(2)}
                                                </span>
                                            </div>
                                        )
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {filtered.length > 0 && (
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <span>
                                Showing {rangeStart}-{rangeEnd} of {filtered.length} entries
                            </span>
                            <div className="flex items-center gap-1">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={page === 1}
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                >
                                    Prev
                                </Button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                    <Button
                                        key={p}
                                        variant={p === page ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setPage(p)}
                                    >
                                        {p}
                                    </Button>
                                ))}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={page === totalPages}
                                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
                <Footer />
            </Navbar>
        </div>
    )
}
