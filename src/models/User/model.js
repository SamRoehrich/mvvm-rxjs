// Parent model for the User model which is composed of Personal and Business profile data as well as the User's Feature Flags
// ----------------------------------------------------------------------------
// Subscribes to the Personal, Business and Features model
// returns that data as a single object to the AppContext
// ----------------------------------------------------------------------------
import { BehaviorSubject } from 'rxjs'
import { createReducer } from '../../utils/createReducer'
const defaultState = Object.freeze({
	isLoading: false,
	data: {
		user: {},
	},
})

const ModelImpl = () => {
	let state = new BehaviorSubject(defaultState) // <- should be observable
	const reducer = createReducer(defaultState) // reducer(currentState, action{type, payload}) => newState
	const dispatch = ({ type, payload }) => {
		const newState = reducer(state.getValue(), { type, payload })
		// once we have deduced the new state, we push that new state to all the observers
		state.next({
			...state,
			data: {
				...state.getValue().data,
				user: {
					...newState.data,
				},
			},
		})
	}

	const setIsLoading = (isLoading) => {
		dispatch({
			type: 'merge',
			payload: { isLoading },
		})
	}

	const getAndSetData = () => {
		// const response = await fetch('/api/features')
		// const data = await response.json()
		const data = { hi: 'hello user' }
		console.log('Hi from User Model')

		dispatch({
			type: 'update',
			payload: { data },
		})

		console.log(state.getValue(), 'user model state post getandset')

		return data
	}

	const get = () => {
		setIsLoading(true)
		getAndSetData()
		setIsLoading(false)
	}

	// Model interface
	return {
		initialized: true,
		state,
		get,
	}
}

export const UserModel = ModelImpl()
