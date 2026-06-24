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
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { deleteUser, User } from "@/lib/user"
import { Edit2, Trash2 } from "lucide-react"
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Category } from "@/lib/category"

interface DialogActionUserProps {
  user: User;
}

export default function DialogActionUser({ user }: DialogActionUserProps) {
  const [open, setOpen] = useState(false)

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault()

//     const updatePromise = updateLocation(location.id, form).then((res) => {
//       setOpen(false)
//       setTimeout(() => {
//         window.location.reload()
//       }, 1000)
//       return res
//     })

//     toast.promise(updatePromise, {
//       loading: "Sedang memperbarui wilayah...",
//       success: "Wilayah berhasil diperbarui",
//       error: "Gagal memperbarui wilayah"
//     }, {
//       position: "top-right"
//     })
//   }

  const handleDelete = async () => {
    const deletePromise = deleteUser(user.id).then((res) => {
      setTimeout(() => {
        window.location.reload()
      }, 1000)
      return res
    })

    toast.promise(deletePromise, {
      loading: "Sedang menghapus pengguna...",
      success: "Pengguna berhasil dihapus",
      error: "Gagal menghapus pengguna"
    }, {
      position: "top-right"
    })
  }

  return (
    <div className="flex items-center justify-center gap-2">
      <AlertDialog>
        <AlertDialogTrigger >
          <Button variant="outline" className="rounded-full p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10">
            <Trash2 className="w-4 h-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah kamu yakin ingin menghapus pengguna ini?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini akan memindahkan pengguna ke dalam kotak sampah.
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