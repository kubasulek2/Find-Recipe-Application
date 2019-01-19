$(() => {
  let obj = {
    restriction: '',
    filter: '',
    ingredient1: 'aa',
    ingredient2: 'bb',
    ingredient3: 'cc'
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

    fetch(`https://api.edamam.com/search?q=chicken+tomato&app_id=${appId}&app_key=${appKey}&from=0&to=100 `,{
      mode: 'cors',
      redirect: 'follow',
      headers: {
        'Accept-Encoding': 'gzip',
      }
    }).then(resp => resp.json())
      .then(data =>{
        createRecipeCard(data)
      })
      .catch(err => console.log(err))

  };
  const createRecipeCard = data => {
    let recipe = data.hits[6].recipe;

    for(let i = 0; i < recipe.ingredients.length ; i++){

      $('.card-body ul').append(`<li>- ${recipe.ingredients[i].text}</li>`)
    }

    $('.card-img-top').attr('src',recipe.image);
    $('.card-title').text(recipe.label);
    $('.card-body').html()
  };
  basicFetch();
  openFridge();
  handleSelection();
});