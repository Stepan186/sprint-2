import { Request, Response, Router } from "express";
import { blogsCollection, postsCollection, userColletion } from '../db';

export const testingRouter = Router({});

testingRouter.delete("/all-data", async (req: Request, res: Response) => {
  await postsCollection.deleteMany({})
  await blogsCollection.deleteMany({})
  await userColletion.deleteMany({})
  res.sendStatus(204);
});



