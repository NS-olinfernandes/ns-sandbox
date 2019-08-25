import { User, hashPassword } from '../_config';

// Register new User - POST api response
export async function post(req, res) {
    const user = req.query;
    const newUser = new User({
        name: {
            firstName: user.firstName,
            lastName: user.lastName
        },
        email: user.email,
        password: hashPassword(user.password)
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
        if(error.code === 11000){
            res.writeHead(401, {
                'Content-Type': 'application/json'
            })
            return res.end(JSON.stringify({message: 'Email already exists!'}))
        }
        res.writeHead(500, {
            'Content-Type': 'application/json'
        })
        return res.end(JSON.stringify(error))
    }
}