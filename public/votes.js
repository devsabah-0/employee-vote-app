// public/votes.js
document.addEventListener('DOMContentLoaded', () => {
    const voteCards = document.getElementById('vote-cards');

    const loadVotes = () => {
        fetch('/participants')
            .then(response => response.json())
            .then(data => {
                voteCards.innerHTML = '';
                data.forEach(participant => {
                    const card = document.createElement('div');
                    card.className = 'vote-card';
                    card.innerHTML = `
                        <img src="${participant.imagePath}" alt="${participant.name}" class="participant-image">
                        <div class="vote-info">
                            <h2 class="participant-name">${participant.name}</h2>
                            <p class="vote-count">Votes: ${participant.votes}</p>
                        </div>
                    `;
                    voteCards.appendChild(card);
                });
            })
            .catch(error => {
                console.error('Error loading votes:', error);
            });
    };

    loadVotes();
});
