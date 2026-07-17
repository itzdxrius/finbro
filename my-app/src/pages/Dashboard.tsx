import Navbar from "./Navbar";
import Footer from "./Footer";
import "./dashboard.css";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {ChartPieInteractive} from "./Piechart";

export default function Dashboard(){
    const balance = 0;

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
                </div>
            </div>
            </div>
            <Footer/>
            </Navbar>
            
        </div>
    );
}