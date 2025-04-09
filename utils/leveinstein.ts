export const getStringDifference = (str1: string, str2: string): number => {
  let errors = 0;
  const maxLen = Math.max(str1.length, str2.length);

  for (let i = 0; i < maxLen; i++) {
    if (i >= str1.length || i >= str2.length) {
      errors++;
    }
    if (str1[i] !== str2[i]) {
      errors++;
    }
  }

  return errors;
};

const normalizeString = (str: string): string => {
  return str.toLowerCase().replace(/[^a-z0-9]/g, " ");
};

export const isValidSearch = (search: string, toSearchFor: string) => {
  const maxErrors = Math.floor(search.length * 0.4);

  const normalizedSearch = normalizeString(search);
  const normalizedToSearchFor = normalizeString(toSearchFor);

  const words = normalizedToSearchFor.split(/\s+/);
  const searchWords = normalizedSearch.split(/\s+/);

  let errors = Number.MAX_SAFE_INTEGER;

  // Compare each word in boss name with each word in search term
  for (const word of words) {
    if (word.length < 4) continue; // Skip words shorter than 4 chars

    for (const searchWord of searchWords) {
      if (searchWord.length < 4) continue; // Skip words shorter than 4 chars

      const wordDiff = getStringDifference(word, searchWord);
      errors = Math.min(errors, wordDiff);
    }
  }

  if (errors === Number.MAX_SAFE_INTEGER) {
    errors = getStringDifference(
      search.toLowerCase(),
      toSearchFor.toLowerCase()
    );
  }

  if (errors > maxErrors) return false;

  return errors <= maxErrors;
};
