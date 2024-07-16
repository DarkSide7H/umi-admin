import { Select, Spin } from 'antd';
import debounce from 'lodash/debounce';
import { useEffect, useMemo, useRef, useState } from 'react';

const EnhanceSelect = ({
  preload = true,
  request,
  debounceTime = 500,
  searchKey = 'searchKey',
  formatOptions = (options) => options,
  ...props
}) => {
  const [fetching, setFetching] = useState(false);
  const [options, setOptions] = useState([]);
  const fetchRef = useRef(0);

  const debounceFetcher = useMemo(() => {
    const loadOptions = (value) => {
      fetchRef.current += 1;
      const fetchId = fetchRef.current;
      setOptions([]);
      setFetching(true);
      request({ [searchKey]: value }).then((res) => {
        if (fetchId !== fetchRef.current) {
          return;
        }
        const fetchedOptions = Array.isArray(res) ? res : res?.records || [];
        const formattedOptions = formatOptions(fetchedOptions);
        setOptions(formattedOptions);
        setFetching(false);
      });
    };
    return debounce(loadOptions, debounceTime);
  }, [request, debounceTime, formatOptions]);

  useEffect(() => {
    if (preload && request) {
      debounceFetcher();
    }
  }, []);

  return (
    <Select
      showSearch
      allowClear
      filterOption={false}
      onSearch={debounceFetcher}
      popupMatchSelectWidth={false}
      notFoundContent={fetching ? <Spin size="small" /> : null}
      options={options}
      {...props}
    />
  );
};

export default EnhanceSelect;
