import { Link, useNavigate} from "react-router-dom";
import "./navbar.css"
import {
    DropdownMenu, 
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Navbar(){
    const navigate = useNavigate();
    return(
        <nav className="navbar">
            <DropdownMenu>
                <DropdownMenuTrigger
                    render={
                        <img
                            src = {"/profile-picture.webp"}
                            alt = "Profile Image"
                            className = "profile-icon cursor-pointer"
                        />
                    }
                />
                <DropdownMenuContent align="start">
                    <DropdownMenuGroup>
                        <DropdownMenuItem onClick={() => navigate("/setting")}>Profile</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate("/login")}>Log Out</DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
            <Link className="nav-link" to="/dashboard">Dashboard</Link>
            <Link className="nav-link" to="/budget">Budget</Link>
            <Link className="nav-link" to="/history">History</Link>
        </nav>
    );
}
