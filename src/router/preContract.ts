import express from "express";
import {
	addPreContractDetails,
	deleteProject,
	getAllProjects,
	getSingleProject,
	updateProjectDetails,
} from "../controllers/preContract";

const router = express.Router();

router.post("/preContract", addPreContractDetails);
router.get("/getAllProjects", getAllProjects);
router.get("/getSingleProject/:projectId", getSingleProject);
router.patch("/updateProject", updateProjectDetails);
router.delete("/deleteProject/:projectId", deleteProject);

export default router;
