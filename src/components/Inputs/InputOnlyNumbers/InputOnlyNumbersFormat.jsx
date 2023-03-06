import PropTypes from "prop-types";
import { useRef } from "react";
import styles from "../InputText.module.css";

const InputOnlyNumbersFormat = ({
	state,
	setState,
	id,
	icon,
	description,
	success,
	children = "",
	required = false,
	maxCharacter = 255,
	functionValidate
}) => {
	/*
		COSAS QUE FALTAN:
			* Documentar las funciones
	*/
	const input = useRef(null);
	const mnsjError = useRef(null);

	const REGEX_NOT_NUMBERS = /[^0-9]/g;
	const REGEX_NUMBERS = /^[0-9]+$/g;
	const REGEX_FORMAT_NUMBERS = /[0-9,]/g;
	const FORMAT_NUMBER = new Intl.NumberFormat("ES-MX", {
		minimumFractionDigits: 0,
		maximumFractionDigits: 0
	});

	let regexNum = new RegExp(REGEX_NUMBERS);

	/**
	 * @function maxLength
	 *
	 * @description Función para validar que el número de caracteres ingresados en el input no exceda el limite
	 * 				de caracteres, en caso de que exceda el limite la función retornara un true, de lo contrario
	 * 				retornara false
	 * @param void
	 * @returns boolean
	 */
	function maxLength() {
		return input.current.value.length > maxCharacter;
	}

	/**
	 * @function removeData
	 *
	 * @description Función para remover un caracter que se pasa como parametro (data) del valor del input.
	 * 				La función busca la ultima coincidencia del caracter que se removera en la cadena del
	 * 				valor del input y la elimina, si el valor pasado como parametro es null, la función
	 * 				terminara en ese mismo instante
	 * @param {string} data
	 * @returns void
	 */
	function removeData(data) {
		if (data === null) return;
		const value = input.current.value;
		const indexData = value.lastIndexOf(data);
		input.current.value =
			value.substring(0, indexData) +
			value.substring(indexData + 1, value.length);
	}

	/**
	 * @function numbers
	 *
	 * @description Función para verificar si un caracter es un número y si no es un número ejecute la función
	 * 				removeData. La función revisa que el parametro (data) cumpla con una expresión regular, la
	 * 				cual esta hecha para aceptar solo números, si el parametro no cumple con la expresión regular
	 * 				se ejecuta la función removeData y la función devuelve false si sí cumple, la función devolvera
	 * 				true
	 * @param {string} data
	 * @returns boolean
	 */
	function numbers(data) {
		if (!regexNum.test(input.current.value)) {
			removeData(data);
			console.log("remove");
			return false;
		}
		console.log("acept",input.current.value);
		return true;
	}

	/**
	 * @function changeState
	 *
	 * @description Función para verificar si se debe cambiar el estado del componente. La función devuelve true si
	 * 				el parametro (data) es igual a null o sí la función numbers devuelve true
	 * @param {string} data
	 * @returns boolean
	 */
	function changeState(data) {
		return data === null || numbers(data);
	}

	/**
	 * @function applyChangeState
	 *
	 * @description Función para cambiar el estado del componente. La función verifica primero si el input esta
	 * 				vacio, si esta vacio reinicia a su valor original el estado, si no esta vacio, ejecuta la
	 * 				función de validación y si el resultado es true, cambia la propiedad valid a true, si es
	 * 				falso cambia la propiedad a false
	 * @param void
	 * @returns void
	 */
	function applyChangeState() {
		const val = input.current.value;
		if (val === "") {
			setState({ value: "", valid: null });
			return;
		}
		mnsjError.current = functionValidate(val);
		if (typeof mnsjError.current === "boolean")
			setState({ value: val, valid: true });
		else setState({ value: val, valid: false });
	}

	/**
	 * @function clear
	 *
	 * @description Función para limpiar el valor del input. La función limpia el input y reinicia el estado a su
	 * 				valor original
	 * @param void
	 * @returns void
	 */
	function clear() {
		setState({ value: "", valid: null });
		input.current.value = "";
		input.current.focus();
	}

	function onChange(event) {
		if (maxLength()) return;
		const data = event.nativeEvent.data;
		if (changeState(data)) {
			applyChangeState();
		}
	}

	function onFocus() {
		// Eliminamos el formato del número si el campo no esta vacio
		regexNum = new RegExp(REGEX_NUMBERS);
		const value = input.current.value;
		if (value !== "") {
			const newValue = value.replace(REGEX_NOT_NUMBERS, "");
			input.current.value = newValue;
		}
	}

	function onBlur() {
		// Aplicamos formato al número si el campo no esta vacio
		const value = input.current.value;
		if (value !== "") {
			regexNum = new RegExp(REGEX_FORMAT_NUMBERS);
			const newValue = FORMAT_NUMBER.format(value);
			input.current.value = newValue;
		}
	}

	function onPaste(event) {
		const data = event.nativeEvent.clipboardData.getData("text"); // Obtenemos el texto que se pego
		if (!regexNum.test(data)) {
			event.preventDefault();
			console.error(
				"El texto que se quiere pegar contiene caracteres que no son números"
			);
		}
	}

	const IconError = (
		<path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z" />
	);

	const IconSuccess = (
		<path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
	);

	return (
		<div className={styles.container}>
			<div className={styles.containerInput}>
				<input
					ref={input}
					id={id}
					className={
						state.valid === null
							? styles.inputs
							: state.valid
							? styles.inputs + " " + styles.valid
							: styles.inputs + " " + styles.invalid
					}
					placeholder={children}
					type="text"
					required={required}
					onChange={(event) => onChange(event)}
					onBlur={onBlur}
					onFocus={onFocus}
					onPaste={(event) => onPaste(event)}
				/>
				<label htmlFor={id}>
					<Icon className={styles.icon + " " + styles.iconHelp}>{icon}</Icon>
				</label>
				<Icon
					className={
						state.valid === null
							? styles.icon + " " + styles.iconFeedback
							: state.valid
							? styles.icon +
							  " " +
							  styles.iconFeedback +
							  " " +
							  styles.iconSuccess
							: styles.icon + " " + styles.iconFeedback + " " + styles.iconError
					}
					onClick={clear}
				>
					{state.valid ? IconSuccess : IconError}
				</Icon>
			</div>
			<div
				className={
					state.valid === null
						? styles.feedback
						: state.valid
						? styles.feedback + " " + styles.feedbackSuccess
						: styles.feedback + " " + styles.feedbackError
				}
			>
				{state.valid === null
					? description
					: state.valid
					? success
					: mnsjError.current}
			</div>
		</div>
	);
};

const Icon = ({ className, children, onClick = null }) => {
	return (
		<svg
			onClick={onClick}
			className={className}
			width="16"
			height="16"
			viewBox="0 0 16 16"
		>
			{children}
		</svg>
	);
};

Icon.propTypes = {
	className: PropTypes.string,
	children: PropTypes.oneOfType([PropTypes.element, PropTypes.array]),
	onClick: PropTypes.func
};

InputOnlyNumbersFormat.propTypes = {
	state: PropTypes.object,
	setState: PropTypes.func,
	id: PropTypes.string,
	icon: PropTypes.node,
	description: PropTypes.string,
	success: PropTypes.string,
	children: PropTypes.string,
	required: PropTypes.bool,
	maxCharacter: PropTypes.number,
	functionValidate: PropTypes.func
};

export default InputOnlyNumbersFormat;
