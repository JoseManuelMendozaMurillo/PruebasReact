import styles from "./App.module.css";

// Components
import ButtonSearch from "./components/Buttons/ButtonSearch";
import Label from "./components/Labels/Label";
import InputText from "./components/Inputs/InputText";

const App = () => (
	<main>
		<h1 className={styles.Title}>Pokedex</h1>
		<form className={styles.Formulario} noValidate={true}>
			<div>
				<Label htmlFor="buscarPokemon" required={true} className={styles.label}>
					Buscar pokemón
				</Label>
				<InputText
					id="buscarPokemon"
					className={styles.inputs}
					required={true}
					maxCharacter={40}
					onlyLetters={true}
					functionValidate={() => {
						console.log("valido");
					}}
				>
					Nombre del pokemon
				</InputText>
			</div>
		</form>
		<ButtonSearch onclick={() => SearchPokemon()}>Buscar</ButtonSearch>
	</main>
);

const SearchPokemon = () => {};

export default App;
