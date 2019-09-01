import { authenticateToken, documentOps } from "../_config";
const db = "users";

export async function get(req, res) {
  const { authorization = null } = req.headers;
  const { slug = null } = req.params;
  authorization === null || slug === null
    ? res.status(401).json("Invalid header or param")
    : authenticateToken(token, (err, payload, info) => {
        err
          ? res.status(500).json(err)
          : !payload
          ? res.status(401).json(info.message)
          : documentOps.getDoc(db, slug, (error, data, info) =>
              error
                ? res.status(500).json(error)
                : !data
                ? res.status(400).json(info.message)
                : res.status(200).json(data)
            );
      });
}

export async function put(req, res) {
  const { authorization = null } = req.headers;
  const { slug = null } = req.params;
  const { body = null } = req;
  authorization === null || slug === null
    ? res.status(401).json("Invalid header or param")
    : authenticateToken(token, (err, payload, info) => {
        err
          ? res.status(500).json(err)
          : !payload
          ? res.status(401).json(info.message)
          : documentOps.updateDoc(db, slug, body, (error, user, info) =>
              error
                ? res.status(500).json(error)
                : !user
                ? res.status(400).json(info.message)
                : res.status(200).json(user)
            );
      });
}

export async function del(req, res) {
  const { authorization = null } = req.headers;
  const { slug = null } = req.params;
  authorization === null || slug === null
    ? res.status(401).json("Invalid header or param")
    : authenticateToken(authorization.split(" ")[1], (err, payload, info) =>
        err
          ? res.status(500).send(err)
          : !payload
          ? res.status(401).json(info.message)
          : documentOps.deleteDoc(db, slug, (error, data, info) =>
              error
                ? res.status(500).send(error)
                : !data
                ? res.status(401).json(info.message)
                : res.status(200).json(info.message)
            )
      );
}
