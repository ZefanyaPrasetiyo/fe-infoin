import Main from "./page"
import ThemeTogglerTwo from "@/components/common/ThemeTogglerTwo";
import { ThemeProvider } from "@/context/ThemeContext";

export default function Layout(){
    return(
        <ThemeProvider>

        <Main/>
        <div className="fixed bottom-6 right-6 z-50 hidden sm:block">
                   <ThemeTogglerTwo />
                 </div>
        </ThemeProvider>
    )
}