const apiUrl = "http://localhost:5678/api/works";
let projectsData = [];

//Function pour récuperer des données de l'API
function fetchData() {
  return fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error("Erreur de réseau ou de serveur: " + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      console.log('Données chargées depuis API');
      projectsData = data;
      return data;
    })
    .catch(error => {
      console.error("Erreur lors de la récupération des données:", error);
      throw error;
    });
}
// Fonction pour afficher les projets
function displayImages() {
  const gallery = document.querySelector('.gallery');
  if (gallery) {
    gallery.innerHTML = '';

    projectsData.forEach(project => {
      const figure = document.createElement('figure');
      const img = document.createElement('img');
      img.src = project.imageUrl;
      const figCaption = document.createElement('figcaption');
      figCaption.textContent = project.title;
      figure.appendChild(img);
      figure.appendChild(figCaption);
      gallery.appendChild(figure);
    });
  }
}
// Objet Set
const uniqueCategories = new Set();

//Fonction de déclenchement des boutons de filtre
function initialize() {
  const btnAll = document.getElementById("btnAll");
  const btnObjects = document.getElementById("btnObjects");
  const btnApartments = document.getElementById("btnApartments");
  const btnHotels = document.getElementById("btnHotels");

  if (!btnAll || !btnObjects || !btnApartments || !btnHotels) {
    return;
  }

  //Changement de couleur du bouton lors du clic
  function handleButtonClick(button, categoryId) {
    [btnAll, btnObjects, btnApartments, btnHotels].forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    filterImages(categoryId);
  }

  btnAll.addEventListener("click", function () {
    handleButtonClick(btnAll, 'all');
  });

  btnObjects.addEventListener("click", function () {
    handleButtonClick(btnObjects, 1);
  });

  btnApartments.addEventListener("click", function () {
    handleButtonClick(btnApartments, 2);
  });

  btnHotels.addEventListener("click", function () {
    handleButtonClick(btnHotels, 3);
  });
}

// Filration de projets
function filterImages(categoryId) {
  console.log('Filtraion de projets par categoryId:', categoryId);
  const gallery = document.querySelector('.gallery');
  if (gallery) {
    gallery.innerHTML = '';
    const filteredImages = projectsData.filter(project => {
      return categoryId === 'all' || project.categoryId == categoryId;
    });
    filteredImages.forEach(project => {
      const figure = document.createElement('figure');
      const img = document.createElement('img');
      img.src = project.imageUrl;
      const figCaption = document.createElement('figcaption');
      figCaption.textContent = project.title;
      figure.appendChild(img);
      figure.appendChild(figCaption);
      gallery.appendChild(figure);
      uniqueCategories.add(project.categoryId);
    });
  } else {
  }
}

fetchData()
  .then(() => {
    initialize();
    displayImages();
  })
  .catch(() => {
    console.error("Impossible de charger les données depuis l'API.")
  });

// Fermer la 1ere fenêtre modale
function closeModal() {
  modal.style.display = "none";
}


function closeAddPhotoModal() {
  addPhotoModal.style.display = "none";
}


// Flèche arrière/2eme fenêtre modale
function goBack() {
  var addPhotoModal = document.getElementById("addPhotoModal");
  addPhotoModal.style.display = "none";
  var modal = document.getElementById("modal");
  modal.style.display = "block";
  document.getElementById('topBorder').style.display = 'block';

}



document.addEventListener('DOMContentLoaded', function () {
  console.log('événement DOMContentLoaded a été déclenché');

  const fileInput = document.getElementById('fileInput');
  const titleInput = document.getElementById('title');
  const categorySelect = document.getElementById('category');
  const validerButton = document.getElementById('validateButton');
  const errorMessageDiv = document.getElementById('error-message');

  const addPhotoModal = document.getElementById('addPhotoModal');
  const uploadButton = document.getElementById('uploadButton');
  const modalColumnWrapper = document.getElementById('modalColumnWrapper');

  //login vers logout et les boutons de filtres sont cachés en cas de la connexion
  const isAuthenticated = sessionStorage.getItem('authenticated') === 'true';
  const loginItem = document.getElementById('login');
  const menuContainer = document.getElementById('menuContainer'); 
  const topBorder = document.getElementById('topBorder');

  if (isAuthenticated) {
    loginItem.innerHTML = '<a href="#">logout</a>';
    loginItem.addEventListener('click', function () {
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('authenticated');
      sessionStorage.removeItem('buttonChanged');
      sessionStorage.removeItem('showBorder');
      window.location.reload();
    });
    if (menuContainer) {
      menuContainer.style.display = 'none';
  }
  if (topBorder && sessionStorage.getItem('showBorder') === 'true') {
    topBorder.style.display = 'block';
    sessionStorage.removeItem('showBorder'); 
}
  }
 
  //Bouton Ajouter photo 1 f modale
  uploadButton.addEventListener('click', function () {
    fileInput.click();
  });

  // Affichage d'une photo séléctionnée 2 f modale
  fileInput.addEventListener('change', function () {
    const file = fileInput.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const image = new Image();
        image.src = e.target.result;
        // Supprimer le container
        modalColumnWrapper.innerHTML = '';
        // Ajout photo dans la fenêtre modale
        modalColumnWrapper.appendChild(image);
        toggleValiderButtonColor();
      };
      reader.readAsDataURL(file);
    }
  });



  // Le bouton Modifier est affiché en cas de la connexion//
  const modifierButton = document.querySelector('.js-modal');

  if (sessionStorage.getItem('buttonChanged') === 'true') {
    modifierButton.style.display = 'inline-block';
  } else {
    modifierButton.style.display = 'none';
  }


  var modal = document.getElementById("modal");

  // Afficher une galerie de projets dans une fenêtre modale et d'ajouter la fonctionnalité de suppression de projets
  function displayModalGallery() {
    var modalGallery = document.querySelector('.modal-gallery');
    modalGallery.innerHTML = '';

    projectsData.forEach((project, index) => {
      const figure = document.createElement('figure');

      const img = document.createElement('img');
      img.src = project.imageUrl;
      figure.appendChild(img);

      //Création de l'icône de suppression
      const deleteIconContainer = document.createElement('div');
      deleteIconContainer.className = 'delete-icon-container';

      const deleteIcon = document.createElement('i');
      deleteIcon.className = 'fas fa-trash-alt delete-icon';

      deleteIcon.addEventListener('click', async (event) => {
        event.stopPropagation();
        const response = await fetch(`${apiUrl}/${project.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
          }
        });
        if (!response.ok) {
          throw new Error('Failed to delete project on server');
        }
        figure.remove();
        projectsData.splice(index, 1);
        localStorage.setItem('projectsData', JSON.stringify(projectsData));
        filterImages('all');
        displayModalGallery();
        console.log('Project deleted successfully');
      });

      deleteIconContainer.appendChild(deleteIcon);
      figure.appendChild(deleteIconContainer);
      modalGallery.appendChild(figure);
    });
  }

  // fermer la 1ere fenêtre modale en cliquant sur la croix
  var span = document.querySelector("#modal .close");
  span.onclick = function () {
    closeModal();
  };
  // fermer la 1ere fenêtre modale en cliquant dèhors de la modale
  modal.addEventListener('click', function (event) {
    if (event.target === modal) {
      closeModal();
    }
  });


  // 1ere Fenêtre modale 
  var btnModifier = document.querySelector(".js-modal");
  btnModifier.onclick = function (e) {
    e.preventDefault();
    displayModalGallery();
    modal.style.display = "block";
    document.getElementById('topBorder').style.display = 'block'; // Afficher la bordure noire
  };

  //Ouvrir la 2eme fenêtre modale
  var addPhotoBtn = document.querySelector("#modal-content input[type='submit']");
  addPhotoBtn.onclick = function (e) {
    e.preventDefault();

    var addPhotoModal = document.getElementById("addPhotoModal");
    addPhotoModal.style.display = "block";

    var topBorder = document.getElementById('topBorder'); // Afficher la bordure noire
    topBorder.classList.add('displayImportant');


    // Cacher la 1 fenêtre modale
    modal.style.display = "none";
  };

  // fermer la 2eme fenêtre modale en cliquant sur la croix
  var addPhotoModalCloseBtn = document.querySelector("#addPhotoModal .close");
  addPhotoModalCloseBtn.onclick = function () {
    closeAddPhotoModal();
  };

  // fermer la 2eme fenêtre modale
  window.onclick = function (event) {
    var addPhotoModal = document.getElementById("addPhotoModal");
    if (event.target == addPhotoModal) {
      closeAddPhotoModal();
    }
  };


  // Changement de couleur de la bouton Valider
  function toggleValiderButtonColor() {
    const isFileSelected = fileInput.files.length > 0;

    const isTitleFilled = titleInput.value.trim() !== '';
    const isCategorySelected = categorySelect.value !== '';


    if (isFileSelected && isTitleFilled && isCategorySelected) {
      validerButton.style.backgroundColor = '#1D6154';
      validerButton.style.color = 'white';
    } else {
      validerButton.style.backgroundColor = '';
      validerButton.style.color = '';

    }
  }


  fileInput.addEventListener('change', toggleValiderButtonColor);
  titleInput.addEventListener('input', toggleValiderButtonColor);
  categorySelect.addEventListener('change', toggleValiderButtonColor);

  toggleValiderButtonColor();
  filterImages('all');

  //Gestion de l'événement "click" du bouton "Valider"
  validerButton.addEventListener('click', function (eventData) {
    eventData.preventDefault();

    const file = fileInput.files[0];
    const title = titleInput.value.trim();
    const categoryId = categorySelect.value;

    if (!file || !title || !categoryId) {
      errorMessageDiv.textContent = "Veuillez remplir tous les champs avant de valider.";
      errorMessageDiv.style.display = 'block';
      return; // Не отправляем форму, если она не заполнена полностью
    } else {
      errorMessageDiv.style.display = 'none'; // Скрываем сообщение об ошибке, если все поля заполнены
    }

    const formData = new FormData();
    formData.append('image', file);
    formData.append('title', title);
    formData.append('category', categoryId);

    //Envoi des données au serveur
    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
      },
      body: formData
    })
      .then(response => response.json())
      .then(data => {
        ///
        console.log('Server response:', data);
        if (!data || !data.id || !data.imageUrl || !data.title || !data.categoryId) {
          console.error('Invalid response from server: Missing data fields');
          if (!data) console.error('No data received from server');
          if (!data.id) console.error('Missing id');
          if (!data.imageUrl) console.error('Missing imageUrl');
          if (!data.title) console.error('Missing caption');
          if (!data.categoryId) console.error('Missing category');
          throw new Error('Invalid response from server');
        }
        alert("Nouveau projet a été ajouté");
        closeAddPhotoModal();
        console.log('Project uploaded successfully:', data);

        //Ajout du nouveau projet
        const newProject = {
          id: data.id,
          imageUrl: data.imageUrl,
          title: data.title,
          categoryId: data.category
        };

        projectsData.push(newProject);
        localStorage.setItem('projectsData', JSON.stringify(projectsData));
        filterImages('all');
        displayModalGallery();

        fileInput.value = '';
        titleInput.value = '';
        categorySelect.value = '';

        modalColumnWrapper.innerHTML = `<i class="fa-regular fa-image icon"></i>
        <button type="button" id="uploadButton">+ Ajouter photo</button> <h4>jpg, png : 4mo max</h4>`;
        document.getElementById('uploadButton').addEventListener('click', function () {
          fileInput.click();
        });
        toggleValiderButtonColor();
        closeAddPhotoModal();
        modal.style.display = "block";
        document.getElementById('topBorder').style.display = 'block';
      })
      .catch(error => {
        console.error('Error uploading project:', error);
      });
  });
});
