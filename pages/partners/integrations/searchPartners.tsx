import type { NextApiRequest, NextApiResponse } from "next";
import {prisma} from '@/lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const search = req.query.search as string | undefined;


    let partners;
    const searchTerm = search?.trim();
    if (searchTerm) {
        partners = await prisma.partners.findMany({
            where: {
                approved: true,
                ...(searchTerm && {
                    tsv: {
                        search: searchTerm,
                    },
                }),
            },
            orderBy: [
                { category: 'asc'},
                { title: 'asc'},
            ],
        });
    } else {
        partners = await prisma.partners.findMany({
            where: {
                approved: true,
            },
            orderBy: [
                { category: 'asc'},
                { title: 'asc'},
            ],
        });

        res.status(200).json(partners)
    }
}

