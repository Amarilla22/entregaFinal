import express from "express";
import Product from "../models/productModel.js";

const router = express.Router();

router.get('/products', async (req, res) => {
  const { limit = 10, page = 1, sort, query, carritoId } = req.query;

  let filter = {};
  if (query) {
    const [campo, valor] = query.split('=');
    filter[campo] = valor;
  }

  const options = {
    limit: parseInt(limit),
    page: parseInt(page),
    sort: sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : undefined,
    lean: true
  };

  const result = await Product.paginate(filter, options);

  // Construir links con carritoId incluido
  const buildLink = (p) =>
    `/products?limit=${limit}&page=${p}${sort ? `&sort=${sort}` : ''}${query ? `&query=${query}` : ''}${carritoId ? `&carritoId=${carritoId}` : ''}`;

  res.render("productList", {
    products: result.docs,
    hasPrevPage: result.hasPrevPage,
    hasNextPage: result.hasNextPage,
    prevLink: result.hasPrevPage ? buildLink(result.prevPage) : null,
    nextLink: result.hasNextPage ? buildLink(result.nextPage) : null,
    page: result.page,
    totalPages: result.totalPages,
    carritoId // ← esto es clave
  });
});

router.get("/products/:pid", async (req, res) => {
  const { pid } = req.params;

  try {
    const product = await Product.findById(pid).lean();
    if (!product) return res.status(404).send("Producto no encontrado");

    res.render("productDetail", { product });
  } catch (err) {
    res.status(500).send("Error interno del servidor");
  }
});

router.get("/carts/:cid", async (req, res) => {
  const { cid } = req.params;

  try {
    const cart = await Cart.findById(cid)
      .populate("productos.product")
      .lean();

    if (!cart) return res.status(404).send("Carrito no encontrado");

    res.render("cart", { cart });
  } catch (err) {
    res.status(500).send("Error interno del servidor");
  }
});

export default router;