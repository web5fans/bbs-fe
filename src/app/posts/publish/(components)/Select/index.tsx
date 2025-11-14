'use client'

import { useEffect, useRef, useState } from "react";
import CaretIcon from '@/assets/caret.svg';
import S from './index.module.scss'
import cx from "classnames";

type OptionValueType = string | number;

type SelectProps = {
  options: { value: OptionValueType, label: string, [key: string]: any }[]
  renderItem?: (item: any) => React.ReactNode
  onChange: (value: OptionValueType) => void
  selectedValue?: OptionValueType
  className?: string
  placeholder?: string
}

const StyledSelect = (props: SelectProps) => {
  const { selectedValue, options, placeholder } = props;
  const [value, setValue] = useState('')
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭下拉框
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 获取当前选中项的标签
  const selectedLabel = options.find(opt => opt.value === selectedValue)?.label || placeholder || '选择版区';

  const handleSelect = (optionValue: string) => {
    props.onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div
      ref={selectRef}
      className={cx(S.wrap, props.className)}
      // style={style}
    >
      {/* 选择框 */}
      <div
        className={cx(S.select, isOpen && S.popOverOpened)}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={cx(S.selectValue, selectedValue !== undefined && '!text-black')}>{selectedLabel}</span>
        <CaretIcon className={cx(S.caret, isOpen ? '!transform-[rotate(0)]' : '')} />
      </div>

      {/* 下拉菜单 */}
      {isOpen && (
        <div className={cx(S.popover)}>

          {/* 选项列表 */}
          <div className={S.popoverInner}>
            {options.map((option) => (
              <div
                key={option.value}
                className={`${S.popoverItem} ${selectedValue === option.value ? S.selected : ''}`}
                onClick={() => handleSelect(option.value)}
              >
                {props.renderItem?.(option) || option.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default StyledSelect;