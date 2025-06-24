 // Déclaration du tableau vide pour stocker les images
let images = [];

// Déclaration d'un objet pour stocker les données de l'API
const apiData = {
    categories: [],
    works: []
};

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

// Fonction pour afficher les images dans la modale
async function displayPicturesModal(images) {
    const modalGallery = document.getElementById('galleryModal'); // Sélection de la galerie dans la modale
    modalGallery.innerHTML = ''; // Réinitialisation du contenu de la galerie modale

     // Parcours des images et création des éléments img et figure pour chaque URL
        images.forEach((image) => {
        let figure = document.createElement('figure');
        figure.setAttribute('data-id', image.id); // Assurez-vous que chaque figure a un attribut data-id correspondant à l'ID de l'image
        figure.style.position = 'relative';

        let img = document.createElement('img'); // Création de l'élément img
        img.src = image.imageUrl;     
        img.alt = image.title;
        img.classList.add('modal-image'); // Ajout d'une classe pour le style

        let trashFigure = document.createElement('div');
        trashFigure.classList.add('trash-figure');
        trashFigure.dataset.id = image.id; // Assurez-vous que chaque figure a un attribut data-id correspondant à l'ID de l'image
        let trashIcon = document.createElement('i');
        trashIcon.classList.add('fa-solid', 'fa-trash-can');
        trashIcon.dataset.id = image.id; // Assurez-vous que chaque icône a un attribut data-id correspondant à l'ID de l'image
        
        figure.appendChild(img); 
        modalGallery.appendChild(figure); 
        figure.appendChild(trashFigure);
        trashFigure.appendChild(trashIcon);

         trashFigure.addEventListener('click', async (event) => {
            event.preventDefault();
            const workId = parseInt(trashFigure.dataset.id);
            await deleteWork(workId);
        });
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
        const data = await response.json(); // Retourne les catégories récupérées
        apiData.categories = data; // Stocke les catégories dans l'objet apiData
        return data; // Retourne les catégories pour utilisation ultérieure
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
        const data = await response.json(); // Récupération des images
        apiData.works = data; // Stockage des images dans l'objet apiData
        displayPictures(data); // Affichage des images
        displayPicturesModal(data); // Affichage des images dans la modale

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

function displayEditInterface(editionBar, editProject) {
     // Cacher la Div des boutons de filtre
        const filterContainer = document.querySelector('.filter-container');
        filterContainer.style.display = 'none';

		// Afficher les éléments si connecté
        const logButton = document.getElementById('log-button');
		editionBar.classList.remove('hidden');
		editProject.classList.remove('hidden');
		logButton.textContent = "Logout";

        editProject.classList.add('edition-mode');
        editProject.id = 'edit-project';
        editProject.innerHTML = `
            <i class="fa-regular fa-pen-to-square" icon-edit-project></i>
			<button id="modal-button">modifier</button>
            `;

        const portfolioHeader = document.querySelector('.portfolio-header');
        portfolioHeader.style.marginBottom = '70px';
        portfolioHeader.appendChild(editProject);

}

// Fonction pour vérifier si l'utilisateur est connecté et afficher le mode edition en haut
function connectedMode() {
	const token = sessionStorage.getItem('token');
	const editionBar = document.getElementById('edition-bar');
	const editProject = document.getElementById('edit-project');

	// Masquer par défaut
	editionBar.classList.add('hidden');
	editProject.classList.add('hidden');

	if (token) {
        displayEditInterface(editionBar, editProject); // Afficher l'interface Modale et la faire disparaître
    }
}

connectedMode();

// Fonction pour gérer la déconnexion
function disconnectionManager() {
    const logItem = document.getElementById('log-button');
    const token = sessionStorage.getItem('token');

    if (token) {
        logItem.textContent = "Logout"; // Change le texte du bouton de connexion
        logItem.href = '#'; // Empêche la redirection vers la page de connexion

        logItem.addEventListener("click", (event) => {
            event.preventDefault();
            sessionStorage.removeItem('token'); // Suppression du token
            window.location.href = 'index.html'; // Redirection vers la page d'accueil
        });
    } else {
        logItem.textContent = "Login"; // Change le texte du bouton de connexion
        logItem.href = 'login.html'; // Redirection vers la page de connexion
    }
}

disconnectionManager(); // Appel de la fonction pour gérer la déconnexion