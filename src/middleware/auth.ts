import { verify } from "jsonwebtoken";

module.exports = (req: any, res: any, next: any) => {
	const token = req.header("Authorization");

	if (!token) {
		return res.status(401).json({ msg: "No Token" });
	}

	try {
		// @ts-ignore
		const decoded: any = verify(token, process.env.JWT_SECRET);
		req.user = decoded.user;
		next();
	} catch (error) {
		console.log(error);
		res.status(401).json({ msg: "Token is not valid" });
	}
};

