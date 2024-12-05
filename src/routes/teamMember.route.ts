import { Router } from "express"
import { createTeamMember, deleteTeamMember, getProjectTeamMembers, getTeamMemberById, updateTeamMember } from "../controllers/teamMember";

const teamMemberRouter = Router();

teamMemberRouter.get('/:id',getTeamMemberById)
teamMemberRouter.get('/projectTeamMembers/:id',getProjectTeamMembers)
teamMemberRouter.post('/',createTeamMember)
teamMemberRouter.patch('/:id',updateTeamMember)
teamMemberRouter.delete('/:id',deleteTeamMember)

export default teamMemberRouter;