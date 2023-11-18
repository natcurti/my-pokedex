let currentPokemonId = null;
const MAX_POKEMONS = 151;

const pokemonName = document.getElementById('pokemonName');
const pokemonID = document.getElementById('pokemonID');
const pokemonImg = document.getElementById('pokemonImg');
const body = document.querySelector('body');
const containerDetails = document.getElementById('pokemonDetails');
const btnBack = document.getElementById('btnBack');
const btnLeft = document.getElementById('btnLeft');
const btnRight = document.getElementById('btnRight');

document.addEventListener('DOMContentLoaded', () => {
    const id = parseInt(new URLSearchParams(window.location.search).get("id"));

    if (id < 1 || id > MAX_POKEMONS) {
        return (window.location.href = './index.html');
    }
    currentPokemonId = id;
    loadPokemon(id);
})

async function loadPokemon(id){
    try{
        await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`)
        .then(response => response.json())
        .then(data => {
            if (currentPokemonId === id){
                showPokemonDetails(data);
                btnLeft.removeEventListener('click', navigatePokemon);
                btnRight.removeEventListener('click', navigatePokemon);
                if(id !== 1){
                    btnLeft.addEventListener('click', () => {
                        navigatePokemon(id - 1);
                    })
                }
                if(id !== MAX_POKEMONS){
                    btnRight.addEventListener('click', () => {
                        navigatePokemon(id + 1);
                    })
                }            
                window.history.pushState({}, "", `./details.html?id=${id}`);
            }
        });
        return true;        
    } 
    catch (error) {
        console.error("Aconteceu um erro: ", error);
        return false;
    }
}

function showPokemonDetails(pokemon){
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
    let weight = (pokemon.weight)/10;
    let height = (pokemon.height)/10;
    let stats = pokemon.stats;
    body.className = `${typeColor}`;
    pokemonName.innerHTML = name.charAt(0).toUpperCase() + name.slice(1);
    pokemonID.innerHTML = '#' + id;
    pokemonImg.setAttribute('src', img);

    containerDetails.innerHTML = `    
        <div class="main__container__types"> 
        ${types.map((element, index) => `
            <p class="main__container__type ${types[index].type.name}-solid">
            ${(element.type.name).charAt(0).toUpperCase() + (element.type.name).slice(1)}
            </p>
            `
        ).join('')}
        </div>
        <div class="main__container__infos">
            <div class="main__container__weight">
                <p>${weight}kg</p>
                <P>Peso</P>
            </div>
            <div class="main__container__divider"></div>
            <div class="main__container__height">
                <p>${height}m</p>
                <P>Altura</P>
            </div>
        </div>
        <div class="main__container__base-stats">
            <p class="main__base-stats-title">Estatísticas Básicas</p>
            ${stats.map(element => `
                <p class="main__base-stats-subtitle">${(element.stat.name).toUpperCase()}</p>
                <p class="main__base-stats-value">${element.base_stat}</p>
                <progress value="${element.base_stat}" max="100" class="main__base-stats-progress"></progress>
            `).join('')}
        </div> 
    `
    const styleTag = document.createElement('style');
    styleTag.innerHTML = `
        .main__base-stats-progress::-webkit-progress-value{
            background-color: var(--${typeColor});
            border-radius: 1rem;
            box-shadow: 1px 2px 3px 1px rgba(0,0,0,0.3);
        }    
    `
    document.head.appendChild(styleTag);
}

async function navigatePokemon(id){
    currentPokemonId = id;
    await loadPokemon(id);
}

btnBack.addEventListener('click', () => {
    window.location.href = './index.html';
})