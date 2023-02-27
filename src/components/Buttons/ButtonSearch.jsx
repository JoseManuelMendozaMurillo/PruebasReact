import React from "react";
import styles from "./ButtonSearch.module.css";
import PropTypes from "prop-types";

const ButtonSearch = ({ children, onclick }) => {
	return (
		<button className={styles.searchButton} onClick={onclick}>
			{children}
		</button>
	);
};

ButtonSearch.propTypes = {
	children: PropTypes.string,
	onclick: PropTypes.func
};

export default React.memo(ButtonSearch);
