import { create } from "temba"

const server = create({
  port: 6284,
  staticFolder: "ui",
  resources: ["products"],
  connectionString: "data.json",
})

server.start()
