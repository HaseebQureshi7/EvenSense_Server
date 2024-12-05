import { Router } from "express"
import { createLink, deleteLink, getLinksByType, getProjectLinks, updateLink } from "../controllers/link";

const linkRouter = Router()

linkRouter.get("/:id", getProjectLinks)
linkRouter.get("/linkType/:id", getLinksByType)
linkRouter.post("/", createLink)
linkRouter.patch("/:id", updateLink)
linkRouter.delete("/:id", deleteLink)

export default linkRouter;