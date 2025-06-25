import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SearchContextType {
    search: string;
    setSearch: (q: string) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const useSearch = () => {
    const ctx = useContext(SearchContext);
    if (!ctx) throw new Error('useSearch must be used within a SearchProvider');
    return ctx;
};

export const SearchProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [search, setSearch] = useState('');
    return (
        <SearchContext.Provider value={{ search, setSearch }}>
            {children}
        </SearchContext.Provider>
    );
}; 