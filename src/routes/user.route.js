const express = require("express");
const userService = require("../services/user.service");

const router = express.Router();


router.get("/authenticate",
    userService.getUserByEmailAndPassword
);

router.put(
    "/follow/:id",
    userService.follow
);
router.put(
    "/unfollow/:id",
    userService.unfollow
);

module.exports = router;