'use client';

import { useState, useEffect } from 'react';
import { NumberTicker } from "@/components/ui/number-ticker";
import Navbar from '@/components/navbar/page';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import CardNav from '@/components/navbar/page'
import { useTheme } from 'next-themes';
import { 
  Camera, MapPin, ShieldCheck, ArrowRight, Activity, Trash2, 
  Zap, AlertTriangle, ClockCheck, Map, Mail 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

 const logo = "Infoin";
const items = [
  {
    label: "About",
    bgColor: "#34D399", 
    textColor: "#fffff", 
    links: [
      { label: "Company", ariaLabel: "About Company" },
      { label: "Careers", ariaLabel: "About Careers" }
    ]
  },
  {
    label: "Projects", 
    bgColor: "#059669", 
    textColor: "#fffff", 
    links: [
      { label: "Featured", ariaLabel: "Featured Projects" },
      { label: "Case Studies", ariaLabel: "Project Case Studies" }
    ]
  },
  {
    label: "Contact",
    bgColor: "#047857", 
    textColor: "#fffff", 
    links: [
      { label: "Email", ariaLabel: "Email us" },
      { label: "Twitter", ariaLabel: "Twitter" },
      { label: "LinkedIn", ariaLabel: "LinkedIn" }
    ]
  }
];

const initialReportsData = [
  {
    id: 1,
    title: 'Jalan Berlubang Parah di Area Pasar',
    location: 'Kec. Cibinong',
    category: 'Infrastruktur',
    time: '10.43.12',
    status: 'SUKSES',
    icon: <MapPin size={20} />,
  },
  {
    id: 2,
    title: 'Lampu Taman Mati Total Sejak Kemarin',
    location: 'Kec. Bojonggede',
    category: 'Fasilitas Umum',
    time: '10.43.09',
    status: 'SUKSES',
    icon: <Zap size={20} />,
  },
  {
    id: 3,
    title: 'Tumpukan Sampah Liar Pinggir Jalan',
    location: 'Kec. Citeureup',
    category: 'Lingkungan',
    time: '10.42.55',
    status: 'SUKSES',
    icon: <Trash2 size={20} />,
  },
  {
    id: 4,
    title: 'Saluran Air Tersumbat Penuh Lumpur',
    location: 'Kec. Babakan Madang',
    category: 'Infrastruktur',
    time: '10.40.10',
    status: 'PENDING',
    icon: <Camera size={20} />,
  },
  {
    id: 5,
    title: 'Pohon Tumbang Menutupi Akses Utama',
    location: 'Kec. Sukaraja',
    category: 'Darurat',
    time: '10.38.45',
    status: 'PENDING',
    icon: <AlertTriangle size={20} />,
  },
];

const kategori = [
  { id: 1, name: 'Kecelakaan' , icon: <Activity size={16} />},
  { id: 2, name: 'Lingkungan' , icon: <Map size={16} />},
  { id: 3, name: 'Alam' , icon: <ShieldCheck size={16} />},
  { id: 4, name: 'Bencana' , icon: <AlertTriangle size={16} />}
];

const backgroundSection = [
  { image: "/images/ilustration/ilustrasi-laporan-1.jpeg" },
  { image: "/images/ilustration/ilustrasi-laporan-2.jpg" },
  { image: "/images/ilustration/ilustrasi-laporan-3.jpg" }
];

export default function LandingPage() {
 const [reports, setReports] = useState(initialReportsData);
  const [bgIndex, setBgIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

 useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prevIndex) => (prevIndex + 1) % backgroundSection.length);

      setReports((prevReports) => {
        const newArray = [...prevReports];
        const firstItem = newArray.shift(); 
        if (firstItem) newArray.push(firstItem);
        return newArray;
      });
    }, 3000); 

    return () => clearInterval(interval);
  }, []);
  

  const visibleReports = reports.slice(0, 4);
  const { resolvedTheme } = useTheme();
  const isDark = mounted && resolvedTheme === 'dark';

  return (
    <div className="relative min-h-screen bg-slate-50 flex flex-col font-sans overflow-x-hidden">     
      
      <div className="absolute inset-0 z-0 h-screen w-full overflow-hidden">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={bgIndex}
            initial={{ opacity: 0, scale: 1.15 }}
            animate={{ opacity: 0.25, scale: 1.0 }} 
            exit={{ opacity: 0 }}
            transition={{ duration: 2.5, ease: "easeInOut" }}
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${backgroundSection[bgIndex].image})` }}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-slate-500/50 to-slate-50 dark:via-slate-950/80 dark:to-slate-950" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
    <CardNav
          logo={logo}
          logoAlt="infoin Logo"
          items={items as any}
          baseColor={isDark ? "#020617" : "#ffffff"}
          menuColor={isDark ? "#ffffff" : "#0f172a"}
          buttonBgColor="#059669"
          buttonTextColor="#ffffff"
          ease="power3.out"
          theme={isDark ? "dark" : "light"}
        />
        <main className="flex flex-col items-center justify-center w-full grow">
          <section id="beranda" className="w-full min-h-screen flex items-center justify-center px-4 pt-24 pb-16">
            <div className="container mx-auto max-w-6xl flex flex-col lg:flex-row gap-12 lg:gap-8 items-center justify-between">
              
              <div className="flex flex-col gap-6 text-center lg:text-left w-full lg:w-1/2"> 
                <h1 className="text-4xl md:text-6xl lg:text-7xl tracking-tight leading-tight text-slate-900">
                  <span className="font-light dark:text-white">Laporkan & jelajahi Masalah</span> <br className="hidden md:block" />
                  <span className="font-semibold text-emerald-600">di Lingkungan</span>
                </h1>
                
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mt-2">
                  {kategori.map((kat) => (
                    <div key={kat.id}>
                      <Badge 
                        variant="destructive"
                        className="text-sm md:text-md font-semibold text-black bg-emerald-600 dark:bg-emerald-600 dark:text-white p-2 flex items-center gap-1.5"
                      >
                        {kat.icon}
                        {kat.name}
                      </Badge>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap justify-center lg:justify-start items-center gap-4 md:gap-8 mt-6">
                  <div className="flex flex-col">
                    <div className="flex items-baseline text-3xl md:text-4xl font-semibold text-emerald-800">
                      <NumberTicker value={15420} className='text-emerald-800' /><span>+</span>
                    </div>
                    <span className="text-slate-500 font-light text-sm mt-1 tracking-wide">Warga Bergabung</span>
                  </div>
                  
                  
                  <div className="flex flex-col">
                    <div className="flex items-baseline text-3xl md:text-4xl font-semibold text-emerald-800">
                      <NumberTicker value={8932} delay={0.2} className='text-emerald-800'/><span>+</span>
                    </div>
                    <span className="text-slate-500 font-light text-sm mt-1 tracking-wide">Laporan Valid</span>
                  </div>
                  
                  
                  <div className="flex flex-col">
                    <div className="flex items-baseline text-3xl md:text-4xl font-semibold text-emerald-800">
                      <NumberTicker value={1232} delay={0.2} className='text-emerald-800'/><span>+</span>
                    </div>
                    <span className="text-slate-500 font-light text-sm mt-1 tracking-wide">Masalah Selesai</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="laporan" className="w-full py-24 px-4 dark:bg-linear-to-t  dark:via-slate-5000/80 dark:to-slate-950 relative">
            <div className="container mx-auto max-w-6xl flex flex-col lg:flex-row gap-16 items-center lg:items-start justify-between">
              
              <div className="flex flex-col w-full lg:w-1/2 gap-6 text-center lg:text-left pt-4">
                <div className="inline-flex items-center justify-center lg:justify-start gap-2 text-emerald-600 font-semibold tracking-wider uppercase text-sm">
                  <ClockCheck size={20} className="animate-pulse" /> Pantauan Live & Faktual   
                </div>
                <h2 className="text-3xl md:text-4xl text-slate-900 leading-snug">
                  <span className="font-light dark:text-white">Update Laporan Secara</span> <br/> 
                  <span className="font-semibold text-emerald-600">Real-Time</span>
                </h2>
                <p className="text-slate-600 font-light text-lg leading-relaxed">
                  Tidak ada <em className="font-semibold text-slate-700">delay</em>, tidak ada rekayasa. Setiap laporan yang diunggah warga langsung tampil detik itu juga. Digabung dengan sistem validasi AI, kami memastikan setiap titik lokasi dan foto kejadian adalah <strong className="font-semibold text-slate-800">100% faktual</strong>, akurat, dan bebas dari hoaks sehingga petugas bisa langsung bertindak.
                </p>
                <div className="mt-4 flex justify-center lg:justify-start">
                  <Button variant="link" className="text-emerald-600 p-0 text-lg flex items-center gap-2 hover:no-underline hover:text-emerald-700 font-semibold">
                    Cek Proses Validasi Kami <ArrowRight size={18} />
                  </Button>
                </div>
              </div>

              <div className="flex flex-col w-full lg:w-1/2 gap-3 relative">
                <AnimatePresence mode="popLayout">
                  {visibleReports.map((report) => (
                    <motion.div
                      layout
                      key={report.id}
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, x: -20, scale: 0.95 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className="w-full"
                    >
                      <Card className="border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 bg-white rounded-2xl">
                        <CardContent className="py-3 flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                            {report.icon}
                          </div>
                          
                          <div className="flex flex-col w-full">
                            <div className="flex justify-between items-start">
                              <h3 className="font-semibold text-slate-900 text-[15px] truncate max-w-[200px] sm:max-w-[300px]">
                                {report.title}
                              </h3>
                              <span className="text-[11px] font-medium text-slate-400 mt-0.5 shrink-0 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                {report.time}
                              </span>
                            </div>
                            
                            <div className="flex justify-between items-end mt-1">
                              <div className="flex items-center gap-2 text-[13px] font-light text-slate-500">
                                <span>{report.category}</span>
                                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                <span>{report.location}</span>
                              </div>
                              
                              <span className={`text-[10px] font-semibold uppercase tracking-wider ${
                                report.status === 'SUKSES' ? 'text-emerald-500' : 'text-orange-500'
                              }`}>
                                {report.status}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

            </div>
          </section>

          <section className="w-full py-16 px-4 bg-emerald-50 border-t border-emerald-100">
            <div className="container mx-auto max-w-4xl flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
              <div className="flex flex-col gap-2">
                <h3 className="text-2xl text-slate-900">
                  <span className="font-light">Siap Membuat Perubahan</span> <span className="font-semibold">Hari Ini?</span>
                </h3>
                <p className="text-slate-600 font-light text-lg">Mulai laporkan masalah di sekitarmu hanya dalam hitungan detik.</p>
              </div>
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 h-14 rounded-xl shrink-0 text-lg font-semibold tracking-wide">
                Daftar & Lapor Sekarang
              </Button>
            </div>
          </section>

        </main>

        <footer className="bg-emerald-700 text-slate-300 py-12 md:py-16 border-t border-slate-800 mt-auto px-4">
          <div className="container mx-auto max-w-7xl">
            <div className="flex flex-col md:flex-row gap-8 md:gap-12 mb-12">
              <div className="w-full md:w-1/2">
                <h2 className="text-3xl text-white mb-4 tracking-tight">
                  <span className="font-semibold">infoin</span><span className="font-light text-emerald-500">.</span>
                </h2>
                <p className="text-slate-400 font-light text-base leading-relaxed max-w-md">
                  Platform pelaporan fasilitas umum dan infrastruktur berbasis AI. Kami hadir untuk menjembatani suara masyarakat dengan pihak berwenang guna mewujudkan lingkungan yang lebih baik, aman, dan tertata secara transparan.
                </p>
              </div>
              
              <div className="w-full md:w-1/4">
                <h3 className="text-white font-semibold mb-5 text-lg">Tautan Navigasi</h3>
                <ul className="flex flex-col gap-3 font-light text-base">
                  <li><a href="#" className="hover:text-emerald-400 transition-colors">Tentang Kami</a></li>
                  <li><a href="#" className="hover:text-emerald-400 transition-colors">Cara Kerja</a></li>
                  <li><a href="#" className="hover:text-emerald-400 transition-colors">Laporan Publik</a></li>
                  <li><a href="#" className="hover:text-emerald-400 transition-colors">Pusat Bantuan</a></li>
                </ul>
              </div>
              
              <div className="w-full md:w-1/4">
                <div className="mt-6 md:mt-0">
                  <h3 className="text-white font-semibold mb-3 text-lg">Hubungi Kami</h3>
                  <a href="mailto:halo@infoin.id" className="flex items-center gap-3 font-light text-base hover:text-emerald-400 transition-colors">
                    <Mail size={18} strokeWidth={1.5} /> halo@infoin.id
                  </a>
                </div>
              </div>
            </div>
            
            <div className="pt-8 border-t border-white flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-light text-slate-500">
              <p>© {new Date().getFullYear()} infoin. Seluruh hak cipta dilindungi.</p>
              <div className="flex gap-6">
                <a href="#" className="hover:text-white transition-colors">Syarat & Ketentuan</a>
                <a href="#" className="hover:text-white transition-colors">Kebijakan Privasi</a>
              </div>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
}