import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { BigCheckbox } from "./big-checkbox"

const productSchema = z.object({
  productName: z.string().min(1),
  status: z.enum(["In stock", "To buy", "Just bought"]),
})

export type Product = z.infer<typeof productSchema>

export const isInStock = (status: Product["status"]) =>
  status === "In stock" ? true : false

export const haveToBuy = (status: Product["status"]) =>
  ["To buy", "Just bought"].includes(status)

type Props = {
  close: () => void
  submit: (values: Product) => void
  defaultValues?: Product
}

export function ProductForm({ close, submit, defaultValues }: Props) {
  const form = useForm<Product>({
    resolver: zodResolver(productSchema),
    defaultValues,
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submit)} className="space-y-8">
        <FormField
          control={form.control}
          name="productName"
          render={({ field }) => (
            <FormItem className="mt-8">
              <FormControl>
                <Input placeholder="Product..." {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <>
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md ">
                <FormControl>
                  <BigCheckbox
                    checked={!isInStock(field.value)}
                    onCheckedChange={(checked) =>
                      field.onChange(checked ? "To buy" : "In stock")
                    }
                  />
                </FormControl>
                <FormLabel className="mt-2">Buy this product</FormLabel>
              </FormItem>
            </>
          )}
        />
        <div className="flex items-center justify-end space-x-2">
          <Button variant="link" onClick={close}>
            Cancel
          </Button>
          <Button type="submit">Save</Button>
        </div>
      </form>
    </Form>
  )
}
