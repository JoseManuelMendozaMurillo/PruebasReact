import PropTypes from "prop-types";

const Label = ({
	id = "",
	className = "",
	children,
	required = false,
	distinctive = "*",
	colorDistinctive = "#960018",
	htmlFor
}) => {
	if (required) {
		return (
			<label id={id} htmlFor={htmlFor} className={className}>
				{children}
				<span style={{ color: colorDistinctive }}> {distinctive}</span>
			</label>
		);
	} else {
		return (
			<label id={id} htmlFor={htmlFor} className={className}>
				{children}
			</label>
		);
	}
};

Label.propTypes = {
	id: PropTypes.string,
	className: PropTypes.string,
	children: PropTypes.string.isRequired,
	required: PropTypes.bool,
	distinctive: PropTypes.string,
	distinctiveSVG: PropTypes.bool,
	colorDistinctive: PropTypes.string,
	htmlFor: PropTypes.string.isRequired
};

export default Label;
