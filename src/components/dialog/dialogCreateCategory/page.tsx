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

export function DialogAddCategory() {
  return (
    <Dialog>
      <form>
        <DialogTrigger>
          <Button variant="outline" className="p-4 rounded-full border-emerald-500 bg-none px-6 font-medium text-gray-900 hover:bg-emerald-600 hover:text-gray-100 dark:border-emerald-400 dark:text-gray-300 dark:hover:bg-emerald-400/20 dark:hover:text-gray-100">
            Tambah Kategori
          </Button>
        </DialogTrigger>
        <DialogContent className="w-full max-w-sm lg:max-w-md ">
          <DialogHeader>
            <DialogTitle>Tambah Kategori</DialogTitle>
            <DialogDescription>
              Isi formulir di bawah ini untuk menambahkan kategori baru.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <Label htmlFor="name-1">Nama Kategori</Label>
              <Input id="name-1" name="name" defaultValue="Pedro Duarte" />
            </Field>
            <Field>
              <Label htmlFor="username-1">Kode Kategori</Label>
              <Input id="username-1" name="username" defaultValue="@peduarte" />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" className="bg-emerald-500 text-gray-100 hover:bg-emerald-600 dark:bg-emerald-400 dark:text-gray-900 dark:hover:bg-emerald-300">
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
