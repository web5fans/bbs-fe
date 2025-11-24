import S from './index.module.scss'
import SearchIcon from '@/assets/search.svg';
import setInputCursorPos from "@/components/Input/setInputCursorPos";
import cx from "classnames";

const Search = (props: {
  placeholder?: string;
  onSearch?: (value: string) => void;
  onChange?: (value: string) => void;
  value?: string
  className?: string
}) => {
  const { placeholder = '搜索内容', value, className } = props;
  const { inputRef, caretRef, setCursorPos } = setInputCursorPos();

  return <div className={cx(S.wrap, className)} onClick={() => inputRef.current?.focus()}>
    <SearchIcon className={S.icon} />
    <input
      value={value}
      className={S.input}
      placeholder={placeholder}
      ref={inputRef}
      onKeyDownCapture={setCursorPos}
      onKeyUpCapture={setCursorPos}
      onClick={setCursorPos}
      onChange={e => {
        setCursorPos(e);
        props.onChange?.(e.target.value)
      }}
      onFocus={setCursorPos}
      onBlur={() => {
        if (caretRef.current) {
          caretRef.current.style.removeProperty('display');
        }
      }}
      onKeyDown={event => {
        if (event.key === 'Enter') {
          props.onSearch?.(event.target.value)
        }
      }}
    />

    <span
      ref={caretRef}
      className={S.caret}
    />
  </div>
}

export default Search;