// public/manage.js
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('participant-form');
    const participantList = document.getElementById('participant-list');
    const toggleVotingButton = document.getElementById('toggle-voting');

    const loadParticipants = () => {
        fetch('/participants')
            .then(response => response.json())
            .then(data => {
                participantList.innerHTML = '';
                data.forEach(participant => {
                    const li = document.createElement('li');
                    li.innerHTML = `
                        <img src="${participant.imagePath}" alt="${participant.name}" class="participant-image">
                        ${participant.name} - ${participant.designation} (${participant.department})
                    `;
                    const deleteButton = document.createElement('button');
                    deleteButton.textContent = 'Delete';
                    deleteButton.className = 'delete-button';
                    deleteButton.onclick = () => deleteParticipant(participant.id);
                    li.appendChild(deleteButton);
                    participantList.appendChild(li);
                });
            })
            .catch(error => {
                console.error('Error loading participants:', error);
            });
    };

    const addParticipant = (event) => {
        event.preventDefault();
        const formData = new FormData(form);

        fetch('/participants', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(() => {
            form.reset();
            loadParticipants();
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
    };

    const deleteParticipant = (id) => {
        fetch(`/participants/${id}`, { method: 'DELETE' })
            .then(() => loadParticipants())
            .catch(error => {
                console.error('Error deleting participant:', error);
            });
    };

    const toggleVoting = () => {
        fetch('/toggle-voting', { method: 'POST' })
            .then(response => response.json())
            .then(data => {
                updateToggleButton(data.votingOpen);
            })
            .catch(error => {
                console.error('Error toggling voting:', error);
            });
    };

    const updateToggleButton = (votingOpen) => {
        toggleVotingButton.textContent = votingOpen ? 'Vote Stop' : 'Vote Start';
        toggleVotingButton.style.backgroundColor = votingOpen ? 'green' : 'red';
        toggleVotingButton.style.boxShadow = votingOpen ? '0 0 10px green' : '0 0 10px red';
    };

    const loadVotingStatus = () => {
        fetch('/voting-status')
            .then(response => response.json())
            .then(data => {
                updateToggleButton(data.votingOpen);
            })
            .catch(error => {
                console.error('Error loading voting status:', error);
            });
    };

    toggleVotingButton.addEventListener('click', toggleVoting);
    form.addEventListener('submit', addParticipant);
    loadParticipants();
    loadVotingStatus();
});
