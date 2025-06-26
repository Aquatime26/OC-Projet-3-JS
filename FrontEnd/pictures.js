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


// Une fonction pour supprimer une image
async function deleteWork(id) {
    const confirmationremove = confirm('Êtes-vous sûr de vouloir supprimer cette image ?');
    if (!confirmationremove) return;

    try {
        const response = await fetch(`http://localhost:5678/api/works/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            }
        });

        if (response.ok) {
            console.log('Image supprimée avec succès.');
        }

        if (response.status === 401) {
            alert('Vous ne pouvez pas supprimer cette image.');
            return;
        }

        if (!response.ok) {
            throw new Error('Erreur lors de la suppression de l\'image');
        }

        // Mise à jour locale
        apiData.works = apiData.works.filter(work => work.id !== id);
        // Suppression visuelle
        document.querySelector(`figure[data-id="${id}"]`)?.remove();

       loadImages(); // Recharger les images pour mettre à jour l'affichage

    } catch (error) {
        console.error('Erreur lors de la suppression de l\'image :', error);
    }
}


// Fonction pour ajouter des images à la galerie
async function addPicturesToProject(validationButton) {
    const inputFile = document.getElementById('addPicturesInput');
    const form = document.getElementById('addPicturesForm');
    const nameInput = document.getElementById('titlePicture');
    const categorySelect = document.getElementById('pictureCategory');
    const previewContainer = document.querySelector('.add-pictures-header');

    validationButton.addEventListener('click', async (e) => {
        e.preventDefault();

        const file = inputFile.files[0];

        const title = nameInput.value.trim();
        const titleRegex = /^[A-Z][\p{L}\p{N}\p{P}\p{S} ]{4,}$/u;

        if (!titleRegex.test(title)) {
        alert("Le titre doit commencer par une majuscule et contenir au moins 5 caractères.");
        return;
        }

        if (!categorySelect.value) {
            alert("Veuillez sélectionner une catégorie.");
            return;
        }

        if (file.size > 4 * 1024 * 1024) {
            alert("Le fichier est trop volumineux (max 4 Mo).");
            return;
        }

        const formData = new FormData();
        formData.append('image', file);
        formData.append('title', nameInput.value);
        formData.append('category', categorySelect.value);

        try {
            const response = await fetch('http://localhost:5678/api/works', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                },
                body: formData,
            });

            if (response.ok) {
                console.log('Image ajoutée avec succès.');
                loadImages(); // Recharger les images pour mettre à jour l'affichage

                const addPicturesModal = document.getElementById('addPicturesModal');
                const modal = document.getElementById('modal');
                const modalGalleryWindow = document.getElementById('galleryModalWindow');

                addPicturesModal.classList.add('hidden'); // Masquer la modale d'ajout photo
                modal.classList.add('hidden'); // Masquer la modale principale
                modalGalleryWindow.classList.remove('hidden'); // Revenir à la fenêtre modale principale

                // Réinitialiser le formulaire
                form.reset();
                previewContainer.innerHTML = `
                    <i class="fa-regular fa-image"></i>
                    <label for="addPicturesInput" class="add-pictures-label">+ Ajouter une photo</label>
                    <input type="file" id="addPicturesInput" class="add-pictures-input" accept="image/*" required />
                    <p class="add-pictures-text">jpg, png : 4mo max</p>
                `;               
            } else {
                const errorData = await response.json();
                console.error(`Erreur lors de l'ajout de l'image : ${errorData.message}`);
            }
        } catch (error) {
            console.error('Erreur lors de l\'ajout de l\'image :', error);
        }
    });
}