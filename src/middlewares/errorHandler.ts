import type { NextFunction, Request, Response } from "express";

interface ErrorPayload {
	statusCode: number;
	message: string;
}

const errorHandlerMiddleware = (
	err: ErrorPayload,
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const customError = {
		statusCode: err.statusCode || 500,
		msg: err.message || "Something went wrong please try again later",
	};

	return res.status(customError.statusCode).json({ msg: customError.msg });
};

export default errorHandlerMiddleware;
