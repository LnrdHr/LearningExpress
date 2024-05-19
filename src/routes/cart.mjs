import { Router } from "express";

const router = Router();

router.post("/api/cart", (request, response) => {
    if(!request.session.user) return response.status(401);
    const{ body: item } = request;

    const {cart } = request.session;

    if(cart){
        cart.push(item);
    }else{
        request.session.cart = [item];
    }
    return response.status(201).send(item);
})

router.get("/api/cart",(request,response) => {
    if(!request.session.user) return response.status(401);
    //if request.session.cart is not empty, return it.Otherwise return []
    return response.send(request.session.cart ?? []);

})

export default router;