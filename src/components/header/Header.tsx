import React, { useEffect, useState, ChangeEvent, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { debounce } from 'lodash';
import HeaderLogo from '../../assets/music-library-by-volodymyr-kuchynskyi.svg';
import './Header.css';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [localSearch, setLocalSearch] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get('search') || '';
    setLocalSearch(searchParam);
  }, [location.search]);

  const updateSearch = useMemo(
    () =>
      debounce((value: string) => {
        const params = new URLSearchParams(location.search);
        if (value) {
          params.set('search', value);
        } else {
          params.delete('search');
        }
        navigate({ search: params.toString() }, { replace: true });
      }, 500),
    [location, navigate]
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearch(value);
    updateSearch(value);
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
