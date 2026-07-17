import { useState } from "react";
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
import { saveExpense } from "../lib/transaction";
import { CATEGORIES } from "../lib/categories";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export default function Dashboard() {
    const balance = 0;

    const [merchantName, setMerchantName] = useState<string>("");
    const [amount, setAmount] = useState<string>("");
    const [date, setDate] = useState<string>(todayISO());
    const [category, setCategory] = useState<string>(CATEGORIES[0]);

    async function handleAddExpense() {
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            console.error("No logged-in user");
            return;
        }

        try {
            await saveExpense(user.id, merchantName, Number(amount), date, category);
            setMerchantName("");
            setAmount("");
            setDate(todayISO());
            setCategory(CATEGORIES[0]);
        } catch (error) {
            console.error(error);
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
                            <input
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
                            <Button onClick={handleAddExpense}>
                                Add Expense
                            </Button>
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
