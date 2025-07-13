import React, { createContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { api_url } from './utils';

export interface GlobalContextType {
	md_macros?: string;
}
export const GlobalContext = createContext<GlobalContextType>({});
const API_URL = api_url();

export function GlobalContextProvider({ children }: { children: React.ReactNode }) {
	const [context, setContext] = useState<GlobalContextType>({});

	useEffect(() => {
		fetch(`${API_URL}/settings?key=md_macros`)
			.then((response) => response.json())
			.then((data) => {
				if (data.status != 'success') toast.error(data.message);
				else setContext({ ...context, "md_macros": data.message });
			})
			.catch((error) => { console.error(error); });
	}, []);

	return (
		<GlobalContext.Provider value={context}>
			{children}
		</GlobalContext.Provider>
	);
}