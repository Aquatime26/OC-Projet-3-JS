let images = []; // Je déclare un tableau vide pour stocker les images//

// Fonction qui affiche les images dans la div "gallery"//
function displayPictures(images) {
    const container = document.querySelector('#gallery'); // la div "gallery" devient le conteneur des images//
    container.innerHTML = ''; // Je vide le précédent contenu HTML de la div gallery//

    // Je parcours tous les URL d'images et je crée des éléments img et figure pour chaque URL//
    images.forEach((image) => {
        const figure = document.createElement('figure');
        figure.dataset.categoryId = image.categoryId.toString(); // Je crée une figure pour chaque image//
        figure.style.width = '305px';

        const img = document.createElement('img'); // Je crée un élément img pour chaque image//
        img.src = image.imageUrl;     
        img.alt = image.title;
        img.style.width = '305px';
        img.style.height = '407px';

        const figcaption = document.createElement('figcaption'); // Je crée une légende pour chaque image//
        figcaption.textContent = image.title;   // Je mets le titre de l'image dans la légende//
        figcaption.style.margin = '5px 0'; // Je mets une marge de 5px en haut et en bas de la légende//
        
        figure.appendChild(img); // J'ajoute l'image à la figure//
        figure.appendChild(figcaption); // J'ajoute la légende à la figure//
        container.appendChild(figure); // J'ajoute la figure au conteneur//
    });
}

// Fonctions pour créer des filtres//

async function createFilterButtons() {
    const response = await fetch("http://localhost:5678/api/categories");
    const categories = await response.json();

    const container = document.querySelector('.filter-container');
    container.innerHTML = '';

    const allButton = document.createElement('button');
    allButton.textContent = "Tous";
    allButton.dataset.id = "0";
    allButton.classList.add('filter-button');
    container.appendChild(allButton);

    categories.forEach(category => {
        const button = document.createElement('button');
        button.textContent = category.name;
        button.dataset.id = category.id;
        button.classList.add('filter-button');
        container.appendChild(button);
    });

    buttonFilter(); // Réactive les événements sur les nouveaux boutons
}

function imageFilter(categoryId) {
    const imagesgallery = document.querySelector('#gallery');
    const imagesElements = imagesgallery.children;

    Array.from(imagesElements).forEach((imageElement) => {
        const imageCategoryId = imageElement.dataset.categoryId;

        if (categoryId === "0" || imageCategoryId === categoryId) {
            imageElement.style.display = 'block';
        } else {
            imageElement.style.display = 'none';
        }
    });
}

function buttonFilter() {
    const buttons = document.querySelectorAll('.filter-button');
    buttons.forEach((button) => {
        button.addEventListener('click', () => {
            const categoryId = button.dataset.id;
            imageFilter(categoryId);
        });
    });
}

// function imageFilter(category) {
//     const imagesgallery = document.querySelector('#gallery'); // Je sélectionne la div gallery//
//     const imagesElements = imagesgallery.children; // Je sélectionne tous les enfants de la div gallery//
//     Array.from(imagesElements).forEach((imageElement) => { // Je parcours tous les enfants de la div gallery//
//         const imageCategoryId = imageElement.dataset.category.id; // Je récupère l'ID de la catégorie de chaque image//
//         if (imageCategoryId === category) { // Si le filtre est "Tous" ou si l'ID de la catégorie correspond au filtre//
//             imageElement.style.display = 'block'; // J'affiche l'image//
//         } else {
//             imageElement.style.display = 'none'; // Sinon, je cache l'image//
//         }
//     })
    // if (category === 'Tous') {
    //     displayPictures(images); // Si le filtre est "Tous", j'affiche toutes les images//
    // } else { // Sinon, je filtre les images par catégorie//
    //     const filteredImages = images.filter((image) => image.category.name === category); // Je filtre les images par catégorie//
    //     displayPictures(filteredImages); // J'affiche les images filtrées//
    // }
// }

// Fonction pour attribuer les filtres ci-dessus aux boutons de ma page//
// function buttonFilter() {
//     const buttons = document.querySelectorAll('.filter-button'); // Je sélectionne tous les boutons de filtre//
//     buttons.forEach((button) => {
//         button.addEventListener('click', () => { // J'ajoute un écouteur d'événement sur chaque bouton//
//             const category = button.textContent; // Je récupère le texte du bouton (le nom de la catégorie)//
//             imageFilter(category); // J'appelle la fonction imageFilter pour filtrer les images par catégorie//
//         });
//     });
// }

// Fonction qui attend la réponse de mon API pour charger les images//
async function loadImages() {
    try {
        const response = await fetch("http://localhost:5678/api/works", { // Je fais une requête sur l'API pour récupérer les images//
            method: "GET", // Je précise que je veux récupérer des données//
            headers: {
                'Content-Type': 'application/json', // Je précise que le contenu est en JSON//
            }
        }); 

        images = await response.json(); // Je convertis la réponse en JSON//
        displayPictures(images); // J'appelle la fonction afficherImages pour afficher les images dans la div gallery//
        buttonFilter(); // J'appelle la fonction buttonFilter pour ajouter les filtres//
    } catch (error) {
        console.error('Une erreur est survenue :', error);  // Je gère les erreurs de la requête//
    }
}

loadImages(); // J'appelle la fonction pour charger les images//
createFilterButtons(); // J'appelle la fonction pour créer les filtres//