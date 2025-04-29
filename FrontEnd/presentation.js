let images = []; // Déclaration du tableau vide pour stocker les images

// Fonction qui affiche les images dans la div "gallery"
function displayPictures(images) {
    const container = document.querySelector('#gallery'); 
    container.innerHTML = ''; 

    // Parcours des images et création des éléments img et figure pour chaque URL
    images.forEach((image) => {
        const figure = document.createElement('figure');
        figure.dataset.categoryId = image.categoryId.toString();
        figure.style.width = '305px';

        const img = document.createElement('img'); // Création de l'élément img
        img.src = image.imageUrl;     
        img.alt = image.title;
        img.style.width = '305px';
        img.style.height = '407px';

        const figcaption = document.createElement('figcaption'); // Légende pour chaque image
        figcaption.textContent = image.title; 
        figcaption.style.margin = '5px 0'; 
        
        figure.appendChild(img); 
        figure.appendChild(figcaption); 
        container.appendChild(figure); 
    });
}

// Fonction pour créer les boutons de filtre en fonction des catégories
function createFilterButtons(categories) {
    const container = document.querySelector('.filter-container');  // Sélection de la div qui contiendra les boutons de filtre

    // Création du bouton "Tous" qui n'existe pas dans l'API
    const allButton = document.createElement('button');
    allButton.textContent = "Tous";
    allButton.dataset.id = "0";
    allButton.classList.add('filter-button');
    container.appendChild(allButton);

    // Création des boutons de filtre dynamiquement à partir des catégories
    categories.forEach(category => {
        const button = document.createElement('button');
        button.textContent = category.name;
        button.dataset.id = category.id;
        button.classList.add('filter-button');
        container.appendChild(button);
    });

    // Ajout de l'événement au clic pour chaque bouton
    const buttons = document.querySelectorAll('.filter-button');
    buttons.forEach((button) => {
        button.addEventListener('click', () => {
            const Id = button.dataset.id;
            imageFilter(Id);
            buttons.forEach((btn) => btn.classList.remove('filter-button-selected')); // Retire la classe de sélection
            button.classList.add('filter-button-selected'); // Ajoute la classe de sélection au bouton cliqué
        });
    });
}

// Fonction pour filtrer les images en fonction de la catégorie sélectionnée
function imageFilter(categoryId) {
    if (categoryId === "0") {
        displayPictures(images); // Affiche tout
    } else {
        const filteredImages = images.filter(img => img.categoryId.toString() === categoryId);
        displayPictures(filteredImages);
    }
}

// Fonction pour récupérer les catégories depuis l'API
async function fetchCategories() {
    try {
        const response = await fetch("http://localhost:5678/api/categories", {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            }
        });
        return await response.json(); // Retourne les catégories récupérées
    } catch (error) {
        console.error('Erreur lors du chargement des catégories :', error);
    }
}

// Fonction pour charger les images depuis l'API
async function loadImages() {
    try {
        const response = await fetch("http://localhost:5678/api/works", {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            }
        }); 
        images = await response.json(); // Récupération des images
        displayPictures(images); // Affichage des images

        // Récupération des catégories et création des boutons
        const categories = await fetchCategories();
        if (categories) {
            createFilterButtons(categories); // Création des boutons de filtre
        }
    } catch (error) {
        console.error('Une erreur est survenue :', error);
    }
}

loadImages(); // Appel de la fonction pour charger les images