import { useEffect, useState } from "react"
import Navbar from "./Navbar"
import Footer from "./Footer"
import "./history.css"
import { supabase } from "../lib/supabase"
import { getTransactions, type Transaction } from "../lib/transaction"

export default function History() {
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [status, setStatus] = useState<string>("Loading...")

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

    return (
        <div>
            <Navbar>
                <h1>History</h1>
                {status && <p>{status}</p>}
                {transactions.length > 0 && (
                    <div className="history-list">
                        {transactions.map((tx) => (
                            <div key={tx.id} className="history-row">
                                <div className="history-row-main">
                                    <span className="history-merchant">{tx.merchant_name}</span>
                                    <span className="history-date">{tx.date}</span>
                                </div>
                                <div className="history-row-side">
                                    {tx.category && <span className="history-category">{tx.category}</span>}
                                    <span className="history-amount">${tx.amount.toFixed(2)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                <Footer />
            </Navbar>
        </div>
    )
}
