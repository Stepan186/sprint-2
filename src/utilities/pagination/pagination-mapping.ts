import { paginationType } from '../../repositories/blogs/blogs-query-repository';
import { Request } from 'express';

export async function paginationMapping (req: Request): Promise<paginationType> {
  return {
    pageNumber: req.query.pageNumber ? Number(req.query.pageNumber) : 1,
    pageSize: req.query.pageSize ? Number(req.query.pageSize) : 10
  }
}

