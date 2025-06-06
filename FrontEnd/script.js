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
    allButton.classList.add('filter-button'); // Classe pour le bouton "Tous"
    allButton.classList.add('filter-button-selected'); // Classe pour le bouton "Tous"
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
            imageFilter(button.dataset.id);
            buttons.forEach((btn) => btn.classList.remove('filter-button-selected')); // Retire la classe de sélection
            button.classList.add('filter-button-selected'); // Ajoute la classe de sélection au bouton cliqué
        });
    });
}

// Fonction pour filtrer les images en fonction de la catégorie sélectionnée
function imageFilter(categoryId) {
    const allImages = document.querySelectorAll('#gallery figure'); // Sélection de toutes les images

    allImages.forEach((img) => {
        console.log(img);
        if (categoryId === "0") {
            img.classList.remove("hidden"); // Affiche toutes les images
        } else if (img.dataset.categoryId === categoryId) {
            img.classList.remove("hidden"); // Affiche les images de la catégorie sélectionnée
        } else {
            img.classList.add("hidden"); // Cache les images qui ne correspondent pas à la catégorie sélectionnée
        }
    })
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

        // Gestion des erreurs 401 et 404
        if (response.status === 401) {
            throw new Error("Erreur 401 : Accès non autorisé.");
        } else if (response.status === 404) {
            throw new Error("Erreur 404 : Ressource non trouvée.");
        }
        
    } catch (error) {
        console.error('Une erreur est survenue :', error);
    }
}

loadImages(); // Appel de la fonction pour charger les images

// Fonction pour vérifier si l'utilisateur est connecté
async function checkConnected() {
    const token = sessionStorage.getItem('token'); // Récupération du token depuis le sessionStorage
    const logButton = document.getElementById('log-button'); // Sélection du bouton de connexion

    if (token) {
        const editionBar = document.getElementById('edition-bar'); // Sélection de la barre d'édition
        editionBar.classList.remove('hidden'); // Affiche la barre d'édition si l'utilisateur est connecté

        const editProject = document.getElementById('edit-project'); // Sélection du bouton "Modifier les projets"
        editProject.classList.remove('hidden'); // Affiche le bouton "Modifier les projets"

        logButton.textContent = "Logout"; // Change le texte du bouton de connexion
    }
    else {
        // Récupération des catégories et création des boutons
        logButton.textContent = "Login";
        const categories = await fetchCategories();
        if (categories) {
            createFilterButtons(categories); // Création des boutons de filtre
        }
    }
}

// Fonction pour gérer la déconnexion de l'utilisateur
function logOut() {
    const logItem = document.getElementById('log-button');
    const token = sessionStorage.getItem('token');

    if (token) {
        logItem.textContent = "Logout"; // Change le texte du bouton de connexion
        logItem.href = '#'; // Empêche la redirection vers la page de connexion

        logItem.addEventListener("click", (event) => {
            event.preventDefault();
            const confirmed = window.confirm("Êtes-vous sûr de vouloir vous déconnecter ?");
            if (confirmed) {
                sessionStorage.removeItem('token'); // Suppression du token
                window.location.href = 'index.html'; // Redirection vers la page d'accueil
            }
        });
    } else {
        logItem.textContent = "Login"; // Change le texte du bouton de connexion
        logItem.href = 'login.html'; // Redirection vers la page de connexion
    }
}

// Fonction pour ouvrir une fenêtre modale
function initializeModal() {
    const modalButton = document.getElementById('modal-button'); // Sélection du bouton d'ouverture de la modale
    const modal = document.getElementById('modal'); // Sélection de la fenêtre modale

    modalButton.addEventListener('click', () => {
        modal.classList.remove('hidden'); // Affiche la modale
    });

    modal.addEventListener('click', (e) => {
        const modalWindow = document.querySelector('.modal-window')
        if (!modalWindow.contains(e.target)) {
            modal.classList.add('hidden'); // Cache la modale si on clique en dehors
        }
    });
}

const test=checkConnected().then(() => {
    logOut();
    initializeModal(); 
}); 

console.log(test);