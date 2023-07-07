import type { NextApiRequest, NextApiResponse } from "next";
import index from "algolia/config";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { term } = req.query;

  index
    .search(term as string)
    .then(({ hits }) => res.status(200).json(hits))
    .catch((err) => res.status(500).json(err));
}
