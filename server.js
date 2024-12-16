const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

let votes = []; // Array to store vote records

let participants = [
    {
        name: 'Ahmed',
        designation: 'Software Engineer',
        department: 'IT',
        review: 'John has consistently exceeded expectations and is a strong team player.'
    },
    {
        name: 'Alex',
        designation: 'Marketing Manager',
        department: 'Marketing',
        review: 'Jane has a knack for creative strategies and achieving remarkable milestones.'
    },
    {
        name: 'Samooh',
        designation: 'Project Manager',
        department: 'Operations',
        review: 'Emily excels in leadership, consistently delivering successful projects on time.'
    }
];

// Endpoint to submit a vote
app.post('/vote', (req, res) => {
    const vote = req.body;
    if (vote && vote.name && vote.employee) {
        votes.push(vote);
        res.status(200).send('Vote submitted successfully');
    } else {
        res.status(400).send('Invalid vote data');
    }
});

// Return votes and add vote counts for each participant
app.get('/votes', (req, res) => {
    try {
        const voteCount = participants.map(participant => {
            const count = votes.filter(vote => vote.name === participant.name).length;
            return { ...participant, votes: count };
        });
        res.json(voteCount);
    } catch (error) {
        console.error('Error retrieving votes:', error);
        res.status(500).send('Server error');
    }
});

// Endpoint to get all participants without vote count 
app.get('/participants', (req, res) => {
    res.status(200).json(participants);
});

// Endpoint to add a participant
app.post('/add-participant', (req, res) => {
    const participant = req.body;
    if (
        participant &&
        participant.name &&
        participant.designation &&
        participant.department &&
        participant.review
    ) {
        participants.push(participant);
        res.status(201).send('Participant added successfully');
    } else {
        res.status(400).send('Invalid participant data');
    }
});

// Endpoint to remove a participant by name
app.post('/remove-participant', (req, res) => {
    const { name } = req.body;
    const index = participants.findIndex((p) => p.name === name);
    if (index !== -1) {
        participants.splice(index, 1);
        res.status(200).send('Participant removed successfully');
    } else {
        res.status(404).send('Participant not found');
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
