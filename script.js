import { BalldontlieAPI } from "@balldontlie/sdk";

const api = new BalldontlieAPI({ apiKey: "d585f12f-78f9-45ea-8b53-68bf4c5ddfdf" });


document.querySelector('.btn').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent page reload

    const player1 = document.getElementById('player1').value;
    const player2 = document.getElementById('player2').value;

    fetchPlayerStats(player1, 'player1-stats');
    fetchPlayerStats(player2, 'player2-stats');
});

async function fetchPlayerStats(playerName, elementId) {
    try {
        const response = await fetch(`https://www.balldontlie.io/api/v1/players?search=${playerName}`);
        const data = await response.json();

        if (data.data.length === 0) {
            document.getElementById(elementId).innerHTML = `<p>Player not found.</p>`;
            return;
        }

        const player = data.data[0];

        const statsResponse = await fetch(`https://www.balldontlie.io/api/v1/season_averages?season=2023&player_ids[]=${player.id}`);
        const statsData = await statsResponse.json();
        const stats = statsData.data[0] || {};

        document.getElementById(elementId).innerHTML = `
            <h3>${player.first_name} ${player.last_name}</h3>
            <p>Position: ${player.position}</p>
            <p>Team: ${player.team.full_name}</p>
            <p>PPG: ${stats.pts || 'N/A'}</p>
            <p>RPG: ${stats.reb || 'N/A'}</p>
            <p>APG: ${stats.ast || 'N/A'}</p>
        `;
    } catch (error) {
        console.error("Error fetching player stats:", error);
        document.getElementById(elementId).innerHTML = `<p>Error loading data.</p>`;
    }
}

