import iso from "./iso";
import iso2 from "./iso2";
import map from "./names";

/** Language parser
 * @param name: A language string to be parsed
 * @returns {~ normalized language}
 */
export default name => {
  // Validate the name string
  if (typeof name !== "string") {
    throw new Error(`The "language" must be a string, received ${typeof name}`);
  }
  // Possible overflow errors
  if (name.length > 100) {
    throw new Error(`The "language" is too long at ${name.length} characters`);
  }

  // Let's work with lowercase for everything
  name = name.toLowerCase();

  // Pass it through several possible maps to try to find the right one
  name = map[name] || iso2[name] || name;

  // Make sure we have the correct name or throw
  if (!iso.includes(name)) {
    throw new Error(`The language "${name}" is not part of the ISO 639-1`);
  }
  return name;
};
