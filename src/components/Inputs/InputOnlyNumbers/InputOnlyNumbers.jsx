import PropTypes from "prop-types";
import { useEffect, useRef } from "react";
import styles from "../InputText.module.css";

const InputOnlyNumbers = ({
	state,
	setState,
	id,
	icon,
	description,
	success,
	children = "",
	required = false,
	maxCharacter = 255,
	formatNumber = false,
	functionValidate
}) => {
	/*
		COSAS QUE FALTAN:
			* Documentar las funciones
	*/
	const input = useRef(null);
	const mnsjError = useRef(null);

    const REGEX_NOT_NUMBERS = /[^0-9]/g;
    const REGEX_NUMBERS = /[0-9]/g;
    const REGEX_FORMAT_NUMBERS = /[0-9,]/g;

	let format, regexNum;

    useEffect(()=>{
        if(formatNumber){
            format = {
                style: "decimal",
            };
        }
        regexNum = new RegExp(REGEX_NUMBERS);
    }, [])

    const FORMAT_NUMBER = new Intl.NumberFormat("ES-MX", format);


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
        if(data === null) return;
		const value = input.current.value;
		let indexData = value.lastIndexOf(data);
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


	function changeState(data){
        return data === null || numbers(data);
    }
    
    function applyChangeState(){
        const value = input.current.value;
		if (value === ""){
			setState({value:"", valid:null});
			return;
		}
		mnsjError.current = functionValidate(value);
		if(typeof mnsjError.current === "boolean") setState({value:value, valid:true}); 
		else setState({value:value, valid:false});
    }

    function onChange(event) {
		if (maxLength()) return;
		const data = event.nativeEvent.data;
		if (changeState(data)) {
			applyChangeState();
		}
	}

	function onFocus() {
		if (formatNumber) {
			// Eliminamos el formato del número si el campo no esta vacio
			const value = input.current.value;
			if (value !== "") {
				const newValue = value.replace(REGEX_NOT_NUMBERS, "");
				setState({...state, value:newValue});
			}
		}
	}

	function onBlur() {
		if (formatNumber) {
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
		if (!regexNum.test(data)) {
			event.preventDefault();
			console.error("El texto que se quiere pegar contiene caracteres que no son números");
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
						: mnsjError.current
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

InputOnlyNumbers.propTypes = {
	state: PropTypes.object,
	setState: PropTypes.func,
	id: PropTypes.string,
	icon: PropTypes.node,
	description: PropTypes.string,
	success: PropTypes.string,
	children: PropTypes.string,
	required: PropTypes.bool,
	maxCharacter: PropTypes.number,
	formatNumber: PropTypes.bool,
	functionValidate: PropTypes.func
};

export default InputOnlyNumbers;
