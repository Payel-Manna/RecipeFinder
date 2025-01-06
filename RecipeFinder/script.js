// DOM Elements
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const recipesContainer = document.getElementById('recipes');

// Event Listener for Search Button
searchButton.addEventListener('click', fetchRecipes);

// Fetch recipes based on the search term
function fetchRecipes() {
  const query = searchInput.value.trim(); // Get the search input value
  
  if (!query) {
    alert('Please enter a search term!');
    return;
  }

  // Fetch data from TheMealDB API
  fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`)
    .then(response => response.json())
    .then(data => {
      if (data.meals) {
        displayRecipes(data.meals);
      } else {
        recipesContainer.innerHTML = '<p>No recipes found. Try a different search.</p>';
      }
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      recipesContainer.innerHTML = '<p>Something went wrong. Please try again later.</p>';
    });
}

// Display recipes in the grid
function displayRecipes(recipes) {
  recipesContainer.innerHTML = ''; // Clear previous results

  recipes.forEach(recipe => {
    const recipeCard = document.createElement('div');
    recipeCard.classList.add('recipe-card');

    recipeCard.innerHTML = `
      <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}">
      <h3>${recipe.strMeal}</h3>
      <button class="view-button" data-id="${recipe.idMeal}">View Recipe</button>
    `;

    recipesContainer.appendChild(recipeCard);
  });

  // Add event listeners to all "View Recipe" buttons
  const viewButtons = document.querySelectorAll('.view-button');
  viewButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const recipeId = e.target.getAttribute('data-id');
      viewRecipe(recipeId);
    });
  });
}

// Fetch and display recipe details in a modal
function viewRecipe(id) {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
    .then(response => response.json())
    .then(data => {
      if (data.meals) {
        showRecipeModal(data.meals[0]);
      } else {
        alert('Recipe not found.');
      }
    })
    .catch(error => {
      console.error('Error fetching recipe details:', error);
    });
}

// Show recipe details in a modal
function showRecipeModal(recipe) {
  // Create modal content
  const modalContent = `
    <div class="modal">
      <div class="modal-content">
        <span class="close-button">&times;</span>
        <h2>${recipe.strMeal}</h2>
        <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}">
        <p><strong>Category:</strong> ${recipe.strCategory}</p>
        <p><strong>Instructions:</strong> ${recipe.strInstructions}</p>
      </div>
    </div>
  `;

  // Append modal to the body
  document.body.insertAdjacentHTML('beforeend', modalContent);

  // Add event listener to close the modal
  const closeButton = document.querySelector('.close-button');
  closeButton.addEventListener('click', () => {
    document.querySelector('.modal').remove();
  });

  // Close modal when clicking outside of it
  document.querySelector('.modal').addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
      document.querySelector('.modal').remove();
    }
  });
}
