document.addEventListener("DOMContentLoaded", () => {
    document.querySelector(".btn").addEventListener("click", async function(event) {
        event.preventDefault(); // Prevent page reload

        const player1Name = document.getElementById("player1").value;
        const player2Name = document.getElementById("player2").value;

        await fetchPlayerStats(player1Name, "player1-stats");
        await fetchPlayerStats(player2Name, "player2-stats");
    });
});

async function fetchPlayerStats(playerName, elementId) {
    try {
        // Search for player ID
        const playerSearch = await api.players.list({ search: playerName });
        if (!playerSearch.data || playerSearch.data.length === 0) {
            document.getElementById(elementId).innerHTML = `<p>Player not found.</p>`;
            return;
        }

        const playerId = playerSearch.data[0].id;

        // Fetch season averages
        const statsResponse = await api.stats.seasonAverages({ season: 2023, player_ids: [playerId] });
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
