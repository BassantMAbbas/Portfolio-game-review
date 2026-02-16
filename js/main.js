const apiKey = "YOUR_API_KEY";
// const baseUrl = "https://www.freetogame.com/api";
const loader = document.getElementById("loading");
const gamesContainer = document.getElementById("games-container");
const errorBox = document.getElementById("error");
const categoryBtns = document.querySelectorAll(".category-link");
const homeLink = document.getElementById("home-link");
const modal = new bootstrap.Modal(document.getElementById('gameModal'));
const modalLoading = document.getElementById('modal-loading');
const modalError = document.getElementById('modal-error');
const modalContent = document.getElementById('modal-content');

//to fetch games from api

async function fetchGames(category = '', platform = ''){
    try{
        loader.style.display = 'block';
        errorBox.style.display = 'none';
        gamesContainer.innerHTML =''; // clear html display
        

        let url = `https://free-to-play-games-database.p.rapidapi.com/api/games`;
        if(category) url += `?category=${category}`;
        if(platform) url += category ? `&platform=${platform}` : `?platform=${platform}`;

        const options = {
            method: 'GET',
            headers: {
                'x-rapidapi-key': 'apikey',
                'x-rapidapi-host': 'free-to-play-games-database.p.rapidapi.com'
            }};

        const response = await fetch(url, options)
    if(!response.ok){
        throw new Error(`API Error : ${response.status}`);
    }
    const games = await response.json();
    console.log(games);
    displayGames(games);
    }
    catch(error){
        console.error('Error fetching games:', error);
        loader.style.display = 'none';
        errorBox.style.display = 'block'; 
        errorBox.innerHTML = `<p>Failed to load games: ${error.message}</p>`;
    }
}
// fetchGames();

//Display function
function displayGames(games) {
    loader.style.display = 'none';
    gamesContainer.innerHTML = '';

    if (games.length === 0) {
        gamesContainer.innerHTML = '<p class="text-center">No games found.</p>';
        return;
    }

    games.forEach(game => {
        const gameCard = `
            <div class="col-md-4 mb-4">
                <div class="card game-card" data-game-id="${game.id}" style="cursor: pointer;">
                    <img src="${game.thumbnail}" class="card-img-top" alt="${game.title}" 
                         onerror="this.src='https://via.placeholder.com/300x200?text=No+Image'">
                    <div class="card-body">
                        <h5 class="card-title">${game.title}</h5>
                        <p class="card-text">
                            <strong>Genre:</strong> ${game.genre}<br>
                            <strong>Platform:</strong> ${game.platform}<br>
                            ${game.short_description}
                        </p>
                    </div>
                </div>
            </div>
        `;
        gamesContainer.innerHTML += gameCard;
    });

    document.querySelectorAll('.game-card').forEach(card => {
        card.addEventListener('click', () => {
            const gameId = card.getAttribute('data-game-id');
            openGameModal(gameId);
        });
    });
}

async function openGameModal(id) {
    modalLoading.style.display = 'block';
    modalError.style.display = 'none';
    modalContent.style.display = 'none';

    try {
        const url = `https://free-to-play-games-database.p.rapidapi.com/api/game?id=${id}`;
        const options = {
            method: 'GET',
            headers: {
                'x-rapidapi-key': apiKey,
                'x-rapidapi-host': 'free-to-play-games-database.p.rapidapi.com'
            }
        };

        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        const game = await response.json();
        displayGameInModal(game);
        modal.show();
    } catch (error) {
        console.error('Error fetching game details:', error);
        modalLoading.style.display = 'none';
        modalError.style.display = 'block';
        modalError.innerHTML = `<p>Failed to load game details: ${error.message}</p>`;
        modal.show();
    }
}

function displayGameInModal(game) {
    modalLoading.style.display = 'none';
    modalContent.style.display = 'block';

    modalContent.innerHTML = `
        <div class="row">
            <div class="col-md-4">
                <img src="${game.thumbnail}" class="img-fluid mb-3" alt="${game.title}" onerror="this.src='https://via.placeholder.com/300x200?text=No+Image'">
            </div>
            <div class="col-md-8">
                <h2>${game.title}</h2>
                <p><strong>Category:</strong> ${game.genre}</p> 
                <p>${game.description}</p>  
                <a href="${game.freetogame_profile_url}" class="btn btn-primary" target="_blank">Read More</a> 
            </div>
        </div>
    `;
}

//event listener to call fetch games function when loading page and for categories and home navbar
document.addEventListener('DOMContentLoaded', () => {
    fetchGames();

    categoryBtns.forEach(btn => {
        btn.addEventListener('click', (event) => {
            event.preventDefault();
            const category = btn.getAttribute('data-category');
            fetchGames(category);
            document.getElementById('reviews').scrollIntoView({ behavior: 'smooth' });
        })
    })

    homeLink.addEventListener('click', (event) => {
            event.preventDefault();
            fetchGames();
            document.getElementById('reviews').scrollIntoView({ behavior: 'smooth' });
        });
});
