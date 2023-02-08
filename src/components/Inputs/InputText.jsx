import PropTypes from "prop-types";
import { useEffect, useRef} from "react";
import styles from "./InputText.module.css";

const InputText = ({
	state,
	setState,
	id,
	icon,
	description,
	success,
	children = "",
	required = false,
	maxCharacter = 255,
	onlyLetters = false,
	onlyNumbers = false,
	decimalNumber = false,
	maxDecimals = null,
	signNumber = false,
	formatNumber = false,
	symbolMoney = false,
	onlyLettersAndNumbers = false,
	functionValidate
}) => {
	/*
		COSAS QUE FALTAN:
			* Alternar los divs de información y feedback segun la función de validación
	*/
	const input = useRef(null);

	useEffect(() => {
		if (state.value === "" ){
			setState({...state, valid:null});
			return;
		}

		const result = functionValidate();
		if(typeof result === "boolean"){
			if(state.valid === false || state.valid === null){
				setState({...state, valid:true});
			} 
		}else{
			if(state.valid === true || state.valid === null){
				setState({...state, valid:false});
			} 
		}
		
	}, [state.value]);


	const REGEX_LETTERS = /^[A-ZÁÉÍÓÚÑa-záéíóúñ ]*$/;
	const REGEX_NOT_NUMBERS = /[^0-9.-]/g;
	const REGEX_UNSIGNED_NUMBERS = /^([0-9]+)$/;
	const REGEX_DECIMAL_UNSIGNED_NUMBERS = /^([0-9]*\.?[0-9]*)$/;
	const REGEX_SIGN_NUMBERS = /^(-?[0-9]*)$/;
	const REGEX_DECIMAL_SIGN_NUMBERS = /^(-?[0-9]*\.?[0-9]*)$/;
	const REGEX_FORMAT_NUMBERS = /[0-9.,-]/g;
	const REGEX_NUMBERS_LETTERS = /^[A-ZÁÉÍÓÚÑa-záéíóúñ0-9 ]*$/;

	let format, regexNum;

	if (symbolMoney) {
		format = {
			style: "currency",
			currency: "MXN",
			maximumFractionDigits: maxDecimals === null ? 20 : maxDecimals
		};
	} else {
		format = {
			style: "decimal",
			maximumFractionDigits: maxDecimals === null ? 20 : maxDecimals
		};
	}
	const FORMAT_NUMBER = new Intl.NumberFormat("ES-MX", format);

	function validateRegex() {
		if (onlyNumbers) {
			if (decimalNumber && !signNumber)
				regexNum = new RegExp(REGEX_DECIMAL_UNSIGNED_NUMBERS);
			else if (signNumber && !decimalNumber)
				regexNum = new RegExp(REGEX_SIGN_NUMBERS);
			else if (decimalNumber && signNumber)
				regexNum = new RegExp(REGEX_DECIMAL_SIGN_NUMBERS);
			else regexNum = new RegExp(REGEX_UNSIGNED_NUMBERS);

			return true;
		}
		return false;
	}

	validateRegex();

	/**
	 * @function maxLength
	 *
	 * @description función para validar que el número de caracteres ingresados en el input no exceda el limite
	 * 				de caracteres, en caso de que exceda el limite la función retornara un true, de lo contrario
	 * 				retornara false
	 * @param void
	 * @returns boolean
	 */
	function maxLength() {
		return input.current.value.length > maxCharacter;
	}

	function removeData(data) {
		const value = input.current.value;
		let indexData = value.lastIndexOf(data);
		// En caso de que la opción de punto decimal este activa
		if (decimalNumber) {
			const position = input.current.selectionStart;
			if (position < indexData) indexData = position - 1;
		}
		input.current.value =
			value.substring(0, indexData) +
			value.substring(indexData + 1, value.length);
	}

	function numbers(data) {
		if (!regexNum.test(input.current.value)) {
			removeData(data);
			return false;
		}
		return true;
	}

	function letters(data) {
		if (!REGEX_LETTERS.test(data)) {
			removeData(data);
			return false;
		}
		return true;
	}

	function lettersAndNumbers(data) {
		if (!REGEX_NUMBERS_LETTERS.test(data)) {
			removeData(data);
			return false;
		}
		return true;
	}

	function onChange(event) {
		if (maxLength()) return;
		const data = event.nativeEvent.data;
		let flag = true;
		if (data != null) {
			if (onlyLetters) flag = letters(data);
			else if (onlyNumbers) flag = numbers(data);
			else if (onlyLettersAndNumbers) flag = lettersAndNumbers(data);
		}
		if (flag) {
			setState({...state, value:event.target.value});
		}
	}

	function onFocus() {
		if (validateRegex()) {
			// Eliminamos el formato del número si el campo no esta vacio
			const value = input.current.value;
			if (value !== "") {
				const newValue = value.replace(REGEX_NOT_NUMBERS, "");
				setState({...state, value:newValue});
			}
		}
	}

	function onBlur() {
		if (onlyNumbers && formatNumber) {
			// Aplicamos formato al número si el campo no esta vacio
			const value = input.current.value;
			if (value !== "") {
				regexNum = new RegExp(REGEX_FORMAT_NUMBERS);
				const newValue = FORMAT_NUMBER.format(value);
				setState({...state, value:newValue});
			}
		}
	}

	function onPaste(event) {
		const data = event.nativeEvent.clipboardData.getData("text"); // Obtenemos el texto que se pego

		function verifyPaste(regex, textError) {
			if (!regex.test(data)) {
				event.preventDefault();
				console.error(textError);
			}
		}

		if (onlyNumbers) {
			verifyPaste(
				regexNum,
				"El texto que se quiere pegar no concuerda con el formato de un número"
			);
			return;
		}

		if (onlyLetters) {
			verifyPaste(
				REGEX_LETTERS,
				"El texto que se quiere pegar no concuerda con el formato de solo letras"
			);
			return;
		}

		if (onlyLettersAndNumbers) {
			verifyPaste(
				REGEX_NUMBERS_LETTERS,
				"El texto que se quiere pegar no concuerda con el formato de solo letras y números"
			);
			return;
		}

		setState({...state, value:data});
	}

	function clear() {
		setState({value:"", valid:null});
		input.current.value = "";
		input.current.focus();
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
							? styles.icon + " " + styles.iconFeedback + " " + styles.iconSuccess
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
						: functionValidate()
				}
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

InputText.propTypes = {
	state: PropTypes.object,
	setState: PropTypes.func,
	id: PropTypes.string,
	icon: PropTypes.node,
	description: PropTypes.string,
	success: PropTypes.string,
	children: PropTypes.string,
	required: PropTypes.bool,
	maxCharacter: PropTypes.number,
	onlyLetters: PropTypes.bool,
	onlyNumbers: PropTypes.bool,
	decimalNumber: PropTypes.bool,
	maxDecimals: PropTypes.number,
	signNumber: PropTypes.bool,
	formatNumber: PropTypes.bool,
	symbolMoney: PropTypes.bool,
	onlyLettersAndNumbers: PropTypes.bool,
	functionValidate: PropTypes.func
};

export { InputText };
