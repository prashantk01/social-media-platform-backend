const express = require("express");
const userService = require("../services/user.service");
const auth = require("../middleware/auth")

const router = express.Router();

router.get("/",
    auth,
    userService.getUserById
);

router.put(
    "/follow/:id",
    auth,
    userService.follow
);
router.put(
    "/unfollow/:id",
    auth,
    userService.unfollow
);

router.get("/authenticate",
    userService.getUserByEmailAndPassword
);


module.exports = router;