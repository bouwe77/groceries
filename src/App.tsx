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

const AddProduct = () => {
  const [open, setOpen] = React.useState(false)

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
            console.log(values)
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
            console.log(values)
            setOpen(false)
          }}
          defaultValues={product}
          deleteProduct={() => {
            console.log("delete")
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
            <BigCheckbox
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
  const [products, setProducts] = React.useState<Product[]>([
    { productName: "Wortels", status: "To buy" },
    { productName: "Brood", status: "In stock" },
    { productName: "Bananen", status: "Just bought" },
    { productName: "Yoghurt", status: "In stock" },
    { productName: "Fruit", status: "To buy" },
    { productName: "Bier", status: "In stock" },
  ])

  const productsToBuy = products.filter((p) => haveToBuy(p.status))

  const toggleBuy = (product: Product) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.productName === product.productName
          ? { ...p, status: p.status === "In stock" ? "To buy" : "In stock" }
          : p,
      ),
    )
  }

  const toggleJustBought = (product: Product) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.productName === product.productName
          ? {
              ...p,
              status: p.status === "To buy" ? "Just bought" : "To buy",
            }
          : p,
      ),
    )
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
