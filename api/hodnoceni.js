function submitRating() {
    const rating = document.querySelector('input[name="rating"]:checked');
    const reviewText = document.getElementById('reviewText').value;

    if (!rating) {
        alert('Prosím, vyberte počet hvězdiček.');
        return;
    }

    db.collection("ratings").add({
        stars: parseInt(rating.value),
        review: reviewText,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(() => {
        alert('Hodnocení odesláno!');
        document.querySelector('input[name="rating"]:checked').checked = false; // Reset výběru hvězdiček
        document.getElementById('reviewText').value = ''; // Vyčistit textové pole
        loadAverageRating(); // Znovu načíst průměrné hodnocení
    })
    .catch((error) => {
        console.error("Chyba při odesílání hodnocení: ", error);
        alert('Došlo k chybě při odesílání hodnocení.');
    });
}

// Funkce pro načtení a zobrazení průměrného hodnocení
function loadAverageRating() {
    db.collection("ratings").get()
    .then((querySnapshot) => {
        let totalStars = 0;
        let numberOfRatings = 0;

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            if (data.stars) {
                totalStars += data.stars;
                numberOfRatings++;
            }
        });

        const averageRatingDisplay = document.getElementById('averageRatingDisplay');
        const averageRatingStars = document.getElementById('averageRatingStars');

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
                averageRatingStars.innerHTML += '&#9734;'; // Poloviční hvězdička (může být i jiný symbol nebo obrázek)
            }
             for (let i = 0; i < (5 - fullStars - (halfStar ? 1 : 0)); i++) {
                averageRatingStars.innerHTML += '&#9734;'; // Prázdná hvězdička
            }


        } else {
            averageRatingDisplay.textContent = 'Zatím nemáme žádná hodnocení.';
            averageRatingStars.innerHTML = '';
        }
    })
    .catch((error) => {
        console.error("Chyba při načítání hodnocení: ", error);
        averageRatingDisplay.textContent = 'Chyba při načítání hodnocení.';
        averageRatingStars.innerHTML = '';
    });
}

// Načíst průměrné hodnocení při načtení stránky
document.addEventListener('DOMContentLoaded', loadAverageRating);
