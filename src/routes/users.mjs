import {Router} from "express";
import {
    query,
    validationResult,
    checkSchema,
    matchedData,} from "express-validator";
import { mock_users } from "../utils/constants.mjs";
import { createUserValidationSchema } from "../utils/validationSchemas.mjs";
import { resolveIndexById } from "../utils/middlewares.mjs";
import { User } from "../mongoose/schemas/user.mjs";
import { hashPassword } from "../utils/helpers.mjs";

const router = Router();

router.get("/api/users",
    checkSchema(createUserValidationSchema),
    (request, response) => {
   const result = validationResult(request);
   //console.log(result);
   
   if(request.url.includes("?")) console.log("Your request query:", request.query);
   
   //console.log(request.session);

   //destructuring query object from request object
   //after that, destructuring filter and values parameters
   const {query: { filter, value }} = request;

   if(filter && value) return response.send(
       mock_users.filter((user) => user.name.includes(value))
   );

   //if only filter or only value is provided, skip filtering
   return response.send(mock_users);
});

//route parameters
router.get("/api/users/:id",resolveIndexById, (req, res) => {
    const {findUserIndex} = req;
    const findUser = mock_users[findUserIndex];

    if(!findUser) return res.status(404).send("User doesn't exist.");
    return res.send(findUser); 
});

router.post("/api/users",
    checkSchema(createUserValidationSchema),
    async (request, response) => {
        const result = validationResult(request);

        /*
        if errors occured when performing validation,
        show me what fields are invalid or missing.
        note: check utils/validationSchemas.mjs
        */
        if(!result.isEmpty()) return response.status(400).send(result.array());
        
        //matchedData extracts name and password for us
        const data = matchedData(request);
        console.log(data);

        //encrypting password
        data.password = hashPassword(data.password);
        console.log(data);
        const newUser = new User(data);


        //saving user to the database
        /*
        database could throw an error because the user already exists,
        (we specified that only username must be unique)
        so thats why we are wrapping in try/catch block
        */
        try{
            const savedUser = await newUser.save();
            return response.status(201).send(newUser);
        }catch(err){
            console.log(err);
            return response.status(400).send("User already exists");
        }  


    }
);

router.put("/api/users/:id", resolveIndexById, (request, response)=> {
    //destructuring -> https://www.programiz.com/javascript/destructuring-assignment
    const {body, findUserIndex} = request;

    /*
    keeping id the same, but whatever user passed in the body of request
    is going to be used to update the database
    */
    mock_users[findUserIndex] = {id: mock_users[findUserIndex].id, ...body};
    return response.sendStatus(200);
});

//with patch we update a resourse(array here), not making a new one
router.patch("/api/users/:id", resolveIndexById, (request, response) =>{
    const {body, findUserIndex} = request;

    /*
    taking all the fields from this specific user and putting in new object
    then taking key value pairs from request and putting into a new object
     we are essentially overridding
    */
    mock_users[findUserIndex] = {...mock_users[findUserIndex], ...body};
    return response.sendStatus(200);
});

router.delete("/api/users/:id",resolveIndexById, (request,response) => {
    const {findUserIndex } = request;

    mock_users.splice(findUserIndex,1);
    return response.sendStatus(200);
});


export default router;