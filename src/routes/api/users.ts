import express, { Request, Response } from "express";
import { check, validationResult } from "express-validator";
import { genSalt, hash, compare } from "bcrypt";
import User from "../../models/User";
import { sign } from "jsonwebtoken";
const router = express.Router();
import "dotenv/config";

//@route api/users/register
//@desc  Register User
router.post(
	"/register",
	[
		check("firstName", "First Name is required").not().isEmpty(),
		check("email", "Email is required").isEmail(),
		check("password", "Please enter a password with 6 or more characters").isLength({ min: 6 }),
	],
	async (req: Request, res: Response) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { firstName, lastName, email, password } = req.body;

		try {
			let user = await User.findOne({ email });

			if (user) {
				return res.status(400).json({ errors: [{ msg: "User already exists!" }] });
			}

			user = new User({
				firstName,
				lastName,
				email,
				password,
			});

			const salt = await genSalt(10);
			user.password = await hash(password, salt);
			await user.save();
			return res.status(201).json({});
		} catch (error) {
			console.log(error);
			res.status(500).send("Server Error!");
		}
	}
);

//@route api/users/login
//@desc  login User
router.post(
	"/login",
	[
		check("email", "Email is required").isEmail(),
		check("password", "Please enter a password with 6 or more characters").isLength({ min: 6 }),
	],
	async (req: Request, res: Response) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { email, password } = req.body;

		try {
			let user = await User.findOne({ email });
			if (user && user.password) {
				if (await compare(password, user.password)) {
					const payload = {
						user: {
							id: user.id,
						},
					};
					const userDataresponse = {
						_id: user._id,
						email: user.email,
						firstName: user.firstName,
						lastName: user.lastName,
					};
					// @ts-ignore
					sign(
						payload,
						// @ts-ignore
						process.env.JWT_SECRET,
						{ expiresIn: "12h" },
						(err, token) => {
							if (err) throw err;
							res.json({
								user: userDataresponse,
								token: token,
							});
						}
					);
				} else {
					return res.status(400).json({ message: "Invalid user, please check your credentials!!" });
				}
			} else {
				return res.status(401).json({ message: "User doesn't exist!!" });
			}
		} catch (error) {
			console.log(error);
			res.status(500).send("Server Error!");
		}
	}
);

module.exports = router;

