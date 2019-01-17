$(() => {

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
});