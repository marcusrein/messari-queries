async function getTVLs() {
	const urls = [
		{
			url: "https://gateway.thegraph.com/api/0ab7a83b03a36ac8a536cd8fa19a8ad4/subgraphs/id/GAGwGKc4ArNKKq9eFTcwgd1UGymvqhTier9Npqo1YvZB",
			name: "Curve Finance",
		},
		{
			url: "https://gateway.thegraph.com/api/0ab7a83b03a36ac8a536cd8fa19a8ad4/subgraphs/id/7h1x51fyT5KigAhXd8sdE3kzzxQDJxxz1y66LTFiC3mS",
			name: "SushiSwap",
		},
	];

	const requests = urls.map((entry) =>
		fetch(entry.url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				query: `
					{
						dailySnapshot8_20_23: financialsDailySnapshots(
							where: { timestamp_gte: 1629417600, timestamp_lt: 1629504000 }
						) {
							totalValueLockedUSD
						}
					}
				`,
			}),
		})
	);

	const results = await Promise.all(requests);
	const tvls = await Promise.all(results.map((result) => result.json()));

	const dataContainer = document.getElementById("data-container");
	tvls.forEach((feed, index) => {
		const platformName = urls[index].name;
		const feedData = feed.data.dailySnapshot8_20_23;
		feedData.forEach((snapshot) => {
			const snapshotElement = document.createElement("div");
			snapshotElement.innerHTML = `
				<h3>${platformName}</h3>
				<p>Total Value Locked USD: ${snapshot.totalValueLockedUSD}</p>
				<hr>
			`;
			dataContainer.appendChild(snapshotElement);
		});
	});
}

getTVLs();
