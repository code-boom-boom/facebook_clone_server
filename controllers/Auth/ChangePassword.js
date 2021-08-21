const User = require("../../models/User");
const bcrypt = require("bcrypt");

module.exports = async (req, res) => {
    let { currentPassword, newPassword } = req.body;

    try {
        const user = await User.findById(req.userId);

        if (!currentPassword) {
            return res.status(400).json({ error: "Current password is required!" });
        }

        let matchPassword = await bcrypt.compare(currentPassword, user.password);

        if (!matchPassword) {
            return res.status(400).json({ error: "Current password is incorrect. Please try again" });
        }

        if (!newPassword) {
            return res.status(400).json({ error: "New password is required" });
        }

        user.password = await bcrypt.hash(newPassword, 8);

        await user.save();

        res.status(200).json({ message: "Password updated successfully!" });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Something went wrong" });
    }
}