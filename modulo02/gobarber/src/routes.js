import { Router } from 'express';

import User from './app/models/User';

const routes = new Router();

routes.get('/', async (req, res) => {
    const user = await User.create({
        name: 'Fulano de Tal',
        email: 'fulano@exemplo.com',
        password_hash: '12341234123',
    });
    return res.json(user);
});

export default routes;
