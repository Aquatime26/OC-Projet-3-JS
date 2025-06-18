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

async function addPicturesToProject() {
    const addPicturesButton = document.getElementById('addPicturesButton');
    const form = document.getElementById('addPicturesForm'); // Remplacer par l’id réel du formulaire

    addPicturesButton.addEventListener('click', async (event) => {
        event.preventDefault();

        const formData = new FormData(form);

        try {
            const response = await fetch('http://localhost:5678/api/works', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error('Erreur lors de l\'ajout des images');
            } else {
                console.log('Image ajoutée avec succès');
            }

        } catch (error) {
            console.error('Erreur lors de l\'ajout des images :', error);
        }
    });
}

addPicturesToProject();