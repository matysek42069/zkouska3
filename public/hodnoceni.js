async function submitRating() {
    const ratingElement = document.querySelector('input[name="rating"]:checked');
    const reviewText = document.getElementById('reviewText').value;

    if (!ratingElement) {
        alert('Prosím, vyberte počet hvězdiček.');
        return;
    }

    const stars = parseInt(ratingElement.value);

    try {        
        const response = await fetch('/api/hodnoceni/add', { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                stars: stars,
                review: reviewText
            })
        });

        const data = await response.json();

        if (!data.success) {
            throw new Error(data.error || 'Neznámá chyba při ukládání hodnocení');
        }

        alert('Hodnocení odesláno!');
        // Reset formuláře
        ratingElement.checked = false; 
        document.getElementById('reviewText').value = ''; 
        loadAverageRating(); // Znovu načíst průměrné hodnocení
    } catch (error) {
        console.error("Chyba při odesílání hodnocení: ", error);
        alert('Došlo k chybě při odesílání hodnocení: ' + error.message);
    }
}

async function loadAverageRating() {
    const averageRatingDisplay = document.getElementById('averageRatingDisplay');
    const averageRatingStars = document.getElementById('averageRatingStars');

    try {
        const response = await fetch('/api/hodnoceni/get-average'); 
        const data = await response.json();

        if (data.error) {
            throw new Error(data.error);
        }

        const average = data.average;
        const numberOfRatings = data.count;

        if (numberOfRatings > 0) {
            averageRatingDisplay.textContent = `Průměrné hodnocení: ${average} z 5 hvězdiček (${numberOfRatings} hodnocení)`;

            averageRatingStars.innerHTML = '';
            const fullStars = Math.floor(average);
            const halfStar = average - fullStars >= 0.5;

            for (let i = 0; i < fullStars; i++) {
                averageRatingStars.innerHTML += '&#9733;'; 
            }
            if (halfStar) {
                averageRatingStars.innerHTML += '&#9734;'; 
            }
            for (let i = 0; i < (5 - fullStars - (halfStar ? 1 : 0)); i++) {
                averageRatingStars.innerHTML += '&#9734;'; 
            }
        } else {
            averageRatingDisplay.textContent = 'Zatím nemáme žádná hodnocení.';
            averageRatingStars.innerHTML = '';
        }
    } catch (error) {
        console.error("Chyba při načítání hodnocení: ", error);
        averageRatingDisplay.textContent = 'Chyba při načítání hodnocení: ' + error.message;
        averageRatingStars.innerHTML = '';
    }
}

document.addEventListener('DOMContentLoaded', loadAverageRating);
