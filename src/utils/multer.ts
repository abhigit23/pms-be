import * as fs from "node:fs";
import type { Request } from "express";
import multer from "multer";
import BadRequestError from "../errors/badRequest";

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		const folderPath = `uploads/${file.fieldname}`;
		if (!fs.existsSync(folderPath)) {
			fs.mkdirSync(folderPath, { recursive: true });
		}
		cb(null, folderPath);
	},
	filename: (req, file, cb) => {
		cb(null, `${file.fieldname}-${Date.now()}-${file.originalname}`);
	},
});

const fileFilter = (req: Request, file: any, cb: any) => {
	if (
		[
			"application/pdf",
			"application/msword",
			"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
		].includes(file.mimetype)
	) {
		return cb(null, true);
	}
	return cb(new BadRequestError("Only pdf, doc/docx files are allowed."));
};

const upload = multer({
	storage,
	fileFilter,
	limits: { fileSize: 5 * 1024 * 1024 },
});

export default upload;
