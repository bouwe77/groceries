import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ThemeToggle } from "./components/theme-toggle"
import {
  isInStock,
  haveToBuy,
  Product,
  ProductForm,
} from "./components/product-form"
import { BigCheckbox } from "./components/big-checkbox"
import React from "react"
import { Switch } from "@/components/ui/switch"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

const productsUrl = "http://localhost:6284/api/products"
const queryKey = ["products"]

const useUpdateProduct = () => {
  const queryClient = useQueryClient()

  const mutationUpdateProduct = useMutation({
    mutationFn: async (product: Product) => {
      const productWithoutId = { ...product }
      delete productWithoutId.id
      const response = await fetch(`${productsUrl}/${product.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productWithoutId),
      })
      return await response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey })
    },
  })

  return mutationUpdateProduct
}

const useDeleteProduct = () => {
  const queryClient = useQueryClient()

  const mutationDeleteProduct = useMutation({
    mutationFn: async (product: Product) => {
      const response = await fetch(`${productsUrl}/${product.id}`, {
        method: "DELETE",
      })
      return await response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey })
    },
  })

  return mutationDeleteProduct
}

const useCreateProduct = () => {
  const queryClient = useQueryClient()

  const mutationCreateProduct = useMutation({
    mutationFn: async (newProduct: Product) => {
      const response = await fetch(productsUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProduct),
      })
      return await response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey })
    },
  })
  return mutationCreateProduct
}

const AddProduct = () => {
  const [open, setOpen] = React.useState(false)
  const mutationCreateProduct = useCreateProduct()

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="w-20 cursor-pointer border-1 border-gray-300 rounded-md p-1 text-center">
        Add
      </DialogTrigger>
      <DialogContent
        className="top-[3%] translate-y-0"
        aria-describedby={undefined}
      >
        <DialogTitle>Add product</DialogTitle>
        <ProductForm
          close={() => setOpen(false)}
          submit={(values) => {
            mutationCreateProduct.mutate(values)
            setOpen(false)
          }}
          defaultValues={{ productName: "", status: "To buy" }}
        />
      </DialogContent>
    </Dialog>
  )
}

const UpdateProduct = ({ product }: { product: Product }) => {
  const [open, setOpen] = React.useState(false)
  const mutationUpdateProduct = useUpdateProduct()
  const mutationDeleteProduct = useDeleteProduct()

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <span onClick={() => setOpen(true)} className="cursor-pointer">
          {product.productName}
        </span>
      </DialogTrigger>
      <DialogContent
        className="top-[3%] translate-y-0"
        aria-describedby={undefined}
      >
        <DialogTitle>Edit product</DialogTitle>
        <ProductForm
          close={() => setOpen(false)}
          submit={(values) => {
            mutationUpdateProduct.mutate(values)
            setOpen(false)
          }}
          defaultValues={product}
          deleteProduct={() => {
            mutationDeleteProduct.mutate(product)
            setOpen(false)
          }}
        />
      </DialogContent>
    </Dialog>
  )
}

const ProductsList = ({ children }: React.PropsWithChildren) => (
  <div className="grid grid-cols-2 gap-2">{children}</div>
)

const Products = ({
  products,
  toggleBuy,
}: {
  products: Product[]
  toggleBuy: (product: Product) => void
}) => {
  const [search, setSearch] = React.useState("")
  const filteredProducts = products.filter((product) =>
    product.productName.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <Input
          placeholder="Search..."
          className="mr-2"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <AddProduct />
      </div>

      <ProductsList>
        {filteredProducts.map((product, i) => (
          <span key={i} className="flex items-center m-1">
            <Switch
              className="mr-2"
              checked={!isInStock(product.status)}
              onCheckedChange={() => toggleBuy(product)}
            />
            <UpdateProduct product={product} />
          </span>
        ))}
      </ProductsList>
    </div>
  )
}

const GroceryList = ({
  products,
  toggleJustBought,
}: {
  products: Product[]
  toggleJustBought: (product: Product) => void
}) => (
  <ProductsList>
    {products.map((product, i) => (
      <span key={i} className="flex items-center m-1">
        <BigCheckbox
          checked={product.status === "Just bought"}
          onCheckedChange={() => toggleJustBought(product)}
        />
        <span
          className={`
            cursor-pointer flex-1 ${
              product.status === "Just bought" ? "line-through" : ""
            }`}
          onClick={() => toggleJustBought(product)}
        >
          {product.productName}
        </span>
      </span>
    ))}
  </ProductsList>
)

const Tab = ({
  value,
  children,
}: {
  value: string
  children: React.ReactNode
}) => (
  <TabsContent value={value} className="p-2">
    {children}
  </TabsContent>
)

const App = () => {
  const {
    isPending,
    error,
    data: products,
  } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await fetch(productsUrl)
      return await response.json()
    },
  })

  const mutationUpdateProduct = useUpdateProduct()

  if (isPending) return "Loading..."

  if (error) return "An error has occurred: " + error.message

  const productsToBuy = products.filter((p) => haveToBuy(p.status))

  const toggleBuy = (product: Product) => {
    mutationUpdateProduct.mutate({
      ...product,
      status: product.status === "In stock" ? "To buy" : "In stock",
    })
  }

  const toggleJustBought = (product: Product) => {
    mutationUpdateProduct.mutate({
      ...product,
      status: product.status === "To buy" ? "Just bought" : "To buy",
    })
  }

  return (
    <div className="m-2">
      <Tabs defaultValue="products">
        <div className="flex items-center">
          <TabsList className="w-full h-12">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="list">
              🛍️ Buy {productsToBuy.length ? `(${productsToBuy.length})` : ""}
            </TabsTrigger>
          </TabsList>
          <div className="m-2">
            <ThemeToggle />
          </div>
        </div>
        <Tab value="products">
          <Products products={products} toggleBuy={toggleBuy} />
        </Tab>
        <Tab value="list">
          <GroceryList
            products={productsToBuy}
            toggleJustBought={toggleJustBought}
          />
        </Tab>
      </Tabs>
    </div>
  )
}

export default App
