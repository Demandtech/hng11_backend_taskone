import express from "express";
import geoip from "fast-geoip";
import "dotenv/config";

const app = express();

app.get("/", (_, res) => {
	res.send("Welcome to my HNG Task one");
});

app.get("/api/hello", async (req, res) => {
	const { visitor_name } = req.query;

	if (!visitor_name)
		return res.status(400).json({ message: "Visitor name query is required" });

	const ip = "41.203.78.171";
	// console.log(req.ip);

	try {
		const geo = await geoip.lookup(ip);
		const city = geo.city;

		const [lat, lon] = geo.ll;

        console.log(process.env.API_KEY);

		const response = await fetch(
			`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${process.env.API_KEY}`,
			{
				method: "GET",
			}
		);

		if (!response.ok) {
			throw new Error(`Error: ${response.status} ${response.statusText}`);
		}

		const data = await response.json();

		console.log(data);

		const temperature = "11 degrees Celcius";

		res.status(200).json({
			greeting: `Hello, ${visitor_name}! the temprature is ${temperature} in ${city}`,
		});
	} catch (err) {
		console.error(err);
        res.status(500).json({ message: "Internal server error", error: err.message });
	}
});
app.listen(5500, () => console.log("Sever listening on port 5500"));
