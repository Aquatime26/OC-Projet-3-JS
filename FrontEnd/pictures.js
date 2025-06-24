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

        if (!nameInput.value.trim()) {
            alert("Veuillez saisir un titre.");
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
                inputFile.value = ''; // Réinitialiser l'input file
                
            } else {
                const errorData = await response.json();
                console.log(`Erreur lors de l'ajout de l'image : ${errorData.message}`);
            }
        } catch (error) {
            console.error('Erreur lors de l\'ajout de l\'image :', error);
            console.log('Une erreur est survenue lors de l\'ajout de l\'image. Veuillez réessayer.');
        }
    });
}