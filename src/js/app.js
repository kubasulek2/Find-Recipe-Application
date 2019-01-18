$(() => {
  const openFridge = ()=>{
    const door = $('.door');
    const handle = $('.handle');

    door.on('click', async function () {

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

    fetch(`https://api.edamam.com/search?q=chicken&app_id=${appId}&app_key=${appKey}`,{
      mode: 'cors',
      redirect: 'follow',
      headers: {
        'Accept-Encoding': 'gzip',
      }
    }).then(resp => resp.json())
      .then(data =>{
        console.log(data);
      })
  };
  //basicFetch()
  openFridge()
});