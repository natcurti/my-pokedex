const containerPokemons = document.getElementById('containerPokemons');
const btnLoadMore = document.getElementById('btnLoadMore');
const btnFilter = document.getElementById('btnFilter');
const containerFilter = document.getElementById('filterOptions');
const nameOption = document.getElementById('nameOption');
const numberOption = document.getElementById('numberOption');
const containerMsgNotFound = document.getElementById('notFound');
const btnRefresh = document.getElementById('btnRefresh');
const input = document.getElementById('input');
const MAX_POKEMONS = 151;
let limit = 20;
let offset = 0;
let allPokemons = [];

getPokemonsFromAPI(limit, offset);

async function getPokemonsFromAPI(limit, offset){
    await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`)
    .then(response => response.json())
    .then(data => {
        allPokemons = data.results;
        getPokemonDetails(allPokemons);
    })
}

async function getPokemonDetails(allPokemons){
    for(let i = 0; i < allPokemons.length; i++){
        const url = allPokemons[i].url;
        let response = await fetch(url);
        let data = await response.json();
        addPokemonsToContainer(data);
    }
}

function addPokemonsToContainer(pokemon){
    let name = pokemon.name;
    let id = pokemon.id;
    let img = pokemon.sprites.other["dream_world"]["front_default"];
    let types = pokemon.types;
    let typeColor;
    if(types.length > 1){
        if(types[0].type.name === 'normal'){
            typeColor = types[1].type.name;
        } else {
            typeColor = types[0].type.name;
        }
    } else {
        typeColor = types[0].type.name;
    }
    const newPokemon = document.createElement('DIV');
    newPokemon.classList.add('main__container__card');
    newPokemon.setAttribute("id", id);
    newPokemon.innerHTML = `
            <div class="main__container__card-img ${typeColor}">
                <img src="${img}" alt="Desenho de ${name}">
            </div>
            <div class="main__container__card-info">
                <p class="main__container__card-number">#${id}</p>
                <p class="main__container__card-name">${name.charAt(0).toUpperCase() + name.slice(1)}</p>
                <div class="main__container__card-types">
                    ${types.map((element, index) => `<p class="main__container__card-type ${types[index].type.name}-solid">${(element.type.name).charAt(0).toUpperCase() + (element.type.name).slice(1)}</p>`).join('')}
                </div>
            </div>`;
    newPokemon.addEventListener('click', () => {
        window.location.href = `./details.html?id=${id}`;
    })
    containerPokemons.appendChild(newPokemon);
}

btnLoadMore.addEventListener('click', () => {
    offset += limit;
    let amountOfPokemonsWithNextPage = offset + limit;
    if(amountOfPokemonsWithNextPage >= MAX_POKEMONS){
        const newLimit = MAX_POKEMONS - offset;
        getPokemonsFromAPI(newLimit, offset);
        btnLoadMore.parentElement.remove();
    } else {
        getPokemonsFromAPI(limit, offset);
    }
})

btnFilter.addEventListener('click', () => {
    if(containerFilter.style.display === 'none'){
        containerFilter.style.display = 'flex';
    } else if(containerFilter.style.display === 'flex'){
        containerFilter.style.display = 'none';
    }
})


input.addEventListener('keyup', handleSearch);

function handleSearch(e){
    const allPokemonsInContainer = document.querySelectorAll('.main__container__card');
    let search = (e.target.value).toLowerCase();
    let names = [];
    allPokemonsInContainer.forEach(pokemon => names.push((pokemon.lastChild.children[1].textContent).toLowerCase()))
    let ids = [];
    allPokemonsInContainer.forEach(pokemon => ids.push(pokemon.lastChild.children[0].textContent.slice(1)));
    
    if(nameOption.checked){
        for(let i = 0; i < names.length; i++){
            if((names[i]).startsWith(search)){
                allPokemonsInContainer[i].style.display = 'grid';
            } else if(!((names[i]).startsWith(search))){
                allPokemonsInContainer[i].style.display = 'none';
            }
        }
        if(names.every(element => !(element.startsWith(search)))){
            containerMsgNotFound.style.display = 'flex';
            btnLoadMore.style.display = 'none';
            btnRefresh.style.display = 'block';
            btnRefresh.addEventListener('click', () => {
                window.location.reload();
            })
        }
    } else if (numberOption.checked){
        for(let i = 0; i < ids.length; i++){
            if((ids[i]).startsWith(search)){
                allPokemonsInContainer[i].style.display = 'grid';
            } else if(!((ids[i]).startsWith(search))){
                allPokemonsInContainer[i].style.display = 'none';
            } 
        }
        if(ids.every(element => !(element.startsWith(search)))){
            containerMsgNotFound.style.display = 'flex';
            btnLoadMore.style.display = 'none';
            btnRefresh.style.display = 'block';
            btnRefresh.addEventListener('click', () => {
                window.location.reload();
            })
        }
    }
    if(e.target.value === ''){
        allPokemonsInContainer.forEach(element => element.style.display = 'grid');
        containerMsgNotFound.style.display = 'none';
        btnRefresh.style.display = 'none';
        btnLoadMore.style.display = 'block';
    }
}
