import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
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
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { updateCategory, deleteCategory, Category } from "@/lib/category"
import { Edit2, Trash2 } from "lucide-react"
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

interface DialogActionCategoryProps {
  category: Category;
}

export default function DialogActionCategory({ category }: DialogActionCategoryProps) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
    nama: category.nama,
    kode_kategori: category.kode_kategori
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const updatePromise = updateCategory(category.id, form).then((res) => {
      setOpen(false)
      setTimeout(() => {
        window.location.reload()
      }, 1000)
      return res
    })

    toast.promise(updatePromise, {
      loading: "Sedang memperbarui kategori...",
      success: "Kategori berhasil diperbarui",
      error: "Gagal memperbarui kategori"
    }, {
      position: "top-right"
    })
  }

  const handleDelete = async () => {
    const deletePromise = deleteCategory(category.id).then((res) => {
      setTimeout(() => {
        window.location.reload()
      }, 1000)
      return res
    })

    toast.promise(deletePromise, {
      loading: "Sedang menghapus kategori...",
      success: "Kategori berhasil dihapus",
      error: "Gagal menghapus kategori"
    }, {
      position: "top-right"
    })
  }

  return (
    <div className="flex items-center justify-center gap-2">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger >
          <Button variant="outline" className="rounded-full p-2 text-gray-400 transition-colors hover:bg-blue-50 hover:text-blue-500 dark:hover:bg-blue-500/10">
            <Edit2 className="w-4 h-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="w-full max-w-sm lg:max-w-md">
          <form onSubmit={handleSubmit} className="space-y-4">
            <DialogHeader>
              <DialogTitle>Edit Kategori</DialogTitle>
              <DialogDescription>
                Edit informasi kategori di bawah ini.
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

      <AlertDialog>
        <AlertDialogTrigger >
          <Button variant="outline" className="rounded-full p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10">
            <Trash2 className="w-4 h-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah kamu yakin ingin menghapus kategori ini?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini akan memindahkan kategori ke dalam kotak sampah.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Tidak</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 text-white hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700">
              Lanjut
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}