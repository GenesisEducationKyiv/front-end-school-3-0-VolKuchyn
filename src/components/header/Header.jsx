import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { debounce } from 'lodash';
import { setSearch } from '../../redux/tracks-reducer';
import HeaderLogo from '../../assets/music-library-by-volodymyr-kuchynskyi.svg'
import './Header.css';

const Header = () => {
    const dispatch = useDispatch();
    const searchFromRedux = useSelector((state) => state.tracks.search);
    const [localSearch, setLocalSearch] = useState(searchFromRedux);

    const debouncedSearch = useCallback(
        debounce((value) => {
            dispatch(setSearch(value));
        }, 1000),
        [dispatch]
    );

    useEffect(() => {
        setLocalSearch(searchFromRedux);
    }, [searchFromRedux]);

    return (
        <header className="app-header" data-testid="tracks-header">
            <a href="http://localhost:3000/">
                <img src={HeaderLogo} alt="" className="header-logo" title="Made by Volodymyr Kuchynskyi" />

            </a>
            <input
                type="text"
                className="header-search"
                placeholder="Search..."
                value={localSearch}
                onChange={(e) => {
                    const value = e.target.value;
                    setLocalSearch(value);
                    debouncedSearch(value);
                }}
                data-testid="search-input"
            />

            {/*Unused because input contains search by artist, album, title etc...*/}
            <input
                type="text"
                className="header-search"
                placeholder="Search..."
                style={{ display: 'none' }}
                value={localSearch}
                onChange={(e) => {
                    const value = e.target.value;
                    setLocalSearch(value);
                    debouncedSearch(value);
                }}
                data-testid="filter-artist"
            />
        </header>
    );
};

export default Header;