const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;
const DB_FILE = path.join(__dirname, 'students.json');


app.use(cors()); 

app.use(express.json()); 


function readData() {
    try {
        const data = fs.readFileSync(DB_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading data file:', error);
        return []; 
    }
}


function writeData(data) {
    try {
        fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2)); 
    } catch (error) {
        console.error('Error writing data file:', error);
    }
}


app.get('/students', (req, res) => {
    const students = readData();
    res.json(students);
});


app.post('/students', (req, res) => {
    const students = readData();
    const newStudent = req.body;

    
    if (!newStudent.studentId || !newStudent.fullName || !newStudent.program) {
        return res.status(400).json({ error: 'Student ID, Full Name, and Program are required.' });
    }


    const studentExists = students.some(s => s.studentId === newStudent.studentId);
    if (studentExists) {
        return res.status(400).json({ error: 'A student with this ID already exists.' });
    }

   
    students.push(newStudent);
    writeData(students);

    console.log('Added new student:', newStudent);
    res.status(201).json(newStudent); 
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});