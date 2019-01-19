$(() => {
  let obj = {
    restriction: '',
    filter: '',
    ingredient1: '',
    ingredient2: '',
    ingredient3: ''
  };
  let request = new Map(Object.entries(obj));
  const createRequest = () => {
  };
  const resetRequest = ()=>{
    request.forEach((value, key, map) => map.set(key, ''));

    $('.fridge').find('.dropdown-menu .show').removeClass('show');
    $('.fridge').find('input').val('');
  };

  const handleSelection = ()=> {
    
    $('a.dropdown-item').on('click', function () {
      $(this).parent().prev().text($(this).text())
    });
    
    $('.fa-times-circle').on('click', function () {
      $(this).prev().val('');

      request.set('ingredient1', this.previousElementSibling.id.includes('1') ? '' : request.get('ingredient1') );
      request.set('ingredient2', this.previousElementSibling.id.includes('2') ? '' : request.get('ingredient2') );
      request.set('ingredient3', this.previousElementSibling.id.includes('3') ? '' : request.get('ingredient3') );
      console.log(request);
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
  const basicFetch = ()=>{
    const appId = 'fd3ea657';
    const appKey ='a61ca3c11d3b2ec930779e11cfe06c85';

    fetch(`https://api.edamam.com/search?q=chicken+tomato&app_id=${appId}&app_key=${appKey}&from=0&to=6`,{
      mode: 'cors',
      redirect: 'follow',
      headers: {
        'Accept-Encoding': 'gzip',
      }
    }).then(resp => resp.json())
      .then(data =>{
        createRecipeCard(data);
      })
      .catch(err => console.log(err))



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
    console.log(data);
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
    console.log(recipe.url);
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

  basicFetch();
  openFridge();
  handleSelection();
});