export default function SearchBar({ searchTerm, onSearchChange, suggestions, onSuggestionSelect }) {
  return (
    <div className="search-panel">
      <label className="sr-only" htmlFor="post-search">
        Search posts by hashtag
      </label>
      <div className="search-input-wrap">
        <span className="search-icon" aria-hidden="true">
          🔎
        </span>
        <input
          id="post-search"
          type="text"
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search hashtags..."
          aria-label="Search hashtags"
        />
      </div>

      {suggestions.length > 0 && (
        <div className="suggestions" role="listbox" aria-label="Hashtag suggestions">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              className="suggestion-item"
              onClick={() => onSuggestionSelect(suggestion)}
              role="option"
              aria-label={`Use hashtag ${suggestion}`}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
