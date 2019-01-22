$(() => {
  let request = {
    restriction: undefined,
    filter: undefined,
    ingredient1: undefined,
    ingredient2: undefined,
    ingredient3: undefined
  };
  const createRequest = () => {

    request.restriction = $('.restriction').text() === 'No Filter' ? undefined : $('.restriction').text();
    request.filter = $('.filter').text() === 'No filter' ? undefined : $('.filter').text();
    request.ingredient1 = $('#ingredient-1').val() === ''? undefined : $('#ingredient-1').val();
    request.ingredient2 = $('#ingredient-2').val() === ''? undefined : $('#ingredient-2').val();
    request.ingredient3 = $('#ingredient-3').val() === ''? undefined : $('#ingredient-3').val();

    requestFetch(request);
    openFridge();
  };

  const resetRequest = ()=>{

    Object.keys(request).forEach((key)=> request[key] = undefined);
    $('.fridge').find('.dropdown-menu .show').removeClass('show');
    $('.fridge').find('input').val('');
    $('.restriction').text('No filter');
    $('.filter').text('No filter')
  };

  const drawRequest = () => {
    openFridge();
    resetRequest();
    let ingredients = ['potato', 'salad', 'steak', 'tuna', 'salmon', 'cod', 'shrimps', 'rocket', 'spinach', 'onion', 'mushroom', 'leek', 'pumpkin', 'peas', 'bean', 'beans', 'cucumber', 'zucchini', 'garlic', 'broccoli', 'cauliflower', 'capers', 'carrot', 'beetroot', 'cabbage', 'asparagus', 'avocado', 'eggplant', 'rice', 'oats', 'buckwheat', 'black beans', 'chickpeas', 'millet', 'lentil', 'chicken', 'beef', 'turkey', 'duck', 'breast', 'pork', 'ham', 'mutton', 'chops', 'milk', 'cream', 'cheddar', 'yogurt', 'cottage', 'butter', 'mango', 'strawberry', 'orange', 'lemon', 'lime', 'coconut', 'banana', 'peach', 'olive', 'almonds', 'sesame', 'walnuts'];
    let drawnIngredient = ingredients[Math.floor(Math.random() * ingredients.length)];

    request.ingredient1 = drawnIngredient;
    requestFetch(request);
  };

  const handleSelection = ()=> {

    $('a.dropdown-item').on('click', function () {
      $(this).parent().prev().text($(this).text())
    });

    $('.fa-times-circle').on('click', function () {
      $(this).prev().val('');

      request.ingredient1 = this.previousElementSibling.id.includes('1') ? undefined : request.ingredient1;
      request.ingredient2 = this.previousElementSibling.id.includes('2') ? undefined : request.ingredient2;
      request.ingredient3 = this.previousElementSibling.id.includes('3') ? undefined : request.ingredient3;
    })
  };




  const openFridge = async ()=>{
    const door = $('.door');
    const handle = $('.handle');

    resetRequest();
    handle.addClass('open');

    let handleBack = new Promise(resolve =>setTimeout(()=>resolve( handle.removeClass('open') ),300) );
    let animationEnd = new Promise(resolve =>setTimeout(()=>resolve(),600) );

    await handleBack;
    await animationEnd;

    door.toggleClass('open');

  };


  const requestFetch = request =>{

    const appId = 'fd3ea657';
    const appKey ='a61ca3c11d3b2ec930779e11cfe06c85';
    let query = createQuery();

    let filter = request.filter === undefined ? '' : `&diet=${request.filter.toLowerCase()}`;
    let restriction = request.restriction === undefined ? '' : `&health=${request.restriction.toLowerCase()}`;
    let url = `https://api.edamam.com/search?q=${query}&app_id=${appId}&app_key=${appKey}${filter}${restriction}&from=0&to=100`;

    fetch(url,{
      cache: "no-store",
      mode: 'cors',
      redirect: 'follow',
      headers: {
        'Accept-Encoding': 'gzip',
      }
    }).then(resp => resp.json())
      .then(data =>{
        console.log(data);
        createRecipeCard(data);
      })
      .catch(err => console.log(err))


  };

  const createQuery = () => {
    let array = [];
    let result ='';
    if( request.ingredient1 !== undefined) {array.push(request.ingredient1)}
    if( request.ingredient2 !== undefined) {array.push(request.ingredient2)}
    if( request.ingredient3 !== undefined) {array.push(request.ingredient3)}
    if (array.length === 3){ result = `${array[0]}+${array[1]}+${array[2]}`}
    if (array.length === 2){ result = `${array[0]}+${array[1]}`}
    if (array.length === 1){ result = `${array[0]}`}
    return result
  };

  const createRecipeCard = data => {

    let length = data.hits.length > 5 ? 5 : data.hits.length;
    let index = 0;
    let maxIndex = index + length - 1;
    let recipeIndex = castRecipes(data.hits.length);
    if (data.hits.length === 0){
      alert("oops, coudnt find anything")
    } else{
      drawRecipeData(data, index, maxIndex,recipeIndex);
    }
  };
  const animateCard = () => {
    $('.card').removeClass('animate');
    setTimeout(function() {$('.card').addClass('animate')},10);
  };

  const castRecipes = (length) => {
    return length <= 5 ? 0 : Math.floor(Math.random()*(length - 4))
  };

  const changeRecipe = (data, index, maxIndex, recipeIndex) => {
    drawRecipeData(data, index, maxIndex, recipeIndex);

  };

  const drawRecipeData = (data, index, maxIndex, recipeIndex) => {

    let recipe = data.hits[recipeIndex + index].recipe;
    let image = new Image();
    let calories = Math.round(recipe.calories / recipe.yield);
    let recipeNumber = index + 1;

    const card = $('.card');

    $('.btn-prev').off();
    $('.btn-next').off();
    clearRecipeData();

    let display = new Promise(resolve => {

      card.css('display', 'block');
      resolve()

    });
    display.then( animateCard() );


    image.src = recipe.image;
    image.onload = $('.card-image').css('background-image', `url(${image.src})`);

    $('.card-title').text(recipe.label);
    $('.group-info .info-1').text(`Servings: ${recipe.yield}`);
    $('.group-info .info-2').text(`Cal/Serving: ${calories}`);
    $('.index').text(`${recipeNumber}/${data.hits.length > 5 ? 5 :data.hits.length}`);
    $('.card a.btn').attr('href', recipe.url);

    for(let i = 0; i < recipe.ingredients.length ; i++){
      $('.card-body .ingredients')
        .append(`<li>- ${recipe.ingredients[i].text}</li>`)
    }

    if(data.hits.length > 1) {
      console.log('aaa');
      $('.btn-prev').on('click', () => {

        if (index > maxIndex - 4) {
          index--;
          changeRecipe(data, index, maxIndex,recipeIndex)
        } else {
          index = maxIndex;
          changeRecipe(data, index, maxIndex,recipeIndex)
        }
      });
      $('.btn-next').on('click', () => {
        if (index < maxIndex) {
          index++;
          recipeNumber++;
          changeRecipe(data, index, maxIndex,recipeIndex)
        } else {
          recipeNumber = 1;
          index = maxIndex - 4;
          changeRecipe(data, index, maxIndex,recipeIndex)
        }
      });
    }
  };
  const clearRecipeData = ()=>{
    $('ul.ingredients').empty();
  };

  handleSelection();
  $('.search').on('click',createRequest);
  $('.lucky').on('click',drawRequest);
  $('.door').on('click', openFridge);
});
