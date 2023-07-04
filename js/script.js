function mountPokecardHTML(pokemon){    
    let divCard = "";

    divCard += `<div id="card">
                <img src="${pokemon.img}" class="img-pokemon">
                <div class="footer">
                    <div class="name_or_id">
                        <h1>#${pokemon.id}</h1>
                        <h1>${pokemon.name}</h1>
                    </div>
                    <div class="types">`;

    for (let i = 0; i < pokemon.types.length; i++){        
        divCard += `<h1 class="card-background-${pokemon.types[i]}-type-button">${pokemon.types[i]}</h1>`;
    }

    divCard += `</div>
                </div>
                <div class="card-background card-background-${pokemon.types[0]}"></div>
            </div>`;

    return divCard;
}


async function fetchPokemon(name_or_id){
    name_or_id = String(name_or_id);

    return fetch("https://pokeapi.co/api/v2/pokemon/" + name_or_id.toLowerCase())
    .then(response => response.json())
    .then(pokemonJson =>  {
        let types = [];
        pokemonJson.types.forEach(e => {
            types.push(e.type.name);
        })
        return  {
            id: pokemonJson.id,
            img: pokemonJson.sprites.other['dream_world'].front_default,
            name: pokemonJson.name,
            types: types
        }

    })
    .then(mountPokecardHTML);
}

function fetchInterval(start, end){
    let promises = [];
    for (let i = start; i <= end; i++){
        promises.push(fetchPokemon(i));
    }
    return promises;
}

function fetchSingle(name_or_id){
    return [fetchPokemon(name_or_id)];
}



document.querySelector("#wrapper")
    .addEventListener('submit', (event)=>{
        event.preventDefault(); // Impede o comportamento padrão de enviar o formulário

        const pokemonsElement = document.querySelector("#pokemons");
        const inputValue = document.querySelector("#search-input").value;
        let [start, end] = inputValue.split('-');
        let promises;

        if (isNaN(start)){
            promises = fetchSingle(start);
        }else{
            if (end == undefined){
                promises = fetchSingle(start);
            }else{
                promises = fetchInterval(Number(start), Number(end));
            }
        }
        Promise.all(promises).then(htmls => {
            let innerHTML = "";
            htmls.forEach(e => {
                innerHTML += e;
            });
            pokemonsElement.innerHTML = innerHTML;
        });
    });
