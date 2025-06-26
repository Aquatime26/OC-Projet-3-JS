async function displayModal(){
     const token = sessionStorage.getItem('token');

    if (token) {
        const modalButton = document.getElementById('modal-button');
        const modal = document.getElementById('modal');
        const closerModal = document.querySelectorAll('.closer-modal');
        const modalGalleryWindow = document.getElementById('galleryModalWindow'); // Assurez-vous que cette fenêtre modale existe dans votre HTML
        const addPicturesModal = document.getElementById('addPicturesModal'); // Assurez-vous que cette modale existe dans votre HTML
        const picturesButton = document.getElementById('openPicturesModal'); // Bouton pour ouvrir la modale d'ajout de photos

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

async function displayAddPicturesModal() {
    const addPicturesModal = document.getElementById('addPicturesModal');
    const picturesModalWindow = document.getElementById('picturesModalWindow');
    const modal = document.getElementById('modal');
    const modalGalleryWindow = document.getElementById('galleryModalWindow');

    const categories = await fetchCategories();

    picturesModalWindow.innerHTML = `
        <span id="returnModal" class="return-modal"><i class="fa-solid fa-arrow-left"></i></span>
        <span id="closerAddPicturesModal" class="closer-modal">&times;</span>
        <h2>Ajout photos</h2>
        <form id="addPicturesForm" method="POST" enctype="multipart/form-data">
            <div class="add-pictures-header">
                <i class="fa-regular fa-image"></i>
                <label for="addPicturesInput" class="add-pictures-label">+ Ajouter une photo</label>
                <input id="addPicturesInput" type="file" name="image" accept="image/*" required />
                <p class="imgCaracs">jpg, png : 4mo max</p>
            </div>
            <label for="titlePicture">Titre</label>
            <input type="text" id="titlePicture" name="titlePicture" required>

            <label for="pictureCategory">Catégorie</label>
            <select id="pictureCategory" name="pictureCategory" required>
                <option value=""></option>
                ${categories.map(cat => `<option value="${cat.id}">${cat.name}</option>`).join('')}
            </select>
        </form>
        <button type="submit" class="validationPicturesButton">Valider</button>
    `;

    const closerAddPicturesModal = document.getElementById('closerAddPicturesModal');
    const returnModalButton = document.getElementById('returnModal');
    const fileInput = document.getElementById('addPicturesInput');
    const previewContainer = document.querySelector('.add-pictures-header');
    const validationButton = document.querySelector('.validationPicturesButton');

    // Réinitialisation au clic sur la croix
    closerAddPicturesModal.addEventListener('click', () => {
        addPicturesModal.classList.add('hidden');
        modal.classList.add('hidden');
        modalGalleryWindow.classList.remove('hidden');

        // Réinitialiser entièrement la modale
        displayAddPicturesModal(); // recharge tout
    });

    // Retour à la galerie sans tout réinitialiser
    returnModalButton.addEventListener('click', () => {
        addPicturesModal.classList.add('hidden');
        modalGalleryWindow.classList.remove('hidden');
    });

    // Prévisualisation de l'image
    fileInput.addEventListener('change', () => {
        const file = fileInput.files[0];

        if (file && file.size > 4 * 1024 * 1024) {
            alert("Le fichier est trop volumineux (max 4 Mo).");
            fileInput.value = "";
            return;
        }

        if (file) {
            previewContainer.querySelector('i').style.display = 'none';
            previewContainer.querySelector('.add-pictures-label').style.display = 'none';
            previewContainer.querySelector('.imgCaracs').style.display = 'none';

            let imgPreview = document.createElement('img');
            imgPreview.src = URL.createObjectURL(file);
            imgPreview.style.width = '129px';
            imgPreview.style.height = '100%';
            imgPreview.style.objectFit = 'contain';
            imgPreview.alt = "Prévisualisation de l'image";
            previewContainer.appendChild(imgPreview);

            validationButton.style.backgroundColor = '#1D6154';
            validationButton.style.borderColor = '#1D6154';
            validationButton.style.color = '#FFFEF8';
            validationButton.style.cursor = 'pointer';

            // Appel de la fonction d’envoi
            addPicturesToProject(validationButton);
        }
    });
}

displayAddPicturesModal();

