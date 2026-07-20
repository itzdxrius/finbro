import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "./dashboard.css";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChartPieInteractive } from "./Piechart";
import { supabase } from "../lib/supabase";
import { saveExpense, getAccountBalance } from "../lib/transaction";
import { CATEGORIES } from "../lib/categories";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export default function Dashboard() {
    const [balance, setBalance] = useState<number>(0);

    useEffect(() => {
        async function loadBalance() {
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (!user) return;

            try {
                const bal = await getAccountBalance(user.id);
                setBalance(bal);
            } catch {
                // no linked account yet, leave balance at 0
            }
        }

        loadBalance();
    }, []);

    const [merchantName, setMerchantName] = useState<string>("");
    const [amount, setAmount] = useState<string>("");
    const [date, setDate] = useState<string>(todayISO());
    const [category, setCategory] = useState<string>(CATEGORIES[0]);
    const [status, setStatus] = useState<string>("");

    async function handleAddExpense() {
        setStatus("");

        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            setStatus("You must be logged in to add an expense.");
            return;
        }

        try {
            await saveExpense(user.id, merchantName, Number(amount), date, category);
            setMerchantName("");
            setAmount("");
            setDate(todayISO());
            setCategory(CATEGORIES[0]);
            setStatus("Expense added.");
        } catch (error) {
            setStatus(error instanceof Error ? error.message : "Failed to add expense.");
        }
    }

    return(
        <div>
            <Navbar>
            <div className="dashboard-content">
            <div className="dashboard-grid">
                <Card className="chart-card">
                    <CardHeader>
                        <CardTitle>
                            Chart Breakdown
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ChartPieInteractive/>
                    </CardContent>
                </Card>

                <div className="summary-column">
                    <Card className="balance-card">
                        <CardHeader>
                            <CardTitle>
                                Balance
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>
                                ${balance.toLocaleString()}
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="ai-summary-card">
                        <CardHeader>
                            <CardTitle>
                                AI Summary
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Button>
                                Generate Summary
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="add-expense-card">
                        <CardHeader>
                            <CardTitle>
                                Add Expense
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <input
                                type="text"
                                placeholder="Merchant"
                                value={merchantName}
                                onChange={(e) => setMerchantName(e.target.value)}
                            />
                            <input
                                type="number"
                                placeholder="Amount"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                            />
                            <input className = "add-expense-date-selector"
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            />
                            <select value={category} onChange={(e) => setCategory(e.target.value)}>
                                {CATEGORIES.map((c) => (
                                    <option key={c} value={c}>
                                        {c}
                                    </option>
                                ))}
                            </select>
                            <Button className = "add-expense-button" onClick={handleAddExpense}>
                                Add Expense
                            </Button>
                            {status && <p>{status}</p>}
                        </CardContent>
                    </Card>
                </div>
            </div>
            </div>
            <Footer/>
            </Navbar>

        </div>
    );
}
