// Fonction pour gérer la soumission du formulaire de connexion
    const loginForm = document.querySelector('.login-form'); // Sélection du formulaire de connexion

    loginForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        const emailInput = document.querySelector('#mail');
        const passwordInput = document.querySelector('#password');

        const email = emailInput.value;
        const password = passwordInput.value;

        try {
                const response = await fetch("http://localhost:5678/api/users/login", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 'email': email, 'password': password })
            });

            console.log(response); // Affichage de la réponse du serveur
            if (response.status === 401 || response.status === 404) {
                const errorMessage=document.querySelector('#error-message');
                 errorMessage.classList.remove('hidden'); // Affichage d'un message d'erreur
                 console.log('tonton'); // Affichage de l'erreur dans la console
         }
            if (response.ok) {
                const data = await response.json(); 
                console.log(data); // Affichage des données de réponse

                sessionStorage.setItem('userId', data.userId); // Stockage de l'ID utilisateur dans le sessionStorage
                sessionStorage.setItem('token', data.token); // Stockage du token dans le sessionStorage

                window.location.href = 'index.html'; // Redirection vers la page d'accueil
                }
            }
        catch (error) {
            console.log('Une erreur est survenue, Mot de passe ou email incorrect', (error)); // Affichage de l'erreur dans la console
            const inputMail = document.querySelector('#mail');
            const inputPassword = document.querySelector('#password');

            inputMail.value = ""; // Réinitialisation du champ email
            inputPassword.value = ""; // Réinitialisation du champ mot de passe
        }  
    });
