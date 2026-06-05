import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { createCategory } from "@/lib/category"
import { toast } from "sonner"

export function DialogAddCategory() {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
    nama: "",
    kode_kategori: ""
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const createPromise = createCategory(form).then((res) => {
      setForm({ nama: "", kode_kategori: "" })
      setOpen(false)
      setTimeout(() => {
        window.location.reload()
      }, 1000)
      return res
    })

   toast.promise(createPromise, {
  loading: "Sedang membuat kategori...",
  success: "Kategori berhasil dibuat",
  error: "Gagal membuat kategori"
}, {
  position: "top-right"
})
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger >
        <Button variant="outline" className="p-4 rounded-full border-emerald-500 bg-none px-6 font-medium text-gray-900 hover:bg-emerald-600 hover:text-gray-100 dark:border-emerald-400 dark:text-gray-300 dark:hover:bg-emerald-400/20 dark:hover:text-gray-100">
          Tambah Kategori
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-sm lg:max-w-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Tambah Kategori</DialogTitle>
            <DialogDescription>
              Isi formulir di bawah ini untuk menambahkan kategori baru.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <Label>Nama Kategori</Label>
              <Input 
                value={form.nama} 
                onChange={(e) => setForm({ ...form, nama: e.target.value })} 
                placeholder="Masukkan nama kategori" 
                required
              />
            </Field>
            <Field>
              <Label>Kode Kategori</Label>
              <Input 
                value={form.kode_kategori} 
                onChange={(e) => setForm({ ...form, kode_kategori: e.target.value })} 
                placeholder="Masukkan kode kategori" 
                required
              />
            </Field>
          </FieldGroup>
          <DialogFooter className="gap-2 pt-2">
            <DialogClose >
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" className="bg-emerald-500 text-gray-100 hover:bg-emerald-600 dark:bg-emerald-400 dark:text-gray-900 dark:hover:bg-emerald-300">
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}