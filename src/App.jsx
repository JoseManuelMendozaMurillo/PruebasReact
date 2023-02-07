import styles from "./App.module.css";

// Components
import ButtonSearch from "./components/Buttons/ButtonSearch";
import Label from "./components/Labels/Label";
import { InputText } from "./components/Inputs/InputText";
import { useState } from "react";

const App = () => {
	const [state, setState] = useState({ value: "", valid: null });

	const SearchPokemon = () => {
		console.log(state.value);
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
					<InputText
						state={state}
						setState={setState}
						id="buscarPokemon"
						icon={
							<path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
						}
						className={styles.inputs}
						required={true}
						maxCharacter={10}
						onlyNumbers={true}
						decimalNumber={true}
						signNumber={true}
						formatNumber={true}
						functionValidate={() => {
							// console.log(state.value);
						}}
					>
						Nombre del pokemon
					</InputText>
				</div>
			</form>
			<ButtonSearch onclick={() => SearchPokemon()}>Buscar</ButtonSearch>
		</main>
	);
};

export default App;
