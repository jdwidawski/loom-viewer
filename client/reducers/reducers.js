// See http://rackt.org/redux/docs/basics/Reducers.html
import L from "leaflet";
import { combineReducers } from 'redux';

const initialViewState = {
	type: "SET_VIEW_PROPS",	// This will be set to the last action type
	view: 'Dataset',
	width: document.getElementById("react-root").clientWidth,
	height: window.innerHeight - document.getElementById("react-root").offsetTop - 50, // For some reason, at launch the height is 50px off (=navbar height)
};

function viewState(state = initialViewState, action) {
	switch (action.type) {
	case 'SET_VIEW_PROPS':
		return Object.assign({}, state, action);	// NOTE: must start with an empty object {} to ensure we don't mutate state
	default:
		return state;
	}
}

const initialSparklineState = {
	type: "SET_SPARKLINE_PROPS",	// This will be set to the last action type
	colAttr: "CellID",
	colMode: "Text",
	orderByAttr: "(none)",	// meaning, original order
	orderByGene: "",
	geneMode: "Heatmap",
	genes: "",
};

function sparklineState(state = initialSparklineState, action) {
	switch (action.type) {
	case 'SET_SPARKLINE_PROPS':
		return Object.assign({}, state, action);
	default:
		return state;
	}
}


const initialLandscapeState = {
	type: "SET_LANDSCAPE_PROPS",	// This will be set to the last action type
	xCoordinate: "_tSNE1",
	xGene: "",
	yCoordinate: "_tSNE2",
	yGene: "",
	colorAttr: "CellID",
	colorMode: "Heatmap",
	colorGene: "",
};

function landscapeState(state = initialLandscapeState, action) {
	switch (action.type) {
	case 'SET_LANDSCAPE_PROPS':
		return Object.assign({}, state, action);
	default:
		return state;
	}
}

const initialGenescapeState = {
	type: "SET_GENESCAPE_PROPS",	// This will be set to the last action type
	xCoordinate: "",
	yCoordinate: "",
	colorAttr: "",
	colorMode: "Heatmap",
};

function genescapeState(state = initialGenescapeState, action) {
	switch (action.type) {
	case 'SET_GENESCAPE_PROPS':
		return Object.assign({}, state, action);
	default:
		return state;
	}
}

const initialHeatmapState = {
	type: 'SET_HEATMAP_PROPS',	// This prop gets set by the reducer below, but we should ignore it
	screenBounds: (0, 0, 0, 0),	// Screen pixel coordinates of the dataset in the current view
	dataBounds: (0, 0, 0, 0),		// Data coordinates of the current view
	center: L.latLng(0, 0),
	zoom: 8,
	rowAttr: "",
	rowMode: 'Text',
	rowGenes: '',
	colAttr: "",
	colMode: 'Text',
	colGene: '',
};

function heatmapState(state = initialHeatmapState, action) {
	switch (action.type) {
	case 'SET_HEATMAP_PROPS':
		return Object.assign({}, state, action);
	default:
		return state;
	}
}

// Keeps track of projects and datasets, including managing asynchronous fetching
const initialDataState = {
	isFetchingData: false,
	errorFetchingData: false,

	projects: {},				// dict like { "Midbrain": [ {"dataset": "mouse_midbrain.loom", "isCached": false}, ... ], "Cortex": ... }
	hasDataset: false,

	currentDataset: {},			// rowAttrs, colAttrs and such things, when loaded; replaces 'window.fileinfo'
	genes: {},					// contains row data by gene, i.e. {"Actb": [1,2,1,3,42,4,...]}
};

function dataState(state = initialDataState, action) {
	switch (action.type) {
	case 'REQUEST_PROJECTS':
		return Object.assign({}, state, { isFetchingData: true, errorFetchingData: false });
	case 'RECEIVE_PROJECTS':
		return Object.assign({}, state, {
			isFetchingData: false,
			projects: action.projects,
		});
	case 'REQUEST_PROJECTS_FAILED':
		return Object.assign({}, state, { isFetchingData: false, errorFetchingData: true });

	case 'REQUEST_DATASET':
		return Object.assign({}, state, { isFetchingData: true, errorFetchingData: false });
	case 'RECEIVE_DATASET':
		return Object.assign({}, state, {
			isFetchingData: false,
			hasDataset: true,
			genes: {},
			currentDataset: action.dataset,
		});
	case 'REQUEST_DATASET_FAILED':
		return Object.assign({}, state, { isFetchingData: false, errorFetchingData: true });

	case 'REQUEST_GENE':
		return Object.assign({}, state, { isFetchingData: true, errorFetchingData: false });
	case 'RECEIVE_GENE':
		return Object.assign({}, state, {
			isFetchingData: false,
			genes: Object.assign({}, state.genes, {
				[action.gene]: action.data,
			}),
		});
	case 'REQUEST_GENE_FAILED':
		return Object.assign({}, state, { isFetchingData: false, errorFetchingData: true });
	default:
		return state;
	}
}

const loomAppReducer = combineReducers({
	viewState,
	heatmapState,
	landscapeState,
	genescapeState,
	sparklineState,
	dataState,
});

export default loomAppReducer;