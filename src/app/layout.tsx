import './globals.css';
import "flatpickr/dist/flatpickr.css";
import { SidebarProvider } from '@/context/SidebarContext';
import {TooltipProvider} from "@/components/ui/tooltip";
import { ThemeProvider } from '@/context/ThemeContext';
import { cn } from "@/lib/utils";
import { Poppins } from 'next/font/google';

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'], 
  variable: '--font-poppins', 
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Memasukkan variable font ke tag html
    <html lang="en" className={cn(poppins.variable)}>
      {/* Menggunakan font-sans agar membaca konfigurasi Tailwind dan menghapus outfit.className */}
      <body className="font-sans antialiased dark:bg-gray-900">
        <ThemeProvider>
          <TooltipProvider>
            <SidebarProvider>{children}</SidebarProvider>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}