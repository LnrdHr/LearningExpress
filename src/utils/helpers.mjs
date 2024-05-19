import bcrypt from "bcrypt";

//how much time is needed to calculate the encrypt
const saltRounds = 10;

export const hashPassword = (password) =>{
    const salt = bcrypt.genSaltSync(saltRounds);
    console.log(salt);
    return bcrypt.hashSync(password, salt);
}

export const comparePassword = (plain, hashed) => {
    return bcrypt.compareSync(plain, hashed);
}