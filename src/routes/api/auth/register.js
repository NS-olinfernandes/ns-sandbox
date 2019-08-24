import { User } from '../_config';

// Register new User - POST api response
export async function post(req, res) {
    const { user } = req.body;
    const newUser = new User({
        name: {
            firstName: user.firstName,
            lastName: user.lastName
        },
        email: user.email,
        password: user.password
    });
    try {
        const response = await newUser.save();
        response.token = '';
        res.writeHead(200, {
            'Content-Type': 'application/json'
        })
        return res.end(JSON.stringify(response))
    } catch (error) {
        console.error(error);
        res.writeHead(500, {
            'Content-Type': 'application/json'
        })
        return res.end(JSON.stringify(error))
    }
}