import express from "express";
import {
	addPreContractDetails,
	deleteProject,
	getAllProjects,
	getSingleProject,
	updateProjectDetails,
	uploadDocs,
} from "../controllers/preContract";
import upload from "../utils/multer";

const router = express.Router();

router.post("/preContract", addPreContractDetails);
router.get("/getAllProjects", getAllProjects);
router.get("/getSingleProject/:projectId", getSingleProject);
router.patch("/updateProject", updateProjectDetails);
router.delete("/deleteProject/:projectId", deleteProject);
router.post("/uploadDocs", upload.any(), uploadDocs);

export default router;
