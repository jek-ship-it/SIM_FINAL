document.addEventListener('DOMContentLoaded', () => {

    
    const API_URL = 'https://sims-backend-jyqd.onrender.com/students';
    let allStudents = []; 

    
    const form = document.getElementById('studentForm');
    const studentListBody = document.getElementById('studentList');
    const noStudentsMessage = document.getElementById('noStudentsMessage');
    const searchInput = document.getElementById('searchInput');
    const filterGender = document.getElementById('filterGender');

    

  
    async function fetchStudents() {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const students = await response.json();
            allStudents = students;
            applyFilters(); 
        } catch (error) {
            console.error('Error fetching students:', error);
            alert('Failed to load student data. Is the backend server running?');
        }
    }

    
    function renderStudents(studentsToRender) {
        
        studentListBody.innerHTML = '';

        
        if (studentsToRender.length === 0) {
            noStudentsMessage.classList.remove('hidden');
        } else {
            noStudentsMessage.classList.add('hidden');
        }

        
        const limitedStudents = studentsToRender.slice(0, 50);

        
        limitedStudents.forEach(student => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${student.studentId}</td>
                <td>${student.fullName}</td>
                <td>${student.gender}</td>
                <td>${student.gmail}</td>
                <td>${student.program}</td>
                <td>${student.yearLevel}</td>
                <td>${student.university}</td>
            `;
            studentListBody.appendChild(tr);
        });
    }

    
    async function handleFormSubmit(event) {
        event.preventDefault(); 

        
        const yearLevel = parseInt(document.getElementById('yearLevel').value);
        if (isNaN(yearLevel) || yearLevel < 1 || yearLevel > 5) {
            alert('Year Level must be a number between 1 and 5.');
            return;
        }

        
        const studentData = {
            studentId: document.getElementById('studentId').value,
            fullName: document.getElementById('fullName').value,
            gender: document.getElementById('gender').value,
            gmail: document.getElementById('gmail').value,
            program: document.getElementById('program').value,
            yearLevel: yearLevel,
            university: document.getElementById('university').value,
        };

        try {
            
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(studentData),
            });

            if (response.ok) {
                
                form.reset(); 
                await fetchStudents(); 
            } else {
                
                const errorData = await response.json();
                alert(`Error: ${errorData.error}`);
            }
        } catch (error) {
            console.error('Error adding student:', error);
            alert('Failed to add student. Please try again.');
        }
    }

    
    function applyFilters() {
        const searchTerm = searchInput.value.toLowerCase();
        const gender = filterGender.value;

        const filteredStudents = allStudents.filter(student => {
            const nameMatch = student.fullName.toLowerCase().includes(searchTerm);
            const genderMatch = (gender === '' || student.gender === gender);
            return nameMatch && genderMatch;
        });

        renderStudents(filteredStudents);
    }

    
    form.addEventListener('submit', handleFormSubmit);
    searchInput.addEventListener('input', applyFilters); 
    filterGender.addEventListener('change', applyFilters); 

    
    fetchStudents(); 
});
