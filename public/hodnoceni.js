// public/hodnoceni.js

// Funkce pro odeslání hodnocení
async function submitRating() {
    const ratingElement = document.querySelector('input[name="rating"]:checked');
    const reviewText = document.getElementById('reviewText').value;

    if (!ratingElement) {
        alert('Prosím, vyberte počet hvězdiček.');
        return;
    }

    const stars = parseInt(ratingElement.value);

    try {
        // Voláme náš nový API endpoint pro přidání hodnocení
        const response = await fetch('/api/hodnoceni/add', { // URL odpovídá nové API routě
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

// Funkce pro načtení a zobrazení průměrného hodnocení
async function loadAverageRating() {
    const averageRatingDisplay = document.getElementById('averageRatingDisplay');
    const averageRatingStars = document.getElementById('averageRatingStars');

    try {
        // Voláme náš nový API endpoint pro získání průměrného hodnocení
        const response = await fetch('/api/hodnoceni/get-average'); // URL odpovídá nové API routě
        const data = await response.json();

        if (data.error) {
            throw new Error(data.error);
        }

        const average = data.average;
        const numberOfRatings = data.count;

        if (numberOfRatings > 0) {
            averageRatingDisplay.textContent = `Průměrné hodnocení: ${average} z 5 hvězdiček (${numberOfRatings} hodnocení)`;

            // Zobrazení hvězdiček
            averageRatingStars.innerHTML = '';
            const fullStars = Math.floor(average);
            const halfStar = average - fullStars >= 0.5;

            for (let i = 0; i < fullStars; i++) {
                averageRatingStars.innerHTML += '&#9733;'; // Plná hvězdička
            }
            if (halfStar) {
                averageRatingStars.innerHTML += '&#9734;'; // Prázdná hvězdička pro vizuální odlišení poloviční hvězdičky
            }
            for (let i = 0; i < (5 - fullStars - (halfStar ? 1 : 0)); i++) {
                averageRatingStars.innerHTML += '&#9734;'; // Prázdná hvězdička
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

// Načíst průměrné hodnocení při načtení stránky
document.addEventListener('DOMContentLoaded', loadAverageRating);
