import {RequestHandler} from "express";

export const carousel: RequestHandler = async (req, res) => {
    res.sendFile(__dirname+'/carousel.html');
};