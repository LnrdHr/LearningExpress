import { Router} from "express";
import usersRouter from "./users.mjs";
import productsRouter from "./products.mjs";
import cartRouter from "./cart.mjs";

//this is like centralised router
//all routers created in routes are registered to this one router
//we are registering this main router in src/index.mjs (our app)
const router = Router();

router.use(usersRouter);
router.use(productsRouter);
router.use(cartRouter);

export default router;

//instead of registering every router in src index.mjs, we do it here.