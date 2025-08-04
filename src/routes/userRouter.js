import { Router } from "express";
import Product from "../models/productModel.js";
import Cart from "../models/cartModel.js"

const router = Router()


//Ver prod
router.get('/', async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;

    // Filtro dinámico
    let filter = {};
    if (query) {
      // Por ejemplo: ?query=category=monitores o ?query=status=true
      const [campo, valor] = query.split('=');
      filter[campo] = valor;
    }

    // Opciones para paginate
    const options = {
      limit: parseInt(limit),
      page: parseInt(page),
      sort: sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : undefined,
      lean: true
    };

    const result = await Product.paginate(filter, options);

    // Construir links para paginación
    const buildLink = (p) => `/api/products?limit=${limit}&page=${p}${sort ? `&sort=${sort}` : ''}${query ? `&query=${query}` : ''}`;

    res.json({
      status: 'success',
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage ? buildLink(result.prevPage) : null,
      nextLink: result.hasNextPage ? buildLink(result.nextPage) : null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
  }
});


//Carrito

//Borro un producto
router.delete('/carts/:cid/products/:pid', async (req, res) => {
  const { cid, pid } = req.params;
  try {
    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });

    cart.productos = cart.productos.filter(p => p.product.toString() !== pid);
    await cart.save();

    res.json({ status: 'success', message: 'Producto eliminado del carrito' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

//Cargo un objeto de productos
router.put('/carts/:cid', async (req, res) => {
  const { cid } = req.params;
  const { productos } = req.body;

  try {
    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });

    cart.productos = productos;
    await cart.save();

    res.json({ status: 'success', message: 'Carrito actualizado' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

//Cargo un producto
router.put('/carts/:cid/products/:pid', async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;

  try {
    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });

    const item = cart.productos.find(p => p.product.toString() === pid);
    if (!item) return res.status(404).json({ error: 'Producto no encontrado en el carrito' });

    item.quantity = quantity;
    await cart.save();

    res.json({ status: 'success', message: 'Cantidad actualizada' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

//Vacio el carrito
router.delete('/api/carts/:cid', async (req, res) => {
  const { cid } = req.params;

  try {
    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });

    cart.productos = [];
    await cart.save();

    res.json({ status: 'success', message: 'Carrito vaciado' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

//Traigo el carrito
router.get('/api/carts/:cid', async (req, res) => {
  const { cid } = req.params;

  try {
    const cart = await Cart.findById(cid).populate('productos.product');
    if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });

    res.json({ status: 'success', carrito: cart });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

export default router 