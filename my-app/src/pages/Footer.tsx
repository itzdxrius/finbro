import "./footer.css"
export default function Footer(){
    const currentYear = new Date().getFullYear();
    return(
        <footer>
            <p>&copy; {currentYear} FINBRO. All rights reserved.</p>
        </footer>
    );
}