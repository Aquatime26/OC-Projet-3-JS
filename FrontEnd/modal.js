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

            const addPicturesButton = getElementById('addPicturesButton')
            
            addPicturesButton.addEventListener('click', async (event) => {
                event.preventDefault();
                addPicturesToProject();
            });

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