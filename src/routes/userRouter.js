import { Router } from "express";
import Product from "../models/userModel.js";
const router = Router()


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

/*
router.get("/:uid", async (req,res) => {
    const {uid} = req.params
    const users = await userModel.findById({ _id: uid})
    res.json({users})
})
*/

router.post("/", async (req,res) => {
    const { first_name, last_name, email } = req.body
    const newUser = await userModel.create( {first_name,last_name,email} ) 
    res.json({ newUser: newUser })
})


router.put("/:uid", async (req,res) => {
    const {uid} = req.params
    const {body} = req
    const response = await userModel.updateOne({_id: uid}, {$set: { ...body }})
    res.json ({response})
})


router.delete("/:uid", async (req,res) => {
    const { uid } = req.params
    const response = await userModel.findByIdAndDelete(uid)
    res.json(response)
})

export default router 