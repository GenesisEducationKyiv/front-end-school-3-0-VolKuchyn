import React, { useState, useEffect, ChangeEvent, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { debounce } from 'lodash';
import { setSearch } from '../../redux/tracks-reducer';
import { RootState, AppDispatch } from '../../redux/redux-store';
import HeaderLogo from '../../assets/music-library-by-volodymyr-kuchynskyi.svg';
import './Header.css';

const Header = () => {
    const dispatch: AppDispatch = useDispatch();
    const searchFromRedux = useSelector((state: RootState) => state.tracks.search);
    const [localSearch, setLocalSearch] = useState<string>(searchFromRedux);

    const debouncedSearch = useMemo(
        () => debounce((value: string) => dispatch(setSearch(value)), 1000),
        [dispatch]
    );

    useEffect(() => {
        return () => {
            debouncedSearch.cancel();
        };
    }, [debouncedSearch]);

    useEffect(() => {
        setLocalSearch(searchFromRedux);
    }, [searchFromRedux]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setLocalSearch(value);
        debouncedSearch(value);
    };

    return (
        <header className="app-header" data-testid="tracks-header">
            <a href="http://localhost:3000/">
                <img
                    src={HeaderLogo}
                    alt=""
                    className="header-logo"
                    title="Made by Volodymyr Kuchynskyi"
                />
            </a>

            <input
                type="text"
                className="header-search"
                placeholder="Search..."
                value={localSearch}
                onChange={handleChange}
                data-testid="search-input"
            />

        </header>
    );
};

export default Header;
