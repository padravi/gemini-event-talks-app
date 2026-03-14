document.addEventListener('DOMContentLoaded', () => {
    const scheduleContainer = document.getElementById('schedule-container');
    const searchInput = document.getElementById('category-search');
    let talksData = [];

    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            talksData = data;
            displayTalks(talksData);
        });

    function displayTalks(talks) {
        scheduleContainer.innerHTML = '';
        let currentTime = new Date('2024-03-14T10:00:00');

        talks.forEach((talk, index) => {
            const talkElement = document.createElement('div');
            talkElement.classList.add('talk');

            const talkTime = new Date(currentTime);
            const endTime = new Date(currentTime.getTime() + talk.duration * 60000);

            talkElement.innerHTML = `
                <p class="talk-time">${formatTime(talkTime)} - ${formatTime(endTime)}</p>
                <h2>${talk.title}</h2>
                <p><strong>Speaker(s):</strong> ${talk.speakers.join(', ')}</p>
                <p><strong>Category:</strong> ${talk.category.join(', ')}</p>
                <p>${talk.description}</p>
            `;
            scheduleContainer.appendChild(talkElement);

            currentTime = new Date(endTime.getTime() + 10 * 60000); // 10 minute break

            if (index === 2) { // Lunch break after the 3rd talk
                const lunchBreakElement = document.createElement('div');
                lunchBreakElement.classList.add('talk');
                const lunchEndTime = new Date(currentTime.getTime() + 60 * 60000);
                lunchBreakElement.innerHTML = `
                    <p class="talk-time">${formatTime(currentTime)} - ${formatTime(lunchEndTime)}</p>
                    <h2>Lunch Break</h2>
                `;
                scheduleContainer.appendChild(lunchBreakElement);
                currentTime = lunchEndTime;
            }
        });
    }

    function formatTime(date) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredTalks = talksData.filter(talk =>
            talk.category.some(category => category.toLowerCase().includes(searchTerm))
        );
        displayTalks(filteredTalks);
    });
});
