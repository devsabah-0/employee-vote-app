document.querySelector('.vote-button').addEventListener('click', function() {
    const voteData = {
        name: document.querySelector('.candidate-name').textContent.split('Name: ')[1],
        employee: document.querySelector('.designation').textContent.split('Designation: ')[1]
    };

    fetch('http://localhost:3000/vote', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(voteData)
    })
    .then(response => response.text())
    .then(data => alert(data))
    .catch(error => console.error('Error:', error));
});
