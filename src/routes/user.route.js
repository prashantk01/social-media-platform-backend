const express = require("express");
const userService = require("../services/user.service");
const auth = require("../middleware/auth")

const router = express.Router();

router.get("/",
    auth,
    async (req, res) => {
        try {
            const user = req.user;
            const response = await userService.getUserById(user._id);
            res.status(200).send({
                data: {
                    age: response.age,
                    name: response.name,
                    numberOfFollowers: response.followersCount,
                    numberOfFollowings: response.followingCount
                }
            });
        }
        catch (err) {
            res.status(500).send({ data: err })
        }
    }
);

router.post("/",
    async (req, res) => {
        try {
            const { name, email, password } = req.body;
            const user = {
                name,
                email,
                password
            }
            const response = await userService.createUser(user);
            res.status(200).send({
                data: {
                    name: response.name,
                    email: response.email,
                },
            })
        } catch (err) {
            console.log(err)
            res.status(400).send(err);
        }
    }
);

router.put(
    "/follow/:id",
    auth,
    async (req, res) => {
        try {
            const currentUserId = req.user._id;
            const goingToFollowUserId = req.params.id;
            const response = await userService.follow(currentUserId, goingToFollowUserId)
            res.status(200).send({
                data: {
                    name: response.name,
                    followersCount: response.followersCount,
                    followingCount: response.followingCount
                }
            })
        } catch (err) {
            res.status(400).send(err);
        }
    }
);

router.put(
    "/unfollow/:id",
    auth,
    async (req, res) => {
        try {
            const currentUserId = req.user._id;
            const goingToFollowUserId = req.params.id;
            const response = await userService.unfollow(currentUserId, goingToFollowUserId)
            res.status(200).send({
                data: {
                    name: response.name,
                    followersCount: response.followersCount,
                    followingCount: response.followingCount
                }
            })
        } catch (err) {
            res.status(400).send(err);
        }
    }
);

router.get("/authenticate",
    userService.getUserByEmailAndPassword
);


module.exports = router;