import PropTypes from "prop-types";
import styles from "./InputText.module.css";

const InputText = ({
	id,
	children = "",
	required = false,
	maxCharacter = 255,
	onlyLetters = false,
	onlyNumbers = false,
	decimalNumber = false,
	maxDecimals = 2,
	signNumber = false,
	formatNumber = false,
	symbolMoney = false,
	onlyLettersAndNumbers = false,
	functionValidate
}) => {
	/*
		COSAS QUE FALTAN:
			* Agregar los divs de información y feedback
			* Alternar los divs de información y feedback segun la función de validación
	*/
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
			maximumFractionDigits: maxDecimals
		};
	} else {
		format = {
			style: "decimal",
			maximumFractionDigits: maxDecimals
		};
	}
	const FORMAT_NUMBER = new Intl.NumberFormat("ES-MX", format);

	function _validateRegex() {
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

	_validateRegex();

	function maxLength(maxCharacter, input) {
		const length = input.value.length;
		if (length > maxCharacter) {
			const value = input.value;
			const startPosition = input.selectionStart; // Obtenemos la posicion del cursor
			input.value =
				value.substring(0, startPosition - 1) +
				value.substring(startPosition, value.length);
			return false;
		}
		return true;
	}

	function _removeData(input, data) {
		const value = input.value;
		let indexData = value.lastIndexOf(data);
		// En caso de que la opción de punto decimal este activa
		if (decimalNumber) {
			const position = input.selectionStart;
			if (position < indexData) indexData = position - 1;
		}
		input.value =
			value.substring(0, indexData) +
			value.substring(indexData + 1, value.length);
	}

	function numbers(input, data) {
		if (!regexNum.test(input.value)) {
			_removeData(input, data);
			return false;
		}
		return true;
	}

	function letters(input, data) {
		if (!REGEX_LETTERS.test(data)) {
			_removeData(input, data);
			return false;
		}
		return true;
	}

	function lettersAndNumbers(input, data) {
		if (!REGEX_NUMBERS_LETTERS.test(data)) {
			_removeData(input, data);
			return false;
		}
		return true;
	}

	function onChange(event) {
		const input = event.target; // Obtenemos el elemento
		if (maxLength(maxCharacter, input)) {
			const data = event.nativeEvent.data;
			if (data != null) {
				let flag = true;
				if (onlyLetters) flag = letters(input, data);
				else if (onlyNumbers) flag = numbers(input, data);
				else if (onlyLettersAndNumbers) flag = lettersAndNumbers(input, data);

				if (flag) functionValidate();
			}
		}
	}

	function onFocus(event) {
		if (_validateRegex()) {
			// Eliminamos el formato del número si el campo no esta vacio
			const input = event.target;
			const value = input.value;
			if (value !== "") {
				const newValue = value.replace(REGEX_NOT_NUMBERS, "");
				input.value = newValue;
			}
		}
	}

	function onBlur(event) {
		if (onlyNumbers && formatNumber) {
			// Aplicamos formato al número si el campo no esta vacio
			const input = event.target;
			const value = input.value;
			if (value !== "") {
				regexNum = new RegExp(REGEX_FORMAT_NUMBERS);
				input.value = FORMAT_NUMBER.format(value);
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
		}
	}

	return (
		<div className={styles.container}>
			<input
				id={id}
				className={styles.inputs + " " + styles.invalid}
				placeholder={children}
				type="text"
				required={required}
				onChange={(event) => onChange(event)}
				onBlur={(event) => onBlur(event)}
				onFocus={(event) => onFocus(event)}
				onPaste={(event) => onPaste(event)}
			/>
			<label htmlFor={id}>
				<Icon className={styles.icon + " " + styles.iconHelp}>
					<path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
				</Icon>
			</label>
			<Icon
				className={
					styles.icon + " " + styles.iconFeedback + " " + styles.iconError
				}
			>
				<path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z" />

				{/* <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" /> */}
			</Icon>
		</div>
	);
};

const Icon = ({ className, children }) => {
	return (
		<svg className={className} width="16" height="16" viewBox="0 0 16 16">
			{children}
		</svg>
	);
};

Icon.propTypes = {
	className: PropTypes.string,
	children: PropTypes.oneOfType([PropTypes.element, PropTypes.array])
};

InputText.propTypes = {
	id: PropTypes.string,
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

export default InputText;
