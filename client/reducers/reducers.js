// See http://rackt.org/redux/docs/basics/Reducers.html
import { combineReducers } from 'redux';
// used for writing view state to the browser URL
import { browserHistory } from 'react-router';
import JSURL from 'jsurl';
import { merge } from '../js/util';


import {
	// REQUEST_PROJECTS,
	// REQUEST_PROJECTS_FAILED,
	RECEIVE_PROJECTS,
	// REQUEST_DATASET,
	// REQUEST_DATASET_FAILED,
	RECEIVE_DATASET,
	SEARCH_DATASETS,
	SORT_DATASETS,
	FILTER_METADATA,
	SORT_ROW_METADATA,
	SORT_COL_METADATA,
	REQUEST_GENE_FETCH,
	REQUEST_GENE_FAILED,
	RECEIVE_GENE,
	SET_VIEW_PROPS,
} from '../actions/actionTypes';

/**
 * Usage: action can optionally have "prune" and "state" trees
 * to "declaratively" modify the old state tree.
 * - action.prune is a tree of values of the old state tree to
 *   "remove" (by not copying them to the new state). Only leaves
 *   will be pruned
 * - action.state is a tree of new values to merge into the old
 *   state tree, resulting in the new state.
 * If both are provided, prune is applied first (which lets us
 * _replace_ objects wholesale, instead of merging them).
 * IMPORTANT: use simple, "plain" JS objects only; this borks when
 * passed JSX objects, for example.
 */
function update(state, action) {
	// // We're not using prune for now, so we might as well comment it out
	// let newState = action.prune ? prune(state, action.prune) : state;
	// return action.state ? merge(newState, action.state) : newState;
	return merge(state, action.state);
}

function updateViewState(state, action) {
	let { path, viewState } = action;
	viewState = merge(state.list[path].viewState, viewState);
	return merge(state,
		{
			list: {
				[path]: { viewState },
			},
		}
	);
}

function setViewStateURL(state, action) {
	let { stateName, path } = action;
	let view = 'unknown';
	switch (stateName) {
		case 'heatmap':
			view = 'heatmap';
			break;
		case 'sparkline':
			view = 'sparklines';
			break;
		case 'landscape':
			view = 'cells';
			break;
		case 'genescape':
			view = 'genes';
			break;
		case 'geneMD':
			view = 'genemetadata';
			break;
		case 'cellMD':
			view = 'cellmetadata';
	}
	const { viewState } = state.list[path];
	const url = `/dataset/${view}/${path}/${JSURL.stringify(viewState)}`;
	browserHistory.replace(url);
	return state;
}

function updateDatasetSortOrder(state, key) {
	return merge(state, {
		order: (state.order.key === key) ?
			{ key: state.order.key, asc: !state.order.asc } : { key, asc: true },
	});
}

function updateFiltered(state, action) {
	// toggle filtered state in relevant uniques entry
	const { path, axis, attrName, val } = action;
	const data = state.list[path][axis];
	let attr = data.attrs[attrName];
	const oldUniques = attr.uniques;
	let uniques = [], filtered;
	for (let i = 0; i < oldUniques.length; i++) {
		let uniqueEntry = oldUniques[i];
		if (val === uniqueEntry.val) {
			filtered = !uniqueEntry.filtered;
			uniques.push(merge(uniqueEntry, { filtered }));
		} else {
			uniques.push(uniqueEntry);
		}
	}

	// update filterCount
	let filterCount = data.filterCount.slice(0), sortedFilterIndices = [];
	if (filtered) {
		for (let i = 0; i < filterCount.length; i++) {
			if (attr.data[i] === val) {
				filterCount[i]++;
			}
			if (filterCount[i] === 0){
				sortedFilterIndices.push(i);
			}
		}
	} else {
		for (let i = 0; i < filterCount.length; i++) {
			if (attr.data[i] === val) {
				filterCount[i]--;
			}
			if (filterCount[i] === 0){
				sortedFilterIndices.push(i);
			}
		}
	}

	return merge(state, {
		list: {
			[path]: {
				[axis]: {
					filterCount,
					sortedFilterIndices,
					attrs: {
						[attrName]: {
							uniques,
						},
					},
				},
			},
		},
	});
}

function updateAttrSort(state, action){

}

function datasets(state = {}, action) {
	let newState;
	switch (action.type) {
		case RECEIVE_PROJECTS:
		case RECEIVE_DATASET:
		case SEARCH_DATASETS:
		case REQUEST_GENE_FETCH:
		case RECEIVE_GENE:
		case REQUEST_GENE_FAILED:
			return update(state, action);

		//===VIEW ACTIONS===
		case SET_VIEW_PROPS:
			newState = updateViewState(state, action);
			return setViewStateURL(newState, action);

		case SORT_DATASETS:
			return updateDatasetSortOrder(state, action.key);

		case SORT_ROW_METADATA:
		case SORT_COL_METADATA:
			return state;

		case FILTER_METADATA:
			return updateFiltered(state, action);

		default:
			return state;
	}
}

const loomAppReducer = combineReducers({ datasets });
export default loomAppReducer;