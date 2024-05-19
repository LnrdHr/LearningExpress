import express, { request, response } from "express";
import routes from "./routes/index.mjs";
import cookieParser from "cookie-parser";
import session from "express-session"; //with sessions we can identify users
import { mock_users } from "./utils/constants.mjs";
import passport from "passport";
import "./strategies/local-strategy.mjs";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";


const app = express();

mongoose.connect("mongodb://localhost:27017/express-tutorial")
    .then(() => console.log("Connected to Database"))
    .catch((err) => console.log(`Error: ${err}`));

//registering middleware
app.use(express.json());
app.use(cookieParser());
app.use(
    session({
    secret: "very secret indeed",

    /*
    with saveUnitialised:false, session objects are not going to be stored if they are empty.
    i.e. users are just visiting endpoint, but not doing anything.
    -thats how we save memory
    with resave:true, we update session expiration time, 
    effectively prolonging it with each resave
    */
    saveUninitialized: false,
    resave: true,
    cookie: {
        maxAge: 60000 * 60,
    },
    /*
    storing sessions in Mongo
    (after restarting server, we can still login, because it's saved in mongo, not in memory
    */
    store: MongoStore.create({
        client: mongoose.connection.getClient()
    })

    })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(routes); //registering routes (our main router is in routes file)


//we use local strategy, but we could use e.g. facebook,google to authenticate
app.post("/api/auth",passport.authenticate("local"), 
(request, response) => {
    response.sendStatus(200);
 });

 app.get("/api/auth/status", (request, response) => {
    console.log("Inside /auth/status endpoint");
    console.log(request.user);
    console.log(request.session);

    if(request.user) return response.send(request.user);
    return response.sendStatus(401);
 });

app.post("/api/auth/logout", (request, response) => {
    if(!request.user) return response.sendStatus(401);

    request.logout((err) => {
        if(err) return response.sendStatus(400);
        response.sendStatus(200);
    })
});
 
const PORT = process.env.PORT || 3000; //if enviroment variable for port undefined, assume 3000

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}...` );
});  

app.get("/", (request, response) => {
    console.log(request.session);
    console.log(request.session.id);
    request.session.visited = true;

    //we "authenticate ourselves" by going to '/'
    response.cookie('hello', 'world', {maxAge : 6000*6000}); //must use '' here
    response.status(201).send({msg: "Hi in JSON!"});
});

app.post("/api/auth",(request, response)=>{
    const {
        body: {name, password},
    } = request;
    const findUser = mock_users.find((user) => user.name === name);

    if(!findUser || findUser.password !== password)
         return response.status(401).send("Bad credentials");
    
    request.session.user = findUser;
    return response.status(200).send(findUser);
});

app.get("/api/auth/status",(request, response) => {
    request.sessionStore.get(request.sessionID, (err, session) =>{
        console.log(session);
    })
    return request.session.user
    ? response.status(200).send(request.session.user)
    : response.status(401).send("Not authenticated");
})



