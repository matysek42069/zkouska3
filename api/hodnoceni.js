const FIREBASE_URL = process.env.FIREBASE_PROJECT_ID;

// Funkce pro odeslání hodnocení do Firebase Realtime Database
async function submitRating() {
    const ratingElement = document.querySelector('input[name="rating"]:checked');
    const reviewText = document.getElementById('reviewText').value;

    if (!ratingElement) {
        alert('Prosím, vyberte počet hvězdiček.');
        return;
    }

    const stars = parseInt(ratingElement.value);

    try {
        const response = await fetch(`${FIREBASE_RTDB_URL}/ratings.json`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                stars: stars,
                review: reviewText,
                timestamp: new Date().toISOString() // Ukládáme čas jako ISO string
            })
        });

        if (!response.ok) {
            throw new Error(`Failed to save rating: ${response.statusText}`);
        }

        alert('Hodnocení odesláno!');
        ratingElement.checked = false; // Reset výběru hvězdiček
        document.getElementById('reviewText').value = ''; // Vyčistit textové pole
        loadAverageRating(); // Znovu načíst průměrné hodnocení
    } catch (error) {
        console.error("Chyba při odesílání hodnocení: ", error);
        alert('Došlo k chybě při odesílání hodnocení.');
    }
}

// Funkce pro načtení a zobrazení průměrného hodnocení z Firebase Realtime Database
async function loadAverageRating() {
    const averageRatingDisplay = document.getElementById('averageRatingDisplay');
    const averageRatingStars = document.getElementById('averageRatingStars');

    try {
        const response = await fetch(`${FIREBASE_RTDB_URL}/ratings.json`);

        if (!response.ok) {
            throw new Error(`Failed to fetch ratings: ${response.statusText}`);
        }

        const data = await response.json();

        let totalStars = 0;
        let numberOfRatings = 0;

        // Firebase Realtime Database vrací objekt, ne pole, takže musíme iterovat přes klíče
        if (data) {
            Object.values(data).forEach(rating => {
                if (rating.stars) {
                    totalStars += rating.stars;
                    numberOfRatings++;
                }
            });
        }

        if (numberOfRatings > 0) {
            const average = (totalStars / numberOfRatings).toFixed(1);
            averageRatingDisplay.textContent = `Průměrné hodnocení: ${average} z 5 hvězdiček (${numberOfRatings} hodnocení)`;

            // Zobrazení hvězdiček
            averageRatingStars.innerHTML = '';
            const fullStars = Math.floor(average);
            const halfStar = average - fullStars >= 0.5;

            for (let i = 0; i < fullStars; i++) {
                averageRatingStars.innerHTML += '&#9733;'; // Plná hvězdička
            }
            if (halfStar) {
                averageRatingStars.innerHTML += '&#9734;'; // Poloviční hvězdička (prázdná hvězdička pro vizuální odlišení)
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
        averageRatingDisplay.textContent = 'Chyba při načítání hodnocení.';
        averageRatingStars.innerHTML = '';
    }
}

// Načíst průměrné hodnocení při načtení stránky
document.addEventListener('DOMContentLoaded', loadAverageRating);
