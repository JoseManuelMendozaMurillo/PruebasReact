import PropTypes from "prop-types";
import { useRef } from "react";
import styles from "../InputText.module.css";

const InputSignDecimalNumbersOnly = ({
	state,
	setState,
	id,
	icon,
	description,
	success,
	children = "",
	required = false,
	maxCharacter = 255,
	maxDecimals = 2,
	alwaysApplyDecimalFormat = false,
	functionValidate
}) => {
	const input = useRef(null);
	const mnsjError = useRef(null);

	const REGEX_SIGN_DECIMAL_NUMBERS = /^(-?[0-9]*\.?[0-9]*)$/g;
	const optionsFormat = {
		minimumFractionDigits: alwaysApplyDecimalFormat ? maxDecimals : 0,
		maximumFractionDigits: alwaysApplyDecimalFormat ? maxDecimals : 0,
		useGrouping: false
	};
	let FORMAT_NUMBER = new Intl.NumberFormat("ES-MX", optionsFormat);

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
	 * @description Función para verificar si la entrada del input es un número. La función revisa que la entrada
	 *              del input cumpla con una expresión regular, la cual esta hecha para aceptar solo números
	 *              (decimales o enteros). si el parametro no cumple con la expresión regular se ejecuta la
	 *              función removeData y la función devuelve false, si sí cumple, la función devolvera true
	 * @param {string} data
	 * @returns boolean
	 */
	function numbers(data) {
		if (!REGEX_SIGN_DECIMAL_NUMBERS.test(input.current.value)) {
			removeData(data);
			return false;
		}
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

	function onBlur() {
		// Aplicamos formato al número si el campo no esta vacio
		const value = input.current.value;
		if (value !== "") {
			// Evaluamos si no esta activa la opción de aplicar siempre formato decimal
			if (!alwaysApplyDecimalFormat) {
				// Evaluamos si el número tiene parte decimal  para saber si aplicar o no el formato a los decimales
				if (value.indexOf(".") === -1) {
					// Sí el número no tiene parte decimal
					optionsFormat.minimumFractionDigits = 0;
					optionsFormat.maximumFractionDigits = 0;
				} else {
					// Sí el número si tiene parte decimal
					optionsFormat.minimumFractionDigits = maxDecimals;
					optionsFormat.maximumFractionDigits = maxDecimals;
				}
				FORMAT_NUMBER = new Intl.NumberFormat("ES-MX", optionsFormat);
			}
			const newValue = FORMAT_NUMBER.format(value);
			input.current.value = newValue;
			applyChangeState();
		}
	}

	function onPaste(event) {
		// Obtenemos el texto que se pego
		const dataPasted = event.nativeEvent.clipboardData.getData("text");

		// Contruimos la cadena resultante de los datos pegados mas los datos que ya estaban en el input
		const position = input.current.selectionStart;
		const data =
			state.value.slice(0, position) + dataPasted + state.value.slice(position);

		if (!REGEX_SIGN_DECIMAL_NUMBERS.test(data)) {
			event.preventDefault();
			console.error(
				"El texto que se quiere pegar no tiene el formato de un número"
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
					value={state.value}
					required={required}
					onChange={(event) => onChange(event)}
					onBlur={() => onBlur()}
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

InputSignDecimalNumbersOnly.propTypes = {
	state: PropTypes.object,
	setState: PropTypes.func,
	id: PropTypes.string,
	icon: PropTypes.node,
	description: PropTypes.string,
	success: PropTypes.string,
	children: PropTypes.string,
	required: PropTypes.bool,
	maxCharacter: PropTypes.number,
	maxDecimals: PropTypes.number,
	alwaysApplyDecimalFormat: PropTypes.bool,
	functionValidate: PropTypes.func
};

export default InputSignDecimalNumbersOnly;