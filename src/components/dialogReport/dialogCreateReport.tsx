import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea" 
import { Label } from "@/components/ui/label"       

interface ReportDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function DialogCreateReport({ isOpen, onOpenChange }: ReportDialogProps){
    return(
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="w-full max-w-3xl mx-auto overflow-y-auto p-6">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-2xl">Buat Laporan Baru</DialogTitle>
            <DialogDescription>
              Isi detail kejadian di bawah ini. Pastikan foto bukti terlihat jelas.
            </DialogDescription>
          </DialogHeader>

          {/* Form Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Kolom Kiri */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2 items-start">
                <Label htmlFor="id_kategori">Kategori Laporan</Label>
                {/* Lu bisa ganti pakai komponen <Select> bawaan Shadcn kalau ada */}
                <select 
                  id="id_kategori" 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="">Pilih Kategori...</option>
                  <option value="1">Jalan Rusak</option>
                  <option value="2">Kecelakaan</option>
                  <option value="3">Fasilitas Publik</option>
                </select>
              </div>

              <div className="flex flex-col gap-2 items-start">
                <Label htmlFor="deskripsi">Deskripsi Laporan</Label>
                <Textarea 
                  id="deskripsi" 
                  placeholder="Ceritakan detail kejadian secara lengkap..." 
                  className="min-h-[120px] resize-none"
                />
              </div>

              <div className="flex flex-col gap-2 items-start">
                <Label htmlFor="bukti_laporan">Bukti Laporan (Foto/Video)</Label>
                <Input 
                  id="bukti_laporan" 
                  type="file" 
                  accept="image/*,video/*"
                  className="cursor-pointer file:cursor-pointer" 
                />
              </div>
            </div>

            {/* Kolom Kanan (Detail Lokasi) */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2 items-start">
                <Label htmlFor="alamat">Alamat Lengkap</Label>
                <Textarea 
                  id="alamat" 
                  placeholder="Masukkan patokan atau alamat lengkap kejadian" 
                  className="min-h-20 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2 items-start">
                  <Label htmlFor="latitude">Latitude</Label>
                  <Input id="latitude" placeholder="Misal: -6.200000" />
                </div>
                <div className="flex flex-col gap-2 items-start">
                  <Label htmlFor="longitude">Longitude</Label>
                  <Input id="longitude" placeholder="Misal: 106.816666" />
                </div>
              </div>

              {/* Tempat buat naro Map Picker nantinya */}
              <div className="h-32 w-full bg-slate-100 dark:bg-slate-800 rounded-md border border-dashed border-slate-300 flex items-center justify-center mt-2">
                <span className="text-sm text-slate-500">Map Picker Area (Opsional)</span>
              </div>
            </div>

          </div>

          {/* Footer Actions */}
          <DialogFooter className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
             <Button variant="outline" onClick={() => onOpenChange(false)}>
               Batal
             </Button>
             <Button type="submit" className="bg-brand-500 hover:bg-brand-600 text-white">
               Kirim Laporan
             </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
}