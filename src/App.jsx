import styles from "./App.module.css";

// Components
import ButtonSearch from "./components/Buttons/ButtonSearch.jsx";
import Label from "./components/Labels/Label.jsx";
import InputOnlyNumbers from "./components/Inputs/InputOnlyNumbers/InputOnlyNumbers";
import { useState } from "react";

const App = () => {
	const [state, setState] = useState({ value: "", valid: null });

	const SearchPokemon = () => {
		console.log(state.value);
	};

	/**
	 * @function functionValidate
	 * @description Función que valida si una edad se encuentra entre el rango de 0 - 125 años, si la edad no se
	 * 				encuentra en este rango devuelve un string describiendo el problema, si la edad sí se encuentra
	 * 				en este rango devuelve un true
	 * @param void
	 * @returns string | boolean
	 */
	const functionValidate = (edad) => {
		edad = parseInt(edad);
		if (edad < 0) return "La edad no puede ser menor que cero";
		if (edad > 125) return "La edad no puede ser mayor a 125 años";
		return true;
	};

	return (
		<main>
			<h1 className={styles.Title}>Pokedex</h1>
			<form className={styles.Formulario} noValidate={true}>
				<div style={{ width: "30%" }}>
					<Label
						htmlFor="buscarPokemon"
						required={true}
						className={styles.label}
					>
						Buscar pokemón
					</Label>
					<InputOnlyNumbers
						state={state}
						setState={setState}
						id="buscarPokemon"
						icon={
							<path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
						}
						description="Escribe el nombre de un pokemón para saber sus propiedades"
						success="El formato se ve bien"
						className={styles.inputs}
						required={true}
						maxCharacter={50}
						functionValidate={functionValidate}
					>
						Nombre del pokemon
					</InputOnlyNumbers>
				</div>
			</form>
			<ButtonSearch onclick={() => SearchPokemon()}>Buscar</ButtonSearch>
		</main>
	);
};

export default App;
