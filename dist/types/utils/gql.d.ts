interface StringCompatible {
    toString(): string;
}
/**
 * Tagged template literal to enable syntax highlighting for inline GraphQL queries
 *
 * @example
 * import { gql } from '/path/to/utils';
 *
 * gql`
 *   query {
 *     getBirthdayInfo(user: 'nacelleBot') {
 *       date
 *       astrologySign
 *     }
 *   }
 * `
 */
export default function gql(str: TemplateStringsArray, ...values: StringCompatible[]): string;
export {};
