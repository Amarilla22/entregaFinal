import express from "express";
import Product from "../models/productModel.js";

const router = express.Router();

router.get("/products", async (req, res) => {
  const { limit = 10, page = 1, sort, query } = req.query;

  let filter = {};
  if (query) {
    const [campo, valor] = query.split("=");
    filter[campo] = valor;
  }

  const result = await Product.paginate(filter, {
    limit: parseInt(limit),
    page: parseInt(page),
    sort: sort === "asc" ? { price: 1 } : sort === "desc" ? { price: -1 } : undefined,
    lean: true
  });

  res.render("productList", {
    products: result.docs,
    hasPrevPage: result.hasPrevPage,
    hasNextPage: result.hasNextPage,
    prevLink: result.hasPrevPage ? `/products?page=${result.prevPage}` : null,
    nextLink: result.hasNextPage ? `/products?page=${result.nextPage}` : null,
    page: result.page,
    totalPages: result.totalPages
  });
});

export default router;