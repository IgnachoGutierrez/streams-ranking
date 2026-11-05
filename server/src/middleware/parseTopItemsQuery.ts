import { type NextFunction, type Request, type Response } from 'express';

import { TopItemsQuerySchema } from '../schemas/top.schema.js';

// Rejects with 400 when the query string is invalid; otherwise exposes the
// parsed values (with defaults applied) as res.locals.query. req.query is
// read-only in Express 5, so it can't be overwritten.
export function parseTopItemsQuery(req: Request, res: Response, next: NextFunction) {
    const query = TopItemsQuerySchema.safeParse(req.query);

    if (!query.success) {
        const { issues } = query.error;
        res.status(400).json({ error: 'invalid_query', issues });
        return;
    }

    res.locals.query = query.data;
    next();
}
