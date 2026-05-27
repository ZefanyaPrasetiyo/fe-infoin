"use client";

import GridShape from "@/components/common/GridShape";
import ThemeTogglerTwo from "@/components/common/ThemeTogglerTwo";
import { ThemeProvider } from "@/context/ThemeContext";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef } from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const animationContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let animationInstance: any = null;

    const loadLottie = async () => {
      const lottie = (await import("lottie-web")).default;

      if (animationContainer.current) {
        animationInstance = lottie.loadAnimation({
          container: animationContainer.current, // Elemen div target
          renderer: "svg",
          loop: true,
          autoplay: true,
          path: "../lottie/LocationSearch.json", 
        });
      }
    };

    loadLottie();

    // 4. Bersihkan animasi saat komponen di-unmount (anti-memory leak)
    return () => {
      if (animationInstance) {
        animationInstance.destroy();
      }
    };
  }, []);

  return (
    <div className="z-1 relative bg-white p-6 sm:p-0 dark:bg-gray-900">
      <ThemeProvider>
        <div className="relative flex h-screen w-full flex-col justify-center sm:p-0 lg:flex-row dark:bg-gray-900">
          {children}
          <div className="bg-emerald-400/60 hidden rounded-l-full h-full w-full items-center lg:grid lg:w-1/2">
            <div className="z-1 relative flex items-center justify-center">
              <div className="flex max-w-xs flex-col items-center">
                
                <div 
                  ref={animationContainer} 
                  style={{ width: "320px", height: "320px" }}
                />
                
                {/* <p className="text-4xl text-center text-white">
                 INI LOGO
                </p> */}
              </div>
            </div>
          </div>
          <div className="fixed bottom-6 right-6 z-50 hidden sm:block">
            <ThemeTogglerTwo />
          </div>
        </div>
      </ThemeProvider>
    </div>
  );
}