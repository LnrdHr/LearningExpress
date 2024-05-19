import { Router } from "express";
import { mock_products } from "../utils/constants.mjs";

const router = Router();

router.get("/api/products", (request, response) =>{
    console.log(request.headers.cookie);
    console.log(request.cookies);

    if(request.cookies.hello && request.cookies.hello == "world")
        return response.send(mock_products);
    return response.status(403).send({msg: "Sorry you need a correct cookie."});
});


export default router;