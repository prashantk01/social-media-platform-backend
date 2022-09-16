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

exports.follow = (req, res, next) => {
    if (req.params.id == req.user._id) {
        res.status(400).json({
            status: 'success',
            data: 'You cannot follow yourself..'
        });

        return;
    }

    User.findByIdAndUpdate(
        req.user._id,
        {
            $push: { followingTo: req.params.id },
            $inc: { 'followingCount': 1 }
        },
        { new: true, omitUndefined: true })
        .then(result => next())
        .catch(err => res.status(400).json(err));

    User.findByIdAndUpdate(
        req.params.id,
        {
            $push: { followedBy: req.user._id },
            $inc: { 'followersCount': 1 }
        },
        { new: true, omitUndefined: true })
        .populate('followedBy', '_id name')
        .populate('followingTo', '_id name')
        .then(result => res.status(200).json({
            status: 'success',
            data: {
                data: result
            }
        }))
        .catch(err => res.status(400).json(err));

};


exports.unfollow = (req, res) => {
    if (req.params.id == req.user._id) {
        res.status(400).json({
            status: 'success',
            data: 'You cannot unfollow yourself..'
        });

        return;
    }

    User.findByIdAndUpdate(req.user._id,
        {
            $pull: { followingTo: req.params.id },
            $inc: { 'followingCount': -1 }
        },
        { new: true, omitUndefined: true })
        .then(result => next())
        .catch(err => res.status(400).json(err));

    User.findByIdAndUpdate(
        req.params.id,
        {
            $pull: { followedBy: req.user._id },
            $inc: { 'followersCount': -1 }
        },
        { new: true, omitUndefined: true })
        .populate('following', '_id name')
        .populate('followers', '_id name')
        .then(result => res.status(200).json(result))
        .catch(err => res.status(400).json(err));
};