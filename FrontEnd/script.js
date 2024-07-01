const apiUrl = "http://localhost:5678/api/works";
fetch(apiUrl)
  .then(response => {
    if (!response.ok) {
      throw new Error("Erreur de réseau ou de serveur: " + response.statusText);
    }
    return response.json();
  })
  .then(data => {
    console.log('OK');
    projectsData = data;
  })
  .catch(error => {
    console.error("Erreur lors de la récupération des données:", error);
  });


const savedProjects = localStorage.getItem('projectsData');
let projectsData = savedProjects ? JSON.parse(savedProjects) : [
  { id: 1, imageUrl: 'http://localhost:5678/images/abajour-tahina1651286843956.png', title: 'Abajour Tahina', categoryId: '1' },
  { id: 2, imageUrl: 'http://localhost:5678/images/appartement-paris-v1651287270508.png', title: 'Appartement Paris V', categoryId: '2' },
  { id: 3, imageUrl: 'http://localhost:5678/images/restaurant-sushisen-londres1651287319271.png', title: 'Restaurant Sushisen - Londres', categoryId: '3' },
  { id: 4, imageUrl: 'http://localhost:5678/images/la-balisiere1651287350102.png', title: 'Villa “La Balisiere” - Port Louis', categoryId: '2' },
  { id: 5, imageUrl: 'http://localhost:5678/images/structures-thermopolis1651287380258.png', title: 'Structures Thermopolis', categoryId: '1' },
  { id: 6, imageUrl: 'http://localhost:5678/images/appartement-paris-x1651287435459.png', title: 'Appartement Paris X', categoryId: '2' },
  { id: 7, imageUrl: 'http://localhost:5678/images/le-coteau-cassis1651287469876.png', title: 'Pavillon “Le coteau” - Cassis', categoryId: '2' },
  { id: 8, imageUrl: 'http://localhost:5678/images/villa-ferneze1651287511604.png', title: 'Villa Ferneze - Isola d’Elba', categoryId: '2' },
  { id: 9, imageUrl: 'http://localhost:5678/images/appartement-paris-xviii1651287541053.png', title: 'Appartement Paris XVIII', categoryId: '2' },
  { id: 10, imageUrl: 'http://localhost:5678/images/bar-lullaby-paris1651287567130.png', title: 'Bar “Lullaby” - Paris', categoryId: '3' },
  { id: 11, imageUrl: 'http://localhost:5678/images/hotel-first-arte-new-delhi1651287605585.png', title: 'Hotel First Arte - New Delhi', categoryId: '3' },
];

//Filtration des projets par catégorie choisie
document.addEventListener("DOMContentLoaded", function () {
  var btnAll = document.getElementById("btnAll");
  var btnObjects = document.getElementById("btnObjects");
  var btnApartments = document.getElementById("btnApartments");
  var btnHotels = document.getElementById("btnHotels");

  if (btnAll) {
      btnAll.addEventListener("click", function() {
          filterImages('all');
      });
  } else {
      console.error("Button with id 'btnAll' not found");
  }

  if (btnObjects) {
      btnObjects.addEventListener("click", function() {
          filterImages(1);
      });
  } else {
      console.error("Button with id 'btnObjects' not found");
  }

  if (btnApartments) {
      btnApartments.addEventListener("click", function() {
          filterImages(2);
      });
  } else {
      console.error("Button with id 'btnApartments' not found");
  }

  if (btnHotels) {
      btnHotels.addEventListener("click", function() {
          filterImages(3);
      });
  } else {
      console.error("Button with id 'btnHotels' not found");
  }
});
  function filterImages(categoryId) {
      console.log('Filtering images by categoryId:', categoryId);
      var gallery = document.querySelector('.gallery');
      gallery.innerHTML = '';

      var filteredImages = projectsData.filter(project => {
          return categoryId === 'all' || project.categoryId === categoryId;
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
      });
  }


// Fermer la 1ere fenêtre modale
function closeModal() {
  modal.style.display = "none";
  document.getElementById('topBorder').style.display = 'none'; // Cacher "la bordure noire"
}
// Fermer la 2eme fenêtre modale
function hideTopBorder() {
  var topBorder = document.getElementById('topBorder');
  topBorder.classList.remove('displayImportant'); //cacher "la bordure noire"
}

function closeAddPhotoModal() {
  addPhotoModal.style.display = "none";
  hideTopBorder();
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

  const addPhotoModal = document.getElementById('addPhotoModal');
  const uploadButton = document.getElementById('uploadButton');
  const modalColumnWrapper = document.getElementById('modalColumnWrapper');



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

  const gallery = document.querySelector('.gallery');

  // Objet Set
  const uniqueCategories = new Set();


  //Création de la galerie 
  projectsData.forEach(project => {
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

  filterImages('all');

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

    if (file && title && categoryId) {
      console.log('Données ont été reçues avec succès');
    } else {
      console.log('Certaines données sont manquantes ou incorrectes');
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
