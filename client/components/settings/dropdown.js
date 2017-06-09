import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-virtualized-select';
import createFilterOptions from 'react-select-fast-filter-options';

//TODO: document what DropdownMenu expects
export class DropdownMenu extends PureComponent {

	constructor(props) {
		super(props);
		this.handleChange = this.handleChange.bind(this);
		this.setButtonName = this.setButtonName.bind(this);
	}

	componentWillMount() {
		let { options, filterOptions, value, multi } = this.props;
		let i = options.length, newOptions = new Array(i);
		while (i--) {
			newOptions[i] = {
				value: options[i],
				label: options[i],
			};
		}

		if (!filterOptions && options.length > 100) {
			filterOptions = createFilterOptions({ options: newOptions });
		}

		this.setState({
			options: newOptions,
			filterOptions,
		});
		this.setButtonName(value, multi);
	}

	componentWillReceiveProps(nextProps) {
		let { value, multi } = nextProps;
		this.setButtonName(value, multi);
	}

	setButtonName(value, multi) {
		let newState = {};
		if (multi) {
			if (value) {
				const genes = value;
				let i = genes.length;
				newState.values = new Array(i);
				while (i--) {
					newState.values[i] = { value: genes[i], label: genes[i] };
				}
			}
		} else {
			if (value) {
				newState = { value: value, label: value };
			} else {
				newState = { value: undefined, label: undefined };
			}
		}
		this.setState(newState);
	}

	handleChange(event) {
		this.setState(event);
		if (event !== undefined && event !== null) {
			const { onChange } = this.props;
			if (this.props.multi) {
				let i = event.length, value = new Array(i);
				while (i--) {
					value[i] = event[i].value;
				}
				onChange(value);
			} else {
				onChange(event.value);
			}
		}
	}

	render() {
		const { options, filterOptions, value } = this.state;
		return (
			<Select
				value={value}
				options={options}
				filterOptions={filterOptions}
				onChange={this.handleChange}
				multi={this.props.multi}
				clearable={this.props.clearable === true}
				style={this.props.style}
				maxHeight={100}
			/>
		);
	}
}

DropdownMenu.propTypes = {
	value: PropTypes.oneOfType([
		PropTypes.arrayOf(PropTypes.string),
		PropTypes.string,
	]),
	options: PropTypes.array.isRequired,
	filterOptions: PropTypes.func,
	onChange: PropTypes.func.isRequired,
	multi: PropTypes.bool,
	clearable: PropTypes.bool,
	style: PropTypes.object,
};