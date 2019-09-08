import { collectionOps, authenticateToken } from "../_config";
const db = "users";
const UserOps = new collectionOps(db);

// GET users list api action & response
export async function get(req, res) {
  const { authorization = null } = req.headers;
  if (authorization === mull) return res.status(400).json({ message: 'Invalid headers' })
  try {
    const user = await authenticateToken(authorization.split(' ')[1]);
    const dataList = await UserOps.getList();
    res.status(200).json(dataList);
  } catch (error) {
    if (/Error/g.test(error.name)) return res.status(401).json(error);
    console.log(error);
    res.status(500).json(error);
  }
}

// // POST user list api action & response
// export async function post(req, res) {
//   const { authorization = null } = req.headers;
//   const { body = null } = req;
//   return authorization === null || body === null
//     ? res.status(401).json("Missing header and/or datalist")
//     : authenticateToken(authorization.split(" ")[1], (err, payload, info) =>
//       err
//         ? res.status(500).send(err)
//         : !payload
//           ? res.status(401).json(info.message)
//           : !Array.isArray(body) || body.length === 0
//             ? res.status(400).json("Invalid datalist")
//             : collectionOps.addList(db, body, (error, datalist, info) =>
//               error
//                 ? res.status(500).send(error)
//                 : !datalist
//                   ? res.status(202).json(info.message)
//                   : res.status(201).json(dataList)
//             )
//     );
// }
