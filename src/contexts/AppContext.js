// AppContext
import React, { createContext, useContext } from 'react'
import { AppModel } from '../models/App/model'
// import { defaultState, useModel as useAppModel } from '@/models/App'

const defaultState = Object.freeze({
	isLoading: false,
	data: {
		user: {},
	},
})

export const AppContext = createContext({
	state: defaultState,
	dispatch: () => {},
})

AppContext.displayName = 'AppContext'

export const useAppContext = () => useContext(AppContext)

export const AppContextProvider = ({ children }) => {
	const { Provider } = AppContext
	const { get, initialize } = AppModel
	const [state, setState] = React.useState(initialize())

	React.useEffect(() => {
		get()
		// setState((prevState) => ({
		// 	...prevState,
		// 	data,
		// }))
	}, [get])

	// React.useEffect(() => {
	// 	let appSubscription = AppModel.state.subscribe({
	// 		next: (data) => {
	// 			setState((prevState) => ({
	// 				...prevState,
	// 				data: {
	// 					user: data,
	// 				},
	// 			}))
	// 		},
	// 	})
	// 	return () => {
	// 		appSubscription.unsubscribe()
	// 	}
	// }, [])

	const ctx = {
		state,
	}

	return (
		<Provider value={ctx}>
			<>{children}</>
		</Provider>
	)
}
