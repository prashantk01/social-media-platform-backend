const bcrypt = require('bcryptjs')
const User = require('../models/schema/user.schema');

exports.getUserById = (req, res) => {
    User.findById(req.user._id)
        .then(doc => res.status(200).json({
            status: 'success',
            data: {
                age: doc.age,
                name: doc.name,
                numberOfFollowers: doc.followersCount,
                numberOfFollowings: doc.followingCount
            }
        }))
        .catch(err => res.status(404).json(err));
};


exports.getUserByEmailAndPassword = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            res.status(500).json("please provide email and password correctly")

        const user = await User.findOne({
            email: email,
        })
        if (!user || !await bcrypt.compare(password, user.password)) {
            res.status(404).json({
                data: "User not found or Incorrect Password"
            })
        }
        else {
            const token = await user.generateAuthToken()
            res.status(200).json({
                data: {
                    token: token
                },
                status: "Success",
            });
        }
    }
    catch (err) {
        res.status(400).json(err);
    }
}

exports.follow = async (req, res) => {
    if (req.params.id === req.user._id) {
        res.status(400).send({
            status: 'success',
            data: 'You cannot follow yourself !!'
        });
        return;
    }
    try {
        const currentUser = await User.findById(req.user._id);
        const goingToFollowUser = await User.findById(req.params.id)
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
        res.status(200).json({
            data: {
                name: updatedCurrentUser.name,
                followersCount: updatedCurrentUser.followersCount,
                followingCount: updatedCurrentUser.followingCount
            }

        })
    } catch (err) {
        res.status(500).json({
            data: err
        })
    }
};


exports.unfollow = async (req, res) => {
    if (req.params.id == req.user._id) {
        res.status(400).send({
            status: 'success',
            data: 'You cannot unfollow yourself !!'
        });
        return;
    }
    const currentUser = await User.findById(req.user._id);
    const goingToUnFollowUser = await User.findById(req.params.id)
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

        res.status(200).json({
            data: {
                name: updatedCurrentUser.name,
                followersCount: updatedCurrentUser.followersCount,
                followingCount: updatedCurrentUser.followingCount
            }

        })

    } catch (err) {
        res.
            status(500).
            send({ data: err })
    }
};