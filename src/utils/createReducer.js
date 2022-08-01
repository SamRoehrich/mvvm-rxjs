import { merge as _merge, cloneDeep as _clone } from 'lodash-es'

export const createReducer = (defaultState = {}) => {
	return (state, { type = '', payload = {} }) => {
		switch (type) {
			case 'reset':
				return _clone(defaultState)
			case 'merge':
				return _merge({}, state, payload)
			case 'update': // fall through
			default:
				return { ..._clone(state), ...payload }
		}
	}
}
