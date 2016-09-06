import React, { Component, PropTypes } from 'react';
import { SparklineSidepanel } from './sparkline-sidepanel';
import { Sparkline } from './sparkline';
import { FetchDatasetComponent } from './fetch-dataset';
import * as _ from 'lodash';

class SparklineViewComponent extends Component {

	render() {
		const { sparklineState, dataSet, fetchedGenes, dispatch } = this.props;

		// The column attribute values that we want to display in the "legend"
		let colData = dataSet.colAttrs[sparklineState.colAttr];
		// if colAttr does not exist (for example, the default values
		// in the Loom interface is not present), pick the first column
		if (colData === undefined) {
			let properties = Object.getOwnPropertyNames(dataSet.colAttrs);
			colData = dataSet.colAttrs[properties[0]];
		}

		// Indices that we want to sort the data by. Default to sorted "as is"
		let indices = new Array(colData.length);
		for (let i = 0; i < indices.length; ++i) {
			indices[i] = i;
		}

		// Determine which array we want to sort colData by. Note that we abuse
		// the JS dictionary behavior of returning "undefined" when an
		// entry doesn't exist: if the string returned by orderByGene or
		// orderByAttr is not present, compareArray will be undefined,
		// and we don't re-arrange the indices.
		const compareArray = (sparklineState.orderByAttr === '(gene)') ?
			fetchedGenes[sparklineState.orderByGene]
			:
			dataSet.colAttrs[sparklineState.orderByAttr];

		if (compareArray) {
			indices.sort(
				(a, b) => {
					return compareArray[a] < compareArray[b] ? -1 :
						compareArray[a] > compareArray[b] ? 1 : 0;
				}
			);
			// Finally, order the column attribute values by the determined indices
			let temp = new Array(colData.length);
			for (let i = 0; i < colData.length; ++i) { temp[i] = colData[indices[i]]; }
			colData = temp;
		}

		let selectedGenesList = sparklineState.genes.trim().split(/[ ,\r\n]+/);
		const selectableGenes = dataSet.rowAttrs.Gene;
		if (selectableGenes) {
			selectedGenesList = _.intersection(selectedGenesList, dataSet.rowAttrs.Gene);
		}

		// Sidepanel
		const sidepanel = (
			<SparklineSidepanel
				sparklineState={sparklineState}
				dataSet={dataSet}
				fetchedGenes={fetchedGenes}
				selectableGenes={selectableGenes}
				dispatch={dispatch}
				/>
		);

		// "Show cell attribute"
		// Showing the scrollbar is ugly, but otherwise lining up will be *really hard*
		// because browsers do not allow for direct access to scrollbar size
		const legend = (
			<div style={{
				flex: '0 0 auto',
				minHeight: '20px',
				overflowY: 'scroll',
			}}>
				<Sparkline
					orientation='horizontal'
					height={20}
					data={colData}
					mode={sparklineState.colMode}
					/>
			</div>
		);

		// Actual sparklines
		let geneSparklines = [];
		if (selectedGenesList.length !== 0 && selectedGenesList[0] !== '') {
			for (let i = 0; i < selectedGenesList.length; i++) {
				const gene = selectedGenesList[i];
				const fetchedGene = fetchedGenes[gene];

				let geneData = [0];
				let label = `Fetching gene data for ${gene}`;
				let mode = 'Bars';
				if (fetchedGene) {
					geneData = new Array(colData.length);
					for (let j = 0; j < geneData.length; ++j) {
						geneData[j] = fetchedGenes[gene][indices[j]];
					}
					label = gene;
					mode = sparklineState.geneMode;
				}
				let dataRange = [0, geneData.length];
				geneSparklines[i] = (
					<div
						key={gene}
						style={{
							background: ((i % 2 === 0) ? '#FFFFFF' : '#F8F8F8'),
							display: 'flex',
							flexDirection: 'column',
							minHeight: '30px',
							maxHeight: '30px',
						}}>
						<Sparkline
							orientation='horizontal'
							data={geneData}
							label={label}
							dataRange={dataRange}
							mode={mode}
							style={{ minHeight: '30px', maxHeight: '30px' }}
							/>
					</div>
				);

			}
		}

		return (
			<div className='view' style={{ overflowX: 'hidden' }}>
				{sidepanel}
				<div className='view-vertical' style={{ margin: '20px 20px 20px 20px' }}>
					{legend}
					<div style={{ display: 'flex', flex: 1, overflowY: 'scroll', overflowX: 'hidden' }}>
						<div style={{
							display: 'flex',
							flexDirection: 'column',
							width: '100%',
						}}>
							{geneSparklines}
						</div>
					</div>
					{legend}
				</div>
			</div >
		);
	}
}

SparklineViewComponent.propTypes = {
	dataSet: PropTypes.object.isRequired,
	fetchedGenes: PropTypes.object.isRequired,
	sparklineState: PropTypes.object.isRequired,
	dispatch: PropTypes.func.isRequired,
};

const SparklineViewContainer = function (props) {
	const { dispatch, data, sparklineState, params } = props;
	const { project, dataset } = params;
	const dataSet = data.dataSets[dataset];
	const fetchedGenes = data.fetchedGenes;
	return (dataSet === undefined ?
		<FetchDatasetComponent
			dispatch={dispatch}
			dataSets={data.dataSets}
			dataset={dataset}
			project={project} />
		:
		<SparklineViewComponent
			dispatch={dispatch}
			sparklineState={sparklineState}
			dataSet={dataSet}
			fetchedGenes={fetchedGenes} />
	);
};

SparklineViewContainer.propTypes = {
	// Passed down by react-router-redux
	params: PropTypes.object.isRequired,
	// Passed down by react-redux
	data: PropTypes.object.isRequired,
	sparklineState: PropTypes.object.isRequired,
	dispatch: PropTypes.func.isRequired,
};

//connect SparklineViewContainer to store
import { connect } from 'react-redux';

// react-router-redux passes URL parameters
// through ownProps.params. See also:
// https://github.com/reactjs/react-router-redux#how-do-i-access-router-state-in-a-container-component
const mapStateToProps = (state, ownProps) => {
	return {
		params: ownProps.params,
		sparklineState: state.sparklineState,
		data: state.data,
	};
};

export const SparklineView = connect(mapStateToProps)(SparklineViewContainer);