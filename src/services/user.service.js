const bcrypt = require('bcryptjs')
const User = require('../models/schema/user.schema');
const { sendWelcomeEmail, sendCancelationEmail } = require('../config/emails/email')

exports.getUserById = async (userId) => {
    const user = await User.findById(userId)
    if (!user) {
        return new Error("User not found !!")
    }
    return user;
};

exports.createUser = async (usr) => {
    const hashedPassword = await bcrypt.hash(usr.password, 10);
    const user = {
        name: usr.name,
        email: usr.email,
        password: hashedPassword
    }
    const fetchedUser = await new User(user);
    // fetchedUser.save();
    const token = await fetchedUser.generateAuthToken()
    if (!fetchedUser) {
        throw new Error("error in creating user")
    }
    return fetchedUser;
};



exports.getUserByEmailAndPassword = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            res.status(500).json("please provide email and password correctly")

        const user = await User.findOne({
            email: email,
        })
        // sendWelcomeEmail(user.email, user.name)
        if (!user || !await bcrypt.compare(password, user.password)) {
            res.status(404).json({
                data: "User not found or Incorrect Password"
            })
        }
        else {
            // const token = await user.generateAuthToken()
            res.status(200).json({
                data: {
                    token: user.tokens[0]
                },
                status: "Success",
            });
        }
    }
    catch (err) {
        res.status(400).json(err);
    }
}

exports.follow = async (currentUserId, goingToFollowUserId) => {
    if (goingToFollowUserId === currentUserId) {
        throw new Error('You cannot follow yourself !!')
    }
    try {
        const currentUser = await User.findById(currentUserId);
        const goingToFollowUser = await User.findById(goingToFollowUserId)
        if (!currentUser || !goingToFollowUser) {
            throw new Error("User(s) not found");
        }
        if (!currentUser.followingTo)
            currentUser.followingTo = []
        currentUser.followingTo.push(goingToFollowUser._id);
        currentUser.followingCount += 1;
        const updatedCurrentUser = await User.findByIdAndUpdate(
            currentUser._id,
            {
                ...currentUser,
            },
            {
                new: true, omitUndefined: true
            }
        );
        goingToFollowUser.followedBy.push(currentUser._id);
        goingToFollowUser.followersCount += 1
        await User.findByIdAndUpdate(
            goingToFollowUser._id,
            {
                ...goingToFollowUser,
            },
            {
                new: true, omitUndefined: true
            }
        );
        return updatedCurrentUser;
    } catch (err) {
        return new Error("error in following user")
    }
};


exports.unfollow = async (currentUserId, goingToFollowUserId) => {
    if (goingToFollowUserId == currentUserId) {
        throw new Error('You cannot follow yourself !!')
    }
    const currentUser = await User.findById(currentUserId);
    const goingToUnFollowUser = await User.findById(goingToFollowUserId)
    if (!currentUser || !goingToUnFollowUser) {
        throw new Error("User(s) not found");
    }
    try {
        const updatedCurrentUser = await User.findByIdAndUpdate(currentUser._id,
            {
                $pull: { followingTo: goingToUnFollowUser._id },
                $inc: { 'followingCount': -1 }
            },
            { new: true, omitUndefined: true })

        await User.findByIdAndUpdate(
            goingToUnFollowUser._id,
            {
                $pull: { followedBy: currentUser._id },
                $inc: { 'followersCount': -1 }
            },
            { new: true, omitUndefined: true })

        return updatedCurrentUser;
    } catch (err) {
        return new Error("error in unfollowing user")
    }
};