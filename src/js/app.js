$(() => {
  let request = {
    restriction: undefined,
    filter: undefined,
    ingredient1: undefined,
    ingredient2: undefined,
    ingredient3: undefined
  };
  const createRequest = () => {

    request.restriction = $('.restriction').text() === 'No restriction' ? undefined : $('.restriction').text();
    request.filter = $('.filter').text() === 'No filter' ? undefined : $('.filter').text();
    request.ingredient1 = $('#ingredient-1').val() === ''? undefined : $('#ingredient-1').val();
    request.ingredient2 = $('#ingredient-2').val() === ''? undefined : $('#ingredient-2').val();
    request.ingredient3 = $('#ingredient-3').val() === ''? undefined : $('#ingredient-3').val();

    requestFetch(request)
  };

  const resetRequest = ()=>{

    Object.keys(request).forEach((key)=> request[key] = undefined);
    $('.fridge').find('.dropdown-menu .show').removeClass('show');
    $('.fridge').find('input').val('');
    $('.restriction').text('No restriction');
    $('.filter').text('No filter')
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


  const openFridge = ()=>{
    const door = $('.door');
    const handle = $('.handle');

    door.on('click', async function () {
      resetRequest();
      handle.addClass('open');

      let handleBack = new Promise(resolve =>setTimeout(()=>resolve( handle.removeClass('open') ),300) );
      let animationEnd = new Promise(resolve =>setTimeout(()=>resolve(),600) );

      await handleBack;
      await animationEnd;

      door.toggleClass('open');
    })
  };
  const requestFetch = request =>{
    const appId = 'fd3ea657';
    const appKey ='a61ca3c11d3b2ec930779e11cfe06c85';
    let query = createQuery();

    let filter = request.filter === undefined ? '' : `&diet=${request.filter.toLowerCase()}`;
    let restriction = request.restriction === undefined ? '' : `&health=${request.restriction.toLowerCase()}`;
    let url = `https://api.edamam.com/search?q=${query}&app_id=${appId}&app_key=${appKey}${filter}${restriction}&from=0&to=100`;
    console.log(filter);
    console.log(restriction);
    console.log(query);
    console.log(url);

    fetch(url,{
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
    let index = castRecipes(data.hits.length);
    drawRecipeData(data, index);
  };

  const castRecipes = (index) => {
    return index <= 5 ? 0 : Math.floor(Math.random()*(index - 4))
  };

  const changeRecipe = (data, index) => {
    drawRecipeData(data, index);

  };

  const drawRecipeData = (data, index) => {
    clearRecipeData();
    //console.log(data);
    let recipe = data.hits[index].recipe;
    let queryHits = data.hits.length <= 5 ? data.hits.length : 5;
    let image = new Image();
    let calories = Math.round(recipe.calories / recipe.yield);

    image.src = recipe.image;
    image.onload = $('.image')
      .append(`<img src='${image.src}' class="card-img-top mx-auto" alt="recipe image">`);

    $('.card-title').text(recipe.label);
    $('.group-info .info-1').text(`Servings: ${recipe.yield}`);
    $('.group-info .info-2').text(`Cal/Serving: ${calories}`);
    $('.index').text(`${index}/5`);
    $('a.btn').attr('href', recipe.url);

    for(let i = 0; i < recipe.ingredients.length ; i++){
      $('.card-body .ingredients')
        .append(`<li>- ${recipe.ingredients[i].text}</li>`)
    }

    $('.btn-prev').one('click', () => {
      if (index > 0){
        index--;
        changeRecipe(data, index)
      }else{
        index = queryHits -1;
        changeRecipe(data, index)
      }
    });
    $('.btn-next').one('click', () => {

      if (index < queryHits - 1){
        index++;
        changeRecipe(data, index)
      }else{
        index = 0;
        changeRecipe(data, index)
      }
    });
  };
  const clearRecipeData = ()=>{
    $('ul.ingredients').empty();
    $('.image').empty();
  };

  openFridge();
  handleSelection();
  $('.search').on('click',createRequest)
});
