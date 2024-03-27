import type { Request, Response } from "express";
import BadRequestError from "../errors/badRequest";
import { ProjectDetails } from "../models/Details";
import { ProjectSanction } from "../models/Sanction";
import { ProjectWorkOrder } from "../models/WorkOrder";

export const addWorkInProgress = async (req: Request, res: Response) => {
	const {
		// projectId,
		workOrderNumber,
		workOrderDate,
		tendorCost,
		projectFileNumber,
		projectFileDate,
		projectTitle,
		projectWorkType,
		projectStatus,
		scheduledStartDate,
		scheduledEndDate,
	} = req.body;

	if (
		!tendorCost ||
		!projectWorkType ||
		!scheduledStartDate ||
		!scheduledEndDate
	) {
		throw new BadRequestError("Please fill all the mandatory details!");
	}

	let rightFilled = true;

	if (!workOrderDate && !workOrderNumber) rightFilled = true;
	if (workOrderDate && workOrderNumber) rightFilled = true;
	if (workOrderDate && !workOrderNumber) {
		rightFilled = false;
		throw new BadRequestError(
			"Either fill both (Work Order Date and Number) fields or leave them empty",
		);
	}
	if (!workOrderDate && workOrderNumber) {
		rightFilled = false;
		throw new BadRequestError(
			"Either fill both (Work Order Date and Number) fields or leave them empty",
		);
	}

	if (!projectFileDate && !projectFileNumber) rightFilled = true;
	if (projectFileDate && projectFileNumber) rightFilled = true;
	if (projectFileDate && !projectFileNumber) {
		rightFilled = false;
		throw new BadRequestError(
			"Either fill both (Scheduled Start and End Date) fields or leave them empty",
		);
	}
	if (!projectFileDate && projectFileNumber) {
		rightFilled = false;
		throw new BadRequestError(
			"Either fill both (Scheduled Start and End Date) fields or leave them empty",
		);
	}

	if (!scheduledStartDate && !scheduledEndDate) rightFilled = true;
	if (scheduledStartDate && scheduledEndDate) rightFilled = true;
	if (scheduledStartDate && !scheduledEndDate) {
		rightFilled = false;
		throw new BadRequestError(
			"Either fill both (Scheduled Start and End Date) fields or leave them empty",
		);
	}
	if (!scheduledStartDate && scheduledEndDate) {
		rightFilled = false;
		throw new BadRequestError(
			"Either fill both (Scheduled Start and End Date) fields or leave them empty",
		);
	}

	if (!rightFilled)
		throw new BadRequestError("Please fill the fields correctly!");

	if (scheduledStartDate === scheduledEndDate) {
		throw new BadRequestError(
			"Scheduled start date should not be same as scheduled end date!",
		);
	}

	// if (projectId) {
	// 	const prevWorkOrder = await ProjectWorkOrder.findOne({
	// 		where: { project_id: projectId },
	// 	});

	// 	const details = await ProjectDetails.findAll({
	// 		where: {
	// 			project_id: projectId,
	// 		},
	// 	});

	// 	if (details.length === 0) {
	// 		throw new BadRequestError(
	// 			`No project found with projectId: ${projectId}`,
	// 		);
	// 	}

	// 	const sanction: any = await ProjectSanction.findOne({
	// 		where: { project_id: projectId },
	// 	});

	// 	if (tendorCost > sanction.sanctionAmount) {
	// 		throw new BadRequestError(
	// 			"Tendor cost should not be greater than Sanction Amount",
	// 		);
	// 	}

	// 	await ProjectDetails.update(
	// 		{ projectStatus, projectWorkType },
	// 		{
	// 			where: {
	// 				project_id: projectId,
	// 			},
	// 		},
	// 	);

	// 	const workOrder = await ProjectWorkOrder.create({
	// 		project_id: projectId,
	// 		workOrderNumber,
	// 		workOrderDate,
	// 		tendorCost,
	// 		projectFileNumber,
	// 		projectFileDate,
	// 		scheduledStartDate,
	// 		scheduledEndDate,
	// 	});

	// 	const projectDetails = await ProjectDetails.findAll({
	// 		where: {
	// 			project_id: projectId,
	// 		},
	// 	});

	// 	res
	// 		.status(201)
	// 		.json({ projectDetails, workOrder, msg: "Project Added Successfully!" });
	// }
	// else {
	const details: any = await ProjectDetails.create({
		projectTitle,
		projectStatus,
	});
	const workOrder = await ProjectWorkOrder.create({
		project_id: details.project_id,
		workOrderNumber,
		workOrderDate,
		tendorCost,
		projectWorkType,
		projectFileNumber,
		projectFileDate,
		scheduledStartDate,
		scheduledEndDate,
	});

	res
		.status(201)
		.json({ details, workOrder, msg: "Project Added Successfully!" })
		.end();
	// }
};
