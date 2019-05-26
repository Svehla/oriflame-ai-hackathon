import {RequestHandler} from "express";

export const browse: RequestHandler = async (req, res) => {
    res.sendFile(__dirname+'/browse.html');
};