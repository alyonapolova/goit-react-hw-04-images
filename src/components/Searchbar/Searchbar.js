import React from 'react';
import css from './Searchbar.module.css';
const Searchbar = ({ value, onChange, onSubmit }) => {
  return (
    <form onSubmit={onSubmit} className={css.formSubmit}>
      <button className={css.formBtn} type="submit">
        &#128270;
      </button>
      <label>
        <input
          className={css.searchInput}
          type="text"
          value={value}
          onChange={onChange}
          name="q"
        ></input>
      </label>
    </form>
  );
};

export default Searchbar;
