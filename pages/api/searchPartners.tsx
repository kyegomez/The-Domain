import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const search = req.query.search as string | undefined;

  let partners;
  const searchTerm = search?.trim();
  if (searchTerm) {
    // partners = await prisma.partners.findMany({
    //   where: {
    //     approved: true,
    //     ...(searchTerm && {
    //       tsv: {
    //         search: searchTerm,
    //       },
    //     }),
    //   },
    //   orderBy: [
    //     { category: "asc" },
    //     { title: "asc" },
    //   ],
    // });
    partners = await prisma.$queryRaw(Prisma.sql`
      SELECT * FROM partners
      WHERE approved = true
      AND to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, '')) @@ plainto_tsquery('english', ${searchTerm})
      ORDER BY category ASC, title ASC
    `);
  } else {
    partners = await prisma.partners.findMany({
      where: {
        approved: true,
      },
      orderBy: [
        { category: "asc" },
        { title: "asc" },
      ],
    });
  }

  res.status(200).json(partners);
}