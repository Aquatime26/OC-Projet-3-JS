async function displayModal(){
     const token = sessionStorage.getItem('token');

    if (token) {
        const modalButton = document.getElementById('modal-button');
        const modal = document.getElementById('modal');
        const closerModal = document.querySelectorAll('.closer-modal');
        const modalGalleryWindow = document.getElementById('galleryModalWindow'); // Assurez-vous que cette fenêtre modale existe dans votre HTML
        const addPicturesModal = document.getElementById('addPicturesModal'); // Assurez-vous que cette modale existe dans votre HTML
        const picturesButton = document.getElementById('openPicturesModal'); // Bouton pour ouvrir la modale d'ajout de photos
        const returnModalButton = document.getElementById('returnModal'); // Bouton pour revenir à la modale principale

        modalButton.addEventListener('click', () => {
            modal.classList.remove('hidden');
    });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.add('hidden');
                addPicturesModal.classList.add('hidden'); // Ferme la modale d'ajout de photos si elle est ouverte
                modalGalleryWindow.classList.remove('hidden'); // Revenir à la fenêtre modale principale
            }
        });

        closerModal.forEach(button => {
            button.addEventListener('click', () => {
                modal.classList.add('hidden');
                addPicturesModal.classList.add('hidden');
                modalGalleryWindow.classList.remove('hidden'); // Revenir à la fenêtre modale principale
            });
        });

        if (picturesButton && addPicturesModal) {

            picturesButton.addEventListener('click', () => {
                addPicturesModal.classList.remove('hidden');
                modalGalleryWindow.classList.add('hidden'); // cacher la première modale quand on ouvre la seconde
            });

                returnModalButton.addEventListener('click', () => {
                    addPicturesModal.classList.add('hidden');
                    modalGalleryWindow.classList.remove('hidden'); // revenir à la première modale
            });
        }
    } 
    else {
        const logButton = document.getElementById('log-button');
        logButton.textContent = "Login";
        const categories = await fetchCategories();
        if (categories) {
            createFilterButtons(categories);
        }
    }
}

displayModal();

// Fonction pour afficher dynamiquement le contenu HTML de la modale d'ajout d'images
async function displayAddPicturesModal() {
    const addPicturesModal = document.getElementById('addPicturesModal');
    const picturesModalWindow = document.getElementById('picturesModalWindow');

     const categories = await fetchCategories(); // On attend la récupération

    picturesModalWindow.innerHTML = `
        <span id="returnModal" class="return-modal"><i class="fa-solid fa-arrow-left"></i></span>
        <span id="closerAddPicturesModal" class="closer-modal">&times;</span>
        <h2>Ajout photos</h2>
        <form action="http://localhost:5678/api/works" id="addPicturesForm" method="POST" enctype="multipart/form-data">
            <div class="add-pictures-header">
                <i class="fa-regular fa-image"></i>

                <input id="addPicturesInput" type="file" name="image" accept="image/*" required>
                <label for="addPicturesInput" class="add-pictures-label">+ Ajouter une photo</label>

                <p class="imgCaracs">jpg.png : 4mo max</p>
            </div>
            <label for="titlePicture">Titre</label>
            <input type="text" id="titlePicture" name="titlePicture" required>

            <label for="pictureCategory">Catégorie</label>
            <select id="pictureCategory" name="pictureCategory" required>
                <option value=""></option>
                ${  apiData.categories.map(category => `
                    <option value="${category.id}">${category.name}</option>
                `).join('')}
            </select>
        </form>
        <button type="submit" class="validationPicturesButton">Valider</button>
    `;

     // Ajout des gestionnaires d'événements après l'injection HTML
    const closerAddPicturesModal = document.getElementById('closerAddPicturesModal');
    const returnModalButton = document.getElementById('returnModal');
    const modal = document.getElementById('modal');
    const modalGalleryWindow = document.getElementById('galleryModalWindow');
    const fileInput = document.getElementById('addPicturesInput');
    const previewContainer = document.querySelector('.add-pictures-header');

    closerAddPicturesModal.addEventListener('click', () => {
        addPicturesModal.classList.add('hidden'); // Masquer la modale d'ajout photo
        modal.classList.add('hidden');
        modalGalleryWindow.classList.remove('hidden'); // Revenir à la fenêtre modale principale
        fileInput.value = ""; // Réinitialiser l'input de fichier
        previewContainer.innerHTML = `
            <i class="fa-regular fa-image"></i>
            <label for="addPicturesInput" class="add-pictures-label">+ Ajouter une photo</label>
            <p class="imgCaracs">jpg, png : 4mo max</p>
        `; // Réinitialiser la prévisualisation
    });

    returnModalButton.addEventListener('click', () => {
        addPicturesModal.classList.add('hidden'); // Masquer la modale d'ajout photo
        document.getElementById('galleryModalWindow').classList.remove('hidden');
    });

    // Gestionnaire d'événement pour le bouton de validation
    const validationButton = document.querySelector('.validationPicturesButton');

   fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];

        if (file && file.size > 4 * 1024 * 1024) {
            alert("Le fichier est trop volumineux (max 4 Mo). Veuillez choisir un fichier plus léger.");
            fileInput.value = "";
            return;
        }

        if (file) {
            // Supprime seulement l'icône et le texte (pas l'input ni le label)
            previewContainer.querySelector('i.fa-regular.fa-image').style.display = 'none';
            previewContainer.querySelector('.add-pictures-label').style.display = 'none';
            previewContainer.querySelector('.imgCaracs').style.display = 'none';

            // Crée et affiche la prévisualisation
            let imgPreview = previewContainer.querySelector('img');
            if (!imgPreview) {
                imgPreview = document.createElement('img');
                previewContainer.appendChild(imgPreview);
            }
            imgPreview.src = URL.createObjectURL(file);
            imgPreview.style.width = '129px';
            imgPreview.style.height = '100%';
            imgPreview.style.objectFit = 'contain';
            imgPreview.alt = "Prévisualisation de l'image";

            validationButton.style.backgroundColor = '#1D6154';
            validationButton.style.borderColor = '#1D6154';
            validationButton.style.color = '#FFFEF8';
            validationButton.style.cursor = 'pointer';

            addPicturesToProject(validationButton); // Appel de la fonction pour ajouter des images en cliquant sur le bouton de validation
        }
    });
}

displayAddPicturesModal();

