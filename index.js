// if(process.env)
console.log("FDeployed at 19:20");
const fetchData = async (searchTerm) => {
  const response = await axios.get("https://www.omdbapi.com/", {
    params: {
      apikey: "a246fc2",
      s: searchTerm,
    },
  });
  if (response.data.Error) {
    return [];
  }
  return response.data.Search;
};

let leftMovie;
let rightMovie;
const onMovieSelect = async (movie,summaryTarget,side) => {
  const response = await axios.get("https://www.omdbapi.com/", {
    params: {
      apikey: "a246fc2",
      i: movie.imdbID,
    },
  });
  console.log(response.data);
  summaryTarget.innerHTML = movieTemplate(response.data);
  if(side==='left')
  {
      leftMovie=response.data;
  }
  else{
    rightMovie=response.data;
  }
  if(leftMovie && rightMovie)
  {
    runComparison();
  }
};
const runComparison=()=>{
  const leftSideStats=document.querySelectorAll('#left-summary .notification');
  const rightSideStats=document.querySelectorAll('#right-summary .notification');
  console.log(leftSideStats,rightSideStats);
  leftSideStats.forEach((leftStat,index)=>{
    const rightStat=rightSideStats[index];
    const leftSideValue=parseFloat( leftStat.dataset.value);
    const rightSideValue=parseFloat( rightStat.dataset.value);
    if(leftSideValue>rightSideValue)
    {
      rightStat.classList.remove('is-primary');
      rightStat.classList.add('is-warning');
    }
    else{
      leftStat.classList.remove('is-primary');
      leftStat.classList.add('is-warning');
    }
  });
}
const movieTemplate = (movieDetails) => {
  const dollar=parseInt(movieDetails.BoxOffice.replace(/\$/g ,'').replace(/,/g,''));
  const metascore=parseInt(movieDetails.Metascore);
  const imdbRating=parseFloat(movieDetails.imdbRating);
  const imdbVotes=parseInt(movieDetails.imdbVotes.replace(/,/g,''));
  const awards=movieDetails.Awards.split(' ').reduce((prev,word)=>{
    let value=parseInt(word);
    if(isNaN(value)){
      return prev;}
    else{
    return prev+value;}
  },0)
  console.log(metascore,imdbRating,imdbVotes,dollar,awards);

  return `
  <article class='media' >
  <figure class=" media-left">
  <p class="image">
  <img src="${movieDetails.Poster}"/>
  </p>
  </figure>
  <div class="media-content">
  <div class="content">
  <h1> ${ movieDetails.Title}</h1>
  <h4> ${ movieDetails.Genre}</h4>
 <p>${movieDetails.Plot}</p>
  </div>
  </div>
  </article>
  <article  data-value=${awards} class='notification is-primary'>
  <p class="title"> ${movieDetails.Awards}</p>
  <p class="subtitle">Awards</p>
  </article>
  <article data-value=${dollar} class='notification is-primary'>
  <p class="title"> ${movieDetails.BoxOffice}</p>
  <p class="subtitle"> BoxOffice</p>
  </article>
  <article data-value=${metascore} class='notification is-primary'>
  <p class="title"> ${movieDetails.Metascore}</p>
  <p class="subtitle"> Metascore</p>
  </article>
  <article data-value=${imdbRating} class='notification is-primary'>
  <p class="title"> ${movieDetails.imdbRating}</p>
  <p class="subtitle">imdbRating</p>
  </article>
  <article data-value=${imdbVotes} class='notification is-primary'>
  <p class="title"> ${movieDetails.imdbVotes}</p>
  <p class="subtitle">imdb Votes</p>
  </article>`
  ;
  
};
const createAutoCompleteConfig={
  renderOption(movie){
    const imgScr=movie.Poster==='N/A'?" ":movie.Poster;
    return `
    <img src="${imgScr}"/>
    ${movie.Title}`;
  },
  
  inputValue(movie) {
    return movie.Title;
  },
   async fetchData  (searchTerm) {
    const response = await axios.get("http://www.omdbapi.com/", {
      params: {
        apikey: "a246fc2",
        s: searchTerm,
      },
    });
    if (response.data.Error) {
      return [];
    }
    return response.data.Search;
  }
}
createAutoComplete(
  {
    ...createAutoCompleteConfig,
    root:document.querySelector('#left-autocomplete'),
    onOptionSelect(movie){
      document.querySelector('.tutorial').classList.add('is-hidden');
      onMovieSelect(movie,document.querySelector('#left-summary'),'left');
    },
  }
)
createAutoComplete(
  {
    ...createAutoCompleteConfig,
    root:document.querySelector('#right-autocomplete'),
    onOptionSelect(movie){
      document.querySelector('.tutorial').classList.add('is-hidden');
      onMovieSelect(movie,document.querySelector('#right-summary'),'right');
    },
  }
)
