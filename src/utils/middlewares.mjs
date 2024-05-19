import { mock_users } from "./constants.mjs";
export const resolveIndexById = (request, response, next) =>{
    const {
        params:{id},
    } = request;
    
    const parsedID = parseInt(id);
    if(isNaN(parsedID)) return response.status(400).send(`ID is not parseable.`);

    const findUserIndex = mock_users.findIndex(
        (user) => user.id === parsedID);

    console.log(`${mock_users[findUserIndex].name}'s index is:`, findUserIndex);

    if(findUserIndex === -1) return response.sendStatus(404); 
    request.findUserIndex = findUserIndex;
    next();
}; 