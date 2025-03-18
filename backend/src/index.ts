import express, { Request, Response } from "express";
import { DataSource } from "typeorm";
import { Product } from "../src/entity/product";
import multer from "multer";
import cors from "cors";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";

const app = express();
dotenv.config();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/"); 
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9); 
      const extension = path.extname(file.originalname); 
      cb(null, file.fieldname + "-" + uniqueSuffix + extension); 
    },
  });
const upload = multer({ storage }); 

app.use(cors());
app.use(express.json());


app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USERNAME, 
  password: process.env.DB_PASSWORD, 
  database: process.env.DB_DATABASE,
  synchronize: true,
  logging: false,
  entities: ["src/entity/**/*.ts"],
  migrations: ["src/migration/**/*.ts"],
  subscribers: ["src/subscriber/**/*.ts"],
});

AppDataSource.initialize()
  .then(() => {
    console.log("Database connected");

    const productRepository = AppDataSource.getRepository(Product);

    // Create a new product
    app.post("/products", upload.array("images"), async (req: Request, res: Response) => {
      const { sku, name, price } = req.body;

      // Check if files were uploaded
      if (!req.files || !Array.isArray(req.files)) {
        res.status(400).json({ message: "No files uploaded" });
        return;
      }

      // Save file paths (relative to the "uploads" folder)
      const images = (req.files as Express.Multer.File[]).map((file) => {
        return `http://localhost:3000/uploads/${file.filename}`; // Save the full URL
      });

      const product = productRepository.create({ sku, name, price, images });
      await productRepository.save(product);
      res.status(201).json(product);
    });

    // Get all products
    app.get("/products", async (req: Request, res: Response) => {
      const products = await productRepository.find();
      res.json(products);
    });

    // Update a product
   // Update a product
app.put("/products/:id", upload.array("images"), async (req: Request, res: Response) => {
    const { id } = req.params;
    const { sku, name, price } = req.body;
  
    const product = await productRepository.findOne({ where: { id: parseInt(id) } });
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
  
    // Delete old images
    product.images.forEach((imageUrl) => {
      const filename = imageUrl.split("/").pop(); // Extract the filename from the URL
      if (filename) { // Ensure filename is not undefined
        const filePath = path.join(__dirname, "../uploads", filename); // Construct the local file path
        fs.unlinkSync(filePath); // Delete the file
      }
    });
  
    // Add new images
    const images = (req.files as Express.Multer.File[]).map((file) => {
      return `http://localhost:3000/uploads/${file.filename}`; // Save the full URL
    });
  
    product.sku = sku;
    product.name = name;
    product.price = price;
    product.images = images;
  
    await productRepository.save(product);
    res.json(product);
  });
  
  // Delete a product
  app.delete("/products/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
  
    const product = await productRepository.findOne({ where: { id: parseInt(id) } });
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
  
    // Delete associated images
    product.images.forEach((imageUrl) => {
      const filename = imageUrl.split("/").pop(); // Extract the filename from the URL
      if (filename) { // Ensure filename is not undefined
        const filePath = path.join(__dirname, "../uploads", filename); // Construct the local file path
        fs.unlinkSync(filePath); // Delete the file
      }
    });
  
    await productRepository.delete(id);
    res.status(204).send();
  });

    // Start the server
    app.listen(3000, () => {
      console.log("Server is running on http://localhost:3000");
    });
  })
  .catch((error) => {
    console.error("Database connection error:", error);
  });