import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import { MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DrawerComment } from "@/components/explore/drawerCommentar";
import ButtonDetailReport from "@/components/explore/buttonDetailReport";
import { ButtonShareReport } from "@/components/explore/buttonShareReport";

const laporanDummy = [
  {
    deskripsi: "kecelakaan lalu lintas di jalan raya",
    lokasi: "Tol Cipularang KM 72",
    kategori: "Lingkungan",
    image: "/images/ilustration/ilustrasi-laporan-1.jpeg",
  },
  {
    deskripsi: "macet parah di jalan tol jasasjajsajsjaisaijsiajsiajsiajs",
    kategori: "Lingkungan",
    lokasi: "Jalan Tol Jakarta - Bandung",
    image: "/images/ilustration/ilustrasi-laporan-2.jpg",
  },
  {
    deskripsi: "longsor di wilayah pegunungan",
    lokasi: "Bogor",
    kategori: "Lingkungan",
    image: "/images/ilustration/ilustrasi-laporan-3.jpg",
  },
];

export default function HomePage() {
  return (
    <div className="mx-auto w-full max-w-7xl">
      <div className="flex items-center justify-center py-2">
        <Carousel
          opts={{
            align: "start",
            watchDrag: true,
            loop: true,
          }}
          orientation="vertical"
          className="w-full max-w-2xl"
        >
          <CarouselContent className="m-0 h-[80vh]">
            {laporanDummy.map((laporan, index) => (
              <CarouselItem key={index} className="h-full p-0">
                <div className="relative mx-auto h-full w-full max-w-sm p-2">
                  <Card className="relative h-full w-full overflow-hidden border-0 bg-gray-200 shadow-lg">
                    <CardContent className="h-full p-0">
                      <div className="relative h-full w-full">
                        <Image
                          src={laporan.image}
                          alt={laporan.deskripsi}
                          fill
                          className="object-contain"
                          priority={index === 0}
                        />
                      </div>

                      <div className="bg-linear-to-t pointer-events-none absolute bottom-0 left-0 right-0 h-1/2 from-black/90 via-black/40 dark:from-white dark:via-white dark:to-transparent" />

                      <div className="absolute bottom-8 left-0 right-0 p-6 text-white">
                        <div className="mb-4 flex flex-row items-center gap-2">
                          <Badge
                            variant="secondary"
                            className="flex items-center gap-2 bg-gray-800 text-xs font-medium text-white"
                          >
                            <MapPin size={16} className="shrink-0" />
                            <span className="">{laporan.lokasi}</span>
                          </Badge>
                          <Badge
                            variant="outline"
                            className="border-emerald-400 text-xs font-medium text-emerald-400"
                          >
                            {laporan.kategori}
                          </Badge>
                        </div>
                        <h3 className="text-medium mb-2 line-clamp-3 font-light capitalize leading-snug text-white dark:text-black">
                          {laporan.deskripsi}
                        </h3>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="absolute bottom-24 right-4 z-20 flex flex-col items-center gap-5 sm:-right-16 sm:bottom-1/2 sm:translate-y-1/2">
                    <div className="flex flex-col items-center drop-shadow-md transition-transform hover:scale-105">
                      <DrawerComment />
                    </div>
                    <div className="flex flex-col items-center drop-shadow-md transition-transform hover:scale-105">
                      <ButtonDetailReport />
                    </div>
                    <div className="flex flex-col items-center drop-shadow-md transition-transform hover:scale-105">
                      <ButtonShareReport />
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <div className="pointer-events-none absolute inset-y-0 left-0 right-0 mx-auto hidden w-full max-w-sm sm:block">
            <CarouselPrevious className="pointer-events-auto -left-16 top-[45%]" />
            <CarouselNext className="pointer-events-auto -left-16 top-[55%] translate-y-0" />
          </div>
        </Carousel>
      </div>
    </div>
  );
}
