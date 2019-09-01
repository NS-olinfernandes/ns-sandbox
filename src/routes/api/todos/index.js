import { collectionOps, authenticateToken } from "../_config";
const db = "todos";

// GET users list api action & response
export async function get(req, res) {
  const { authorization = null } = req.headers;
  authorization === null
    ? res.status(401).json("Invalid header")
    : authenticateToken(authorization.split(" ")[1], (err, payload, info) => {
        err
          ? res.status(500).send(err)
          : !payload
          ? res.status(401).json(info.message)
          : collectionOps.getList(db, (error, data, info) => {
              error
                ? res.status(500).send(err)
                : !data
                ? res.status(202).json(info.message)
                : res.status(200).json(data);
            });
      });
}

// POST user list api action & response
export async function post(req, res) {
  const { authorization = null } = req.headers;
  const { body = null } = req;
  authorization === null || body === null
    ? res.status(401).json("Missing header and/or datalist")
    : authenticateToken(authorization.split(" ")[1], (err, payload, info) =>
        err
          ? res.status(500).send(err)
          : !payload
          ? res.status(401).json(info.message)
          : !Array.isArray(body) || body.length === 0
          ? res.status(400).json("Invalid datalist")
          : collectionOps.addList(db, body, (error, datalist, info) =>
              error
                ? res.status(500).send(err)
                : !datalist
                ? res.status(202).json(info.message)
                : res.status(201).json(dataList)
            )
      );
}
