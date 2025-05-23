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

const shops = ["Jumbo", "Lidl", "Albert Heijn"] as const

const productSchema = z.object({
  id: z.string().optional(),
  productName: z.string().min(1),
  status: z.enum(["In stock", "To buy", "Just bought"]),
  shops: z.array(z.enum(shops)).optional(),
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
  deleteProduct?: () => void
}

export function ProductForm({
  close,
  submit,
  defaultValues,
  deleteProduct,
}: Props) {
  const form = useForm<Product>({
    resolver: zodResolver(productSchema),
    defaultValues,
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submit)} className="space-y-8">
        <div className="flex items-center justify-between">
          <FormField
            control={form.control}
            name="productName"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Product..." className="w-90" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <>
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md">
                  <FormControl>
                    <BigCheckbox
                      checked={!isInStock(field.value)}
                      onCheckedChange={(checked) =>
                        field.onChange(checked ? "To buy" : "In stock")
                      }
                    />
                  </FormControl>
                  <FormLabel className="mt-2">Buy</FormLabel>
                </FormItem>
              </>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="shops"
          render={({ field }) => (
            <>
              <FormItem>
                <FormLabel className="mt-2">Shops</FormLabel>

                {shops.map((shop) => (
                  <div
                    key={shop}
                    className="flex flex-row items-start space-x-3 space-y-0 rounded-md"
                  >
                    <FormControl>
                      <BigCheckbox
                        checked={field.value?.includes(shop)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            field.onChange([...(field.value ?? []), shop])
                          } else {
                            field.onChange(
                              (field.value ?? []).filter((s) => s !== shop),
                            )
                          }
                        }}
                      />
                    </FormControl>
                    <div className="mt-1">{shop}</div>
                  </div>
                ))}
              </FormItem>
            </>
          )}
        />
        <div className="flex items-center justify-between">
          <div>
            {deleteProduct && (
              <Button
                variant="destructive"
                onClick={() => {
                  deleteProduct()
                }}
              >
                Delete
              </Button>
            )}
          </div>
          <div>
            <Button variant="link" onClick={close}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </div>
      </form>
    </Form>
  )
}
