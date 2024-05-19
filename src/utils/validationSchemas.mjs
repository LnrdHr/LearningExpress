export const createUserValidationSchema = {
    name: {
        isLength: {
            options:{
                min:5,
                max:35,
            },
            errorMessage: "Username must be between 3 and 10 characters",
        },
        notEmpty: {
            errorMessage: "Username cannot be empty."
        },
        isString: {
            errorMessage: "Username must be a string."
        },
    },
    password: {
        notEmpty: true,
    },
    /*
    //the following is needed when using filter in our request
    //as the tutorial progresses, we don't want to include filter errors
    //(because we didn't specify any) in our result error array
    filter: {
        isString: true,
        notEmpty: true,
        isLength: {
            options:{
                min:1,
                max:16,
            },
            errorMessage: "Must be between 1 and 16 characters long",
        }
    }
    */
}