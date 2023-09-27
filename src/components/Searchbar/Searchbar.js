import React, { useState } from 'react';
import css from './Searchbar.module.css';
const Searchbar = ({ setQ, onHandleForm }) => {
  const [localQuery, setLocalQuery] = useState('');
  const onSubmitForm = e => {
    e.preventDefault();
    setQ(localQuery);
    onHandleForm();
  };
  const onInputValue = e => {
    console.log(e.target.value);
    setLocalQuery(e.target.value.trim());
  };
  return (
    <form onSubmit={onSubmitForm} className={css.formSubmit}>
      <button className={css.formBtn} type="submit">
        &#128270;
      </button>
      <label>
        <input
          className={css.searchInput}
          type="text"
          value={localQuery}
          onChange={onInputValue}
          name="q"
        ></input>
      </label>
    </form>
  );
};

export default Searchbar;
