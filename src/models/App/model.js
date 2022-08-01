// Root level model for the App
// ----------------------------------------------------------------------------
// Subscribes to the User model and Feature Flag model
// returns that data as a single object to the AppContext
// ----------------------------------------------------------------------------

import { UserModel } from '../User/model'
import { createReducer } from '../../utils/createReducer'
import { BehaviorSubject } from 'rxjs'

const defaultState = Object.freeze({
	isLoading: false,
	data: {
		user: {},
	},
})

const ModelImpl = () => {
	const { state: userState, get: getUserState } = UserModel
	const userSubscription = userState.subscribe({
		next: (data) => {
			console.log(data.data, 'user model data')
		},
	})
	let state = new BehaviorSubject({
		isLoading: false,
		data: {
			// subscribe to the userState
			user: userState.subscribe({
				// when we get a new user state, we merge it into the default state
				next: (data) => {
					console.log(data, 'data')
					// ...state.getValue(),
					// data: {
					// 	user: data,
					// },
				},
			}),
		},
	}) // <- should be observable
	const reducer = createReducer(defaultState) // reducer(currentState, action{type, payload}) => newState
	const dispatch = ({ type, payload }) => {
		const newState = reducer(state, { type, payload })
		state.next({ ...newState, ...state })
	}

	const setIsLoading = (isLoading) => {
		dispatch({
			type: 'merge',
			payload: { isLoading },
		})
	}

	const getAndSetData = async () => {
		// const response = await fetch('/api/features')
		// const data = await response.json()
		const data = { hi: 'hello world' }
		const userData = getUserState()
		console.log('Hi from App Model')
		dispatch({
			type: 'update',
			payload: { data, userData },
		})

		return data
	}

	const get = () => {
		// setIsLoading(true)
		// // await getAndSetData()
		// userState.subscribe({
		// 	next: (userData) => {
		// 		console.log(userData, 'user data')
		// 		dispatch({
		// 			type: 'update',
		// 			payload: { userData },
		// 		})
		// 	},
		// })
		// setIsLoading(false)
		return getUserState()
	}

	// returns subscriptions to all of the models
	const initialize = () => {
		const userData = userState
		const appData = state
		return {
			userData,
			appData,
		}
	}

	// Model interface
	return {
		initialized: true,
		state,
		get,
		initialize,
	}
}

export const AppModel = ModelImpl()
