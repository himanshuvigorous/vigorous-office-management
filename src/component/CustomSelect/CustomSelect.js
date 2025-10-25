import { useEffect, useRef, useState } from "react";

export const CustomSelect = ({ options, value, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredOptions, setFilteredOptions] = useState(options);
  const selectRef = useRef(null);

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };


  const handleOptionClick = (selectedValue) => {
    // Find the selected option by its value
    const selectedOption = options.find(option => option.value === selectedValue);
    if (selectedOption) {
      onChange(selectedValue); // Update the parent component's state
      setSearchQuery(selectedOption.label); // Update the input with the selected label
      setIsOpen(false); // Close the dropdown
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    // Filter options based on the search query (case-insensitive)
    const filtered = options.filter(option =>
      option.label.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredOptions(filtered);
  };

  // Update filtered options when options prop changes
  useEffect(() => {
    setFilteredOptions(options);
  }, [options]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false); // Close dropdown if clicked outside
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={selectRef} className="relative w-full">
      {/* Custom select box with search */}
      <div
        className="cursor-pointer relative border border-gray-300 rounded-md px-4 py-2 text-sm text-gray-600 bg-white focus:ring-2 focus:ring-blue-500"
        onClick={toggleDropdown}
      >
        <input
          type="text"
          className="w-full text-sm text-gray-600 bg-transparent border-none outline-none focus:ring-0"
          placeholder={placeholder}
          value={searchQuery} // Set input value to the search query or selected label
          onChange={handleSearchChange}
        />
      </div>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-60 overflow-auto">
          {/* Filtered options */}
          {filteredOptions?.length > 0 ? (
            filteredOptions.map((option) => (
              <div
                key={option.value}
                className="p-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-100"
                onClick={() => handleOptionClick(option.value)}
              >
                {option.label}
              </div>
            ))
          ) : (
            <div className="p-2 text-sm text-gray-500">No options found</div>
          )}
        </div>
      )}
    </div>
  );
};

// export const CustomSelect = ({ options, value, onChange, placeholder }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [filteredOptions, setFilteredOptions] = useState(options);

//   const toggleDropdown = () => {
//     setIsOpen(!isOpen);
//   };

//   const handleOptionClick = (selectedValue) => {
//     onChange(selectedValue);
//     setIsOpen(false);
//     setSearchQuery(''); // Clear search query when selecting an option
//   };

//   const handleSearchChange = (e) => {
//     const query = e.target.value;
//     setSearchQuery(query);
//     // Filter options based on the search query (case-insensitive)
//     const filtered = options.filter(option =>
//       option.label.toLowerCase().includes(query.toLowerCase())
//     );
//     setFilteredOptions(filtered);
//   };

//   return (
//     <div className="relative w-full">
//       {/* Custom select box */}
//       <div
//         className={`cursor-pointer relative border ${
//           isOpen ? 'border-gray-300' : 'border-gray-300'
//         } rounded-md px-4 py-2 text-sm text-gray-600 bg-white focus:ring-2 focus:ring-blue-500`}
//         onClick={toggleDropdown}
//       >
//         <span className="block">{value ? options.find(option => option.value === value)?.label : placeholder}</span>
//       </div>

//       {/* Dropdown menu */}
//       {isOpen && (
//         <div className="absolute w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-60 overflow-auto">
//           {/* Search input */}
//           <input
//             type="text"
//             className="w-full p-2 text-sm text-gray-700 border-b border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             placeholder="Search..."
//             value={searchQuery}
//             onChange={handleSearchChange}
//           />

//           {/* Options */}
//           {filteredOptions.length > 0 ? (
//             filteredOptions.map((option) => (
//               <div
//                 key={option.value}
//                 className="p-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-100"
//                 onClick={() => handleOptionClick(option.value)}
//               >
//                 {option.label}
//               </div>
//             ))
//           ) : (
//             <div className="p-2 text-sm text-gray-500">No options found</div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };
