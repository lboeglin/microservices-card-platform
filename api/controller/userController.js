'use strict'
import userDAO from "../dao/userDAO.js";

const userController = {
    getAll: async () => {
        return await userDAO.getAllUsers()
    },

    getFromId: async (id) => {
        return await userDAO.getUserById(id)
    },

    login: async (req, res) => {
        const { email, password } = req.body
        const user = await userDAO.getUserByEmail(email)

        if (!user) {
            return res.status(404).send({ message: 'User not found' })
        }

        if (user.password !== password) {
            return res.status(401).send({ message: 'Invalid password' })
        }

        return res.status(200).send({ message: 'Login successful', user })
    }
}

export default userController