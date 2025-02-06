import { BalldontlieAPI } from "https://cdn.jsdelivr.net/npm/@balldontlie/sdk/+esm";

// Ensure the script is executed as a module
document.addEventListener("DOMContentLoaded", () => {
    const api = new BalldontlieAPI({ apiKey: "d585f12f-78f9-45ea-8b53-68bf4c5ddfdf" });
    
    document.querySelector(".btn").addEventListener("click", async function(event) {
        event.preventDefault(); // Prevent page reload

        const player1Name = document.getElementById("player1").value;
        const player2Name = document.getElementById("player2").value;

        await fetchPlayerStats(api, player1Name, "player1-stats");
        await fetchPlayerStats(api, player2Name, "player2-stats");
    });
});

async function fetchPlayerStats(api, playerName, elementId) {
    try {
        console.log(`Fetching stats for: ${playerName}`);
        
        // Search for player ID
        const playerSearch = await api.players.list({ search: playerName });
        console.log("Player Search Response:", playerSearch);
        
        if (!playerSearch.data || playerSearch.data.length === 0) {
            document.getElementById(elementId).innerHTML = `<p>Player not found.</p>`;
            return;
        }

        const playerId = playerSearch.data[0].id;
        console.log(`Found Player ID: ${playerId}`);

        // Fetch season averages
        const statsResponse = await api.stats.seasonAverages({ season: 2023, player_ids: [playerId] });
        console.log("Stats Response:", statsResponse);
        
        const stats = statsResponse.data && statsResponse.data.length > 0 ? statsResponse.data[0] : {};

        document.getElementById(elementId).innerHTML = `
            <h3>${playerSearch.data[0].first_name} ${playerSearch.data[0].last_name}</h3>
            <p>Position: ${playerSearch.data[0].position || "N/A"}</p>
            <p>Team: ${playerSearch.data[0].team ? playerSearch.data[0].team.full_name : "N/A"}</p>
            <p>PPG: ${stats.pts || "N/A"}</p>
            <p>RPG: ${stats.reb || "N/A"}</p>
            <p>APG: ${stats.ast || "N/A"}</p>
        `;
    } catch (error) {
        console.error("Error fetching player stats:", error);
        document.getElementById(elementId).innerHTML = `<p>Error loading data.</p>`;
    }
}
