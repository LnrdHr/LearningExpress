import passport from "passport";
import { Strategy } from "passport-local";
import { mock_users } from "../utils/constants.mjs";
import { User } from "../mongoose/schemas/user.mjs";
import { comparePassword } from "../utils/helpers.mjs";
//storing user id in session data
passport.serializeUser((user, done) => {
    console.log('Inside Serializer');
    console.log(user);
    done(null, user.id);
});

//used to unpack the id and "reveil" who the user is, and storing user in the request object
//we dont want to pass whole user instead of just id, because thats how we save memory
//also if we change e.g. username, we will have to manually sync database and session data
passport.deserializeUser(async (id, done) => {
    console.log("Inside Deserializer");
    console.log(`Deserializing user id:  ${id}`);
    try{
        //with parameter _id we search mongo's IDs
        const findUser = await User.findOne({_id: id});
        console.log(findUser.id);
        if(!findUser) throw Error("User not found!");
        done(null, findUser);
    }catch(err){
        done(err, null);
    }
});

export default passport.use(
    new Strategy({usernameField: "name"}, async (name,password, done)=>{

        try{
            const findUser = await User.findOne({ name: name });
            if(!findUser) throw new Error("User not found...");

            //comparing plain password and hashed
            if(!comparePassword(password, findUser.password))
                throw new Error("Bad credentials");
            done(null, findUser);
        }catch(err){
            done(err, null);
        }
    })
);