import {
  CompletionItem,
  CompletionItemKind,
  InsertTextFormat,
  MarkupContent,
} from "vscode-languageserver/node";
import { md } from "./utils";

/**
 * Documentation for Twig filters
 */
export const FILTER_DOCS: Record<string, MarkupContent> = {
  abs: md(`### abs
Returns the absolute value of a number.

**Syntax:** \`number|abs\`

**Example:**
\`\`\`twig
{{ -5|abs }}
{# outputs: 5 #}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/filters/abs.html)`),

  batch: md(`### batch
Batches items into arrays of the given size.

**Syntax:** \`array|batch(size, fill)\`

**Parameters:**
- \`size\` - The batch size
- \`fill\` (optional) - Value to fill incomplete batches

**Example:**
\`\`\`twig
{% for row in items|batch(3, 'No item') %}
  <tr>
    {% for item in row %}
      <td>{{ item }}</td>
    {% endfor %}
  </tr>
{% endfor %}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/filters/batch.html)`),

  capitalize: md(`### capitalize
Capitalizes the first character of a string.

**Syntax:** \`string|capitalize\`

**Example:**
\`\`\`twig
{{ 'hello world'|capitalize }}
{# outputs: Hello world #}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/filters/capitalize.html)`),

  column: md(`### column
Extracts a single column from an array of arrays or objects.

**Syntax:** \`array|column(name)\`

**Parameters:**
- \`name\` - The column name to extract

**Example:**
\`\`\`twig
{% set users = [
  {name: 'Alice', age: 30},
  {name: 'Bob', age: 25}
] %}
{{ users|column('name')|join(', ') }}
{# outputs: Alice, Bob #}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/filters/column.html)`),

  convert_encoding: md(`### convert_encoding
Converts a string from one encoding to another.

**Syntax:** \`string|convert_encoding(to, from)\`

**Parameters:**
- \`to\` - The target encoding
- \`from\` - The source encoding

**Example:**
\`\`\`twig
{{ data|convert_encoding('UTF-8', 'ISO-8859-1') }}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/filters/convert_encoding.html)`),

  country_name: md(`### country_name
Returns the country name for a given ISO 3166-1 alpha-2 code.

**Syntax:** \`code|country_name(locale)\`

**Parameters:**
- \`locale\` (optional) - The locale for the name

**Example:**
\`\`\`twig
{{ 'US'|country_name }}
{# outputs: United States #}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/filters/country_name.html)`),

  currency_name: md(`### currency_name
Returns the currency name for a given ISO 4217 code.

**Syntax:** \`code|currency_name(locale)\`

**Parameters:**
- \`locale\` (optional) - The locale for the name

**Example:**
\`\`\`twig
{{ 'EUR'|currency_name }}
{# outputs: Euro #}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/filters/currency_name.html)`),

  currency_symbol: md(`### currency_symbol
Returns the currency symbol for a given ISO 4217 code.

**Syntax:** \`code|currency_symbol(locale)\`

**Parameters:**
- \`locale\` (optional) - The locale for the symbol

**Example:**
\`\`\`twig
{{ 'EUR'|currency_symbol }}
{# outputs: € #}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/filters/currency_symbol.html)`),

  data_uri: md(`### data_uri
Generates a data URI for inline embedding of content.

**Syntax:** \`content|data_uri(mime, parameters)\`

**Parameters:**
- \`mime\` (optional) - The MIME type
- \`parameters\` (optional) - Additional parameters

**Example:**
\`\`\`twig
{{ image_data|data_uri('image/png') }}
{# outputs: data:image/png;base64,... #}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/filters/data_uri.html)`),

  date: md(`### date
Formats a date to a given format.

**Syntax:** \`date|date(format, timezone)\`

**Parameters:**
- \`format\` - The date format (PHP date format)
- \`timezone\` (optional) - The timezone

**Example:**
\`\`\`twig
{{ post.created_at|date('Y-m-d H:i:s') }}
{# outputs: 2024-01-15 14:30:00 #}

{{ 'now'|date('F j, Y') }}
{# outputs: January 15, 2024 #}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/filters/date.html)`),

  date_modify: md(`### date_modify
Modifies a date by adding or subtracting time.

**Syntax:** \`date|date_modify(modifier)\`

**Parameters:**
- \`modifier\` - A date modifier string (PHP relative formats)

**Example:**
\`\`\`twig
{{ post.created_at|date_modify('+1 day')|date('Y-m-d') }}
{{ event.date|date_modify('-2 weeks')|date('F j') }}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/filters/date_modify.html)`),

  default: md(`### default
Returns the default value if the value is undefined or empty.

**Syntax:** \`value|default(default_value)\`

**Parameters:**
- \`default_value\` - The fallback value

**Example:**
\`\`\`twig
{{ user.name|default('Anonymous') }}
{{ settings.theme|default('light') }}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/filters/default.html)`),

  escape: md(`### escape
Escapes a string for safe output in a specific context.

**Syntax:** \`string|escape(strategy)\`

**Parameters:**
- \`strategy\` - The escape strategy: \`html\`, \`js\`, \`css\`, \`url\`, \`html_attr\`

**Example:**
\`\`\`twig
{{ user_input|escape }}
{{ user_input|escape('js') }}
{{ url_param|escape('url') }}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/filters/escape.html)`),

  e: md(`### e (escape alias)
Alias for the \`escape\` filter.

**Syntax:** \`string|e(strategy)\`

**Parameters:**
- \`strategy\` - The escape strategy: \`html\`, \`js\`, \`css\`, \`url\`, \`html_attr\`

**Example:**
\`\`\`twig
{{ user_input|e }}
{{ user_input|e('js') }}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/filters/escape.html)`),

  filter: md(`### filter
Filters elements of an array using an arrow function.

**Syntax:** \`array|filter(arrow)\`

**Parameters:**
- \`arrow\` - An arrow function that returns true to keep the element

**Example:**
\`\`\`twig
{% set numbers = [1, 2, 3, 4, 5] %}
{{ numbers|filter(n => n > 2)|join(', ') }}
{# outputs: 3, 4, 5 #}

{% set users = users|filter(u => u.active) %}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/filters/filter.html)`),

  first: md(`### first
Returns the first element of an array or string.

**Syntax:** \`sequence|first\`

**Example:**
\`\`\`twig
{{ [1, 2, 3]|first }}
{# outputs: 1 #}

{{ 'Hello'|first }}
{# outputs: H #}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/filters/first.html)`),

  format: md(`### format
Formats a string by replacing placeholders.

**Syntax:** \`string|format(values...)\`

**Parameters:**
- \`values\` - Values to replace placeholders (printf-style)

**Example:**
\`\`\`twig
{{ 'Hello %s, you have %d messages'|format(name, count) }}
{{ '%s has %.2f points'|format(player, score) }}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/filters/format.html)`),

  format_currency: md(`### format_currency
Formats a number as a currency string.

**Syntax:** \`number|format_currency(currency, attrs, locale)\`

**Parameters:**
- \`currency\` - The ISO 4217 currency code
- \`attrs\` (optional) - Formatting attributes
- \`locale\` (optional) - The locale

**Example:**
\`\`\`twig
{{ 19.99|format_currency('USD') }}
{# outputs: $19.99 #}

{{ 1234.56|format_currency('EUR', locale='de') }}
{# outputs: 1.234,56 € #}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/filters/format_currency.html)`),

  format_date: md(`### format_date
Formats a date using ICU date formatting.

**Syntax:** \`date|format_date(dateFormat, pattern, timezone, locale)\`

**Parameters:**
- \`dateFormat\` - Predefined format: \`none\`, \`short\`, \`medium\`, \`long\`, \`full\`
- \`pattern\` (optional) - Custom ICU pattern
- \`timezone\` (optional) - The timezone
- \`locale\` (optional) - The locale

**Example:**
\`\`\`twig
{{ post.date|format_date('long') }}
{# outputs: January 15, 2024 #}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/filters/format_date.html)`),

  format_datetime: md(`### format_datetime
Formats a date and time using ICU formatting.

**Syntax:** \`date|format_datetime(dateFormat, timeFormat, pattern, timezone, locale)\`

**Parameters:**
- \`dateFormat\` - Date format: \`none\`, \`short\`, \`medium\`, \`long\`, \`full\`
- \`timeFormat\` - Time format: \`none\`, \`short\`, \`medium\`, \`long\`, \`full\`

**Example:**
\`\`\`twig
{{ event.datetime|format_datetime('long', 'short') }}
{# outputs: January 15, 2024 at 2:30 PM #}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/filters/format_datetime.html)`),

  format_number: md(`### format_number
Formats a number according to locale rules.

**Syntax:** \`number|format_number(attrs, style, type, locale)\`

**Parameters:**
- \`attrs\` (optional) - Formatting attributes
- \`style\` (optional) - Style: \`decimal\`, \`currency\`, \`percent\`, \`scientific\`, \`spellout\`, \`ordinal\`
- \`type\` (optional) - Type: \`default\`, \`int32\`, \`int64\`, \`double\`, \`currency\`
- \`locale\` (optional) - The locale

**Example:**
\`\`\`twig
{{ 1234567.89|format_number }}
{# outputs: 1,234,567.89 #}

{{ 0.25|format_number(style='percent') }}
{# outputs: 25% #}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/filters/format_number.html)`),

  format_time: md(`### format_time
Formats a time using ICU time formatting.

**Syntax:** \`time|format_time(timeFormat, pattern, timezone, locale)\`

**Parameters:**
- \`timeFormat\` - Predefined format: \`none\`, \`short\`, \`medium\`, \`long\`, \`full\`

**Example:**
\`\`\`twig
{{ event.time|format_time('short') }}
{# outputs: 2:30 PM #}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/filters/format_time.html)`),

  html_to_markdown: md(`### html_to_markdown
Converts HTML to Markdown.

**Syntax:** \`html|html_to_markdown\`

**Example:**
\`\`\`twig
{{ '<strong>bold</strong> and <em>italic</em>'|html_to_markdown }}
{# outputs: **bold** and *italic* #}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/filters/html_to_markdown.html)`),

  inline_css: md(`### inline_css
Inlines CSS styles into HTML elements.

**Syntax:** \`html|inline_css(css)\`

**Parameters:**
- \`css\` (optional) - CSS to inline

**Example:**
\`\`\`twig
{{ email_body|inline_css(source('styles.css')) }}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/filters/inline_css.html)`),

  inky_to_html: md(`### inky_to_html
Converts Inky markup to HTML (for responsive emails).

**Syntax:** \`inky|inky_to_html\`

**Example:**
\`\`\`twig
{{ email_template|inky_to_html }}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/filters/inky_to_html.html)`),

  join: md(`### join
Joins array elements into a string.

**Syntax:** \`array|join(glue, and)\`

**Parameters:**
- \`glue\` - The separator between elements
- \`and\` (optional) - Separator before the last element

**Example:**
\`\`\`twig
{{ ['a', 'b', 'c']|join(', ') }}
{# outputs: a, b, c #}

{{ ['Alice', 'Bob', 'Charlie']|join(', ', ' and ') }}
{# outputs: Alice, Bob and Charlie #}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/filters/join.html)`),

  json_encode: md(`### json_encode
Encodes a value as JSON.

**Syntax:** \`value|json_encode(options)\`

**Parameters:**
- \`options\` (optional) - JSON encoding options (bitmask)

**Example:**
\`\`\`twig
<script>
  var data = {{ user|json_encode|raw }};
</script>

{{ data|json_encode(constant('JSON_PRETTY_PRINT')) }}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/filters/json_encode.html)`),

  keys: md(`### keys
Returns the keys of an array.

**Syntax:** \`array|keys\`

**Example:**
\`\`\`twig
{% set data = {name: 'Alice', age: 30} %}
{{ data|keys|join(', ') }}
{# outputs: name, age #}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/filters/keys.html)`),

  language_name: md(`### language_name
Returns the language name for a given ISO 639-1 code.

**Syntax:** \`code|language_name(locale)\`

**Parameters:**
- \`locale\` (optional) - The locale for the name

**Example:**
\`\`\`twig
{{ 'fr'|language_name }}
{# outputs: French #}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/filters/language_name.html)`),

  last: md(`### last
Returns the last element of an array or string.

**Syntax:** \`sequence|last\`

**Example:**
\`\`\`twig
{{ [1, 2, 3]|last }}
{# outputs: 3 #}

{{ 'Hello'|last }}
{# outputs: o #}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/filters/last.html)`),

  length: md(`### length
Returns the number of items in an array or characters in a string.

**Syntax:** \`sequence|length\`

**Example:**
\`\`\`twig
{{ [1, 2, 3]|length }}
{# outputs: 3 #}

{{ 'Hello'|length }}
{# outputs: 5 #}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/filters/length.html)`),

  locale_name: md(`### locale_name
Returns the locale name for a given locale code.

**Syntax:** \`code|locale_name(locale)\`

**Parameters:**
- \`locale\` (optional) - The locale for the name

**Example:**
\`\`\`twig
{{ 'en_US'|locale_name }}
{# outputs: English (United States) #}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/filters/locale_name.html)`),

  lower: md(`### lower
Converts a string to lowercase.

**Syntax:** \`string|lower\`

**Example:**
\`\`\`twig
{{ 'HELLO WORLD'|lower }}
{# outputs: hello world #}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/filters/lower.html)`),

  map: md(`### map
Applies an arrow function to each element of an array.

**Syntax:** \`array|map(arrow)\`

**Parameters:**
- \`arrow\` - An arrow function to apply to each element

**Example:**
\`\`\`twig
{% set numbers = [1, 2, 3] %}
{{ numbers|map(n => n * 2)|join(', ') }}
{# outputs: 2, 4, 6 #}

{% set names = users|map(u => u.name) %}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/filters/map.html)`),

  markdown_to_html: md(`### markdown_to_html
Converts Markdown to HTML.

**Syntax:** \`markdown|markdown_to_html\`

**Example:**
\`\`\`twig
{{ post.content|markdown_to_html }}
{{ '**bold** and *italic*'|markdown_to_html }}
{# outputs: <strong>bold</strong> and <em>italic</em> #}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/filters/markdown_to_html.html)`),

  merge: md(`### merge
Merges arrays or hashes together.

**Syntax:** \`array|merge(array2)\`

**Parameters:**
- \`array2\` - The array to merge

**Example:**
\`\`\`twig
{% set items = [1, 2]|merge([3, 4]) %}
{# items is [1, 2, 3, 4] #}

{% set defaults = {color: 'blue', size: 'M'} %}
{% set options = defaults|merge({size: 'L'}) %}
{# options is {color: 'blue', size: 'L'} #}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/filters/merge.html)`),

  nl2br: md(`### nl2br
Converts newlines to HTML \`<br>\` tags.

**Syntax:** \`string|nl2br\`

**Example:**
\`\`\`twig
{{ "Line 1\\nLine 2"|nl2br }}
{# outputs: Line 1<br>Line 2 #}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/filters/nl2br.html)`),

  number_format: md(`### number_format
Formats a number with grouped thousands and decimal points.

**Syntax:** \`number|number_format(decimals, decimal_point, thousands_sep)\`

**Parameters:**
- \`decimals\` - Number of decimal places
- \`decimal_point\` (optional) - Character for decimal point
- \`thousands_sep\` (optional) - Character for thousands separator

**Example:**
\`\`\`twig
{{ 1234567.891|number_format(2, '.', ',') }}
{# outputs: 1,234,567.89 #}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/filters/number_format.html)`),

  raw: md(`### raw
Marks a value as safe, preventing auto-escaping.

**Syntax:** \`string|raw\`

**Example:**
\`\`\`twig
{{ '<strong>Bold</strong>'|raw }}
{# outputs: <strong>Bold</strong> (not escaped) #}
\`\`\`

**Warning:** Only use with trusted content to avoid XSS vulnerabilities.

[Twig Documentation](https://twig.symfony.com/doc/3.x/filters/raw.html)`),

  reduce: md(`### reduce
Reduces an array to a single value using an arrow function.

**Syntax:** \`array|reduce(arrow, initial)\`

**Parameters:**
- \`arrow\` - An arrow function that takes accumulator and current value
- \`initial\` (optional) - Initial accumulator value

**Example:**
\`\`\`twig
{% set numbers = [1, 2, 3, 4] %}
{{ numbers|reduce((carry, n) => carry + n, 0) }}
{# outputs: 10 #}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/filters/reduce.html)`),

  replace: md(`### replace
Replaces placeholders in a string.

**Syntax:** \`string|replace(replacements)\`

**Parameters:**
- \`replacements\` - A hash of replacements

**Example:**
\`\`\`twig
{{ 'Hello %name%!'|replace({'%name%': 'World'}) }}
{# outputs: Hello World! #}

{{ text|replace({'foo': 'bar', 'baz': 'qux'}) }}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/filters/replace.html)`),

  reverse: md(`### reverse
Reverses an array or string.

**Syntax:** \`sequence|reverse\`

**Example:**
\`\`\`twig
{{ [1, 2, 3]|reverse|join(', ') }}
{# outputs: 3, 2, 1 #}

{{ 'Hello'|reverse }}
{# outputs: olleH #}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/filters/reverse.html)`),

  round: md(`### round
Rounds a number to a given precision.

**Syntax:** \`number|round(precision, method)\`

**Parameters:**
- \`precision\` - Number of decimal places (default: 0)
- \`method\` - Rounding method: \`common\`, \`ceil\`, \`floor\` (default: common)

**Example:**
\`\`\`twig
{{ 2.7|round }}
{# outputs: 3 #}

{{ 2.345|round(2) }}
{# outputs: 2.35 #}

{{ 2.1|round(0, 'ceil') }}
{# outputs: 3 #}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/filters/round.html)`),

  slice: md(`### slice
Extracts a slice of an array or string.

**Syntax:** \`sequence|slice(start, length)\`

**Parameters:**
- \`start\` - Start index (can be negative)
- \`length\` (optional) - Number of elements to extract

**Example:**
\`\`\`twig
{{ [1, 2, 3, 4, 5]|slice(1, 2)|join(', ') }}
{# outputs: 2, 3 #}

{{ 'Hello'|slice(0, 3) }}
{# outputs: Hel #}

{{ 'Hello'|slice(-2) }}
{# outputs: lo #}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/filters/slice.html)`),

  slug: md(`### slug
Transforms a string into a URL-friendly slug.

**Syntax:** \`string|slug(separator, locale)\`

**Parameters:**
- \`separator\` (optional) - Word separator (default: \`-\`)
- \`locale\` (optional) - The locale for transliteration

**Example:**
\`\`\`twig
{{ 'Hello World!'|slug }}
{# outputs: hello-world #}

{{ 'Héllo Wörld'|slug }}
{# outputs: hello-world #}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/filters/slug.html)`),

  sort: md(`### sort
Sorts an array.

**Syntax:** \`array|sort(arrow)\`

**Parameters:**
- \`arrow\` (optional) - An arrow function for custom sorting

**Example:**
\`\`\`twig
{{ [3, 1, 2]|sort|join(', ') }}
{# outputs: 1, 2, 3 #}

{% set users = users|sort((a, b) => a.name <=> b.name) %}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/filters/sort.html)`),

  spaceless: md(`### spaceless
Removes whitespace between HTML tags.

**Syntax:** \`html|spaceless\`

**Example:**
\`\`\`twig
{{ '<div>  <span>text</span>  </div>'|spaceless }}
{# outputs: <div><span>text</span></div> #}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/filters/spaceless.html)`),

  split: md(`### split
Splits a string by a delimiter.

**Syntax:** \`string|split(delimiter, limit)\`

**Parameters:**
- \`delimiter\` - The delimiter string
- \`limit\` (optional) - Maximum number of splits

**Example:**
\`\`\`twig
{{ 'a,b,c'|split(',')|join(' - ') }}
{# outputs: a - b - c #}

{{ '1-2-3-4'|split('-', 2)|join(', ') }}
{# outputs: 1, 2-3-4 #}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/filters/split.html)`),

  striptags: md(`### striptags
Strips HTML and PHP tags from a string.

**Syntax:** \`string|striptags(allowed_tags)\`

**Parameters:**
- \`allowed_tags\` (optional) - Tags to keep

**Example:**
\`\`\`twig
{{ '<p><strong>text</strong></p>'|striptags }}
{# outputs: text #}

{{ '<p><strong>text</strong></p>'|striptags('<p>') }}
{# outputs: <p>text</p> #}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/filters/striptags.html)`),

  timezone_name: md(`### timezone_name
Returns the timezone name for a given timezone identifier.

**Syntax:** \`timezone|timezone_name(locale)\`

**Parameters:**
- \`locale\` (optional) - The locale for the name

**Example:**
\`\`\`twig
{{ 'America/New_York'|timezone_name }}
{# outputs: Eastern Time #}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/filters/timezone_name.html)`),

  title: md(`### title
Converts a string to title case.

**Syntax:** \`string|title\`

**Example:**
\`\`\`twig
{{ 'hello world'|title }}
{# outputs: Hello World #}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/filters/title.html)`),

  trim: md(`### trim
Strips whitespace from the beginning and end of a string.

**Syntax:** \`string|trim(character_mask, side)\`

**Parameters:**
- \`character_mask\` (optional) - Characters to trim (default: whitespace)
- \`side\` (optional) - \`both\`, \`left\`, or \`right\` (default: both)

**Example:**
\`\`\`twig
{{ '  Hello World  '|trim }}
{# outputs: Hello World #}

{{ '...Hello...'|trim('.') }}
{# outputs: Hello #}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/filters/trim.html)`),

  u: md(`### u (Unicode string)
Creates a Unicode string object for advanced string manipulation.

**Syntax:** \`string|u\`

**Example:**
\`\`\`twig
{{ 'hello'|u.upper }}
{{ text|u.truncate(50, '...') }}
{{ title|u.snake }}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/filters/u.html)`),

  upper: md(`### upper
Converts a string to uppercase.

**Syntax:** \`string|upper\`

**Example:**
\`\`\`twig
{{ 'hello world'|upper }}
{# outputs: HELLO WORLD #}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/filters/upper.html)`),

  url_encode: md(`### url_encode
URL-encodes a string.

**Syntax:** \`string|url_encode\`

**Example:**
\`\`\`twig
{{ 'hello world'|url_encode }}
{# outputs: hello%20world #}

{{ path ~ '?q=' ~ query|url_encode }}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/filters/url_encode.html)`),
};

/**
 * Twig built-in filters
 */
export const TWIG_FILTERS: CompletionItem[] = [
  {
    label: "abs",
    kind: CompletionItemKind.Function,
    detail: "Absolute value",
    documentation: FILTER_DOCS["abs"],
  },
  {
    label: "batch",
    kind: CompletionItemKind.Function,
    insertText: "batch(${1:size})",
    insertTextFormat: InsertTextFormat.Snippet,
    detail: "Batch items",
    documentation: FILTER_DOCS["batch"],
  },
  {
    label: "capitalize",
    kind: CompletionItemKind.Function,
    detail: "Capitalize first char",
    documentation: FILTER_DOCS["capitalize"],
  },
  {
    label: "column",
    kind: CompletionItemKind.Function,
    insertText: "column('${1:name}')",
    insertTextFormat: InsertTextFormat.Snippet,
    detail: "Extract column",
    documentation: FILTER_DOCS["column"],
  },
  {
    label: "convert_encoding",
    kind: CompletionItemKind.Function,
    insertText: "convert_encoding('${1:to}', '${2:from}')",
    insertTextFormat: InsertTextFormat.Snippet,
    detail: "Convert encoding",
    documentation: FILTER_DOCS["convert_encoding"],
  },
  {
    label: "country_name",
    kind: CompletionItemKind.Function,
    detail: "Country name",
    documentation: FILTER_DOCS["country_name"],
  },
  {
    label: "currency_name",
    kind: CompletionItemKind.Function,
    detail: "Currency name",
    documentation: FILTER_DOCS["currency_name"],
  },
  {
    label: "currency_symbol",
    kind: CompletionItemKind.Function,
    detail: "Currency symbol",
    documentation: FILTER_DOCS["currency_symbol"],
  },
  {
    label: "data_uri",
    kind: CompletionItemKind.Function,
    detail: "Data URI",
    documentation: FILTER_DOCS["data_uri"],
  },
  {
    label: "date",
    kind: CompletionItemKind.Function,
    insertText: "date('${1:format}')",
    insertTextFormat: InsertTextFormat.Snippet,
    detail: "Format date",
    documentation: FILTER_DOCS["date"],
  },
  {
    label: "date_modify",
    kind: CompletionItemKind.Function,
    insertText: "date_modify('${1:modifier}')",
    insertTextFormat: InsertTextFormat.Snippet,
    detail: "Modify date",
    documentation: FILTER_DOCS["date_modify"],
  },
  {
    label: "default",
    kind: CompletionItemKind.Function,
    insertText: "default('${1:value}')",
    insertTextFormat: InsertTextFormat.Snippet,
    detail: "Default value",
    documentation: FILTER_DOCS["default"],
  },
  {
    label: "escape",
    kind: CompletionItemKind.Function,
    insertText: "escape('${1|html,js,css,url,html_attr|}')",
    insertTextFormat: InsertTextFormat.Snippet,
    detail: "Escape string",
    documentation: FILTER_DOCS["escape"],
  },
  {
    label: "e",
    kind: CompletionItemKind.Function,
    insertText: "e('${1|html,js,css,url,html_attr|}')",
    insertTextFormat: InsertTextFormat.Snippet,
    detail: "Escape (alias)",
    documentation: FILTER_DOCS["e"],
  },
  {
    label: "filter",
    kind: CompletionItemKind.Function,
    insertText: "filter(${1:arrow})",
    insertTextFormat: InsertTextFormat.Snippet,
    detail: "Filter items",
    documentation: FILTER_DOCS["filter"],
  },
  {
    label: "first",
    kind: CompletionItemKind.Function,
    detail: "First element",
    documentation: FILTER_DOCS["first"],
  },
  {
    label: "format",
    kind: CompletionItemKind.Function,
    insertText: "format(${1:args})",
    insertTextFormat: InsertTextFormat.Snippet,
    detail: "Format string",
    documentation: FILTER_DOCS["format"],
  },
  {
    label: "format_currency",
    kind: CompletionItemKind.Function,
    insertText: "format_currency('${1:currency}')",
    insertTextFormat: InsertTextFormat.Snippet,
    detail: "Format currency",
    documentation: FILTER_DOCS["format_currency"],
  },
  {
    label: "format_date",
    kind: CompletionItemKind.Function,
    detail: "Format date (locale)",
    documentation: FILTER_DOCS["format_date"],
  },
  {
    label: "format_datetime",
    kind: CompletionItemKind.Function,
    detail: "Format datetime",
    documentation: FILTER_DOCS["format_datetime"],
  },
  {
    label: "format_number",
    kind: CompletionItemKind.Function,
    detail: "Format number",
    documentation: FILTER_DOCS["format_number"],
  },
  {
    label: "format_time",
    kind: CompletionItemKind.Function,
    detail: "Format time",
    documentation: FILTER_DOCS["format_time"],
  },
  {
    label: "html_to_markdown",
    kind: CompletionItemKind.Function,
    detail: "HTML to Markdown",
    documentation: FILTER_DOCS["html_to_markdown"],
  },
  {
    label: "inline_css",
    kind: CompletionItemKind.Function,
    detail: "Inline CSS",
    documentation: FILTER_DOCS["inline_css"],
  },
  {
    label: "inky_to_html",
    kind: CompletionItemKind.Function,
    detail: "Inky to HTML",
    documentation: FILTER_DOCS["inky_to_html"],
  },
  {
    label: "join",
    kind: CompletionItemKind.Function,
    insertText: "join('${1:glue}')",
    insertTextFormat: InsertTextFormat.Snippet,
    detail: "Join array",
    documentation: FILTER_DOCS["join"],
  },
  {
    label: "json_encode",
    kind: CompletionItemKind.Function,
    detail: "Encode as JSON",
    documentation: FILTER_DOCS["json_encode"],
  },
  {
    label: "keys",
    kind: CompletionItemKind.Function,
    detail: "Array keys",
    documentation: FILTER_DOCS["keys"],
  },
  {
    label: "language_name",
    kind: CompletionItemKind.Function,
    detail: "Language name",
    documentation: FILTER_DOCS["language_name"],
  },
  {
    label: "last",
    kind: CompletionItemKind.Function,
    detail: "Last element",
    documentation: FILTER_DOCS["last"],
  },
  {
    label: "length",
    kind: CompletionItemKind.Function,
    detail: "Length/count",
    documentation: FILTER_DOCS["length"],
  },
  {
    label: "locale_name",
    kind: CompletionItemKind.Function,
    detail: "Locale name",
    documentation: FILTER_DOCS["locale_name"],
  },
  {
    label: "lower",
    kind: CompletionItemKind.Function,
    detail: "Lowercase",
    documentation: FILTER_DOCS["lower"],
  },
  {
    label: "map",
    kind: CompletionItemKind.Function,
    insertText: "map(${1:arrow})",
    insertTextFormat: InsertTextFormat.Snippet,
    detail: "Map items",
    documentation: FILTER_DOCS["map"],
  },
  {
    label: "markdown_to_html",
    kind: CompletionItemKind.Function,
    detail: "Markdown to HTML",
    documentation: FILTER_DOCS["markdown_to_html"],
  },
  {
    label: "merge",
    kind: CompletionItemKind.Function,
    insertText: "merge(${1:array})",
    insertTextFormat: InsertTextFormat.Snippet,
    detail: "Merge arrays",
    documentation: FILTER_DOCS["merge"],
  },
  {
    label: "nl2br",
    kind: CompletionItemKind.Function,
    detail: "Newlines to <br>",
    documentation: FILTER_DOCS["nl2br"],
  },
  {
    label: "number_format",
    kind: CompletionItemKind.Function,
    insertText: "number_format(${1:decimals})",
    insertTextFormat: InsertTextFormat.Snippet,
    detail: "Format number",
    documentation: FILTER_DOCS["number_format"],
  },
  {
    label: "raw",
    kind: CompletionItemKind.Function,
    detail: "Raw output",
    documentation: FILTER_DOCS["raw"],
  },
  {
    label: "reduce",
    kind: CompletionItemKind.Function,
    insertText: "reduce(${1:arrow})",
    insertTextFormat: InsertTextFormat.Snippet,
    detail: "Reduce array",
    documentation: FILTER_DOCS["reduce"],
  },
  {
    label: "replace",
    kind: CompletionItemKind.Function,
    insertText: "replace({ '${1:from}': '${2:to}' })",
    insertTextFormat: InsertTextFormat.Snippet,
    detail: "Replace text",
    documentation: FILTER_DOCS["replace"],
  },
  {
    label: "reverse",
    kind: CompletionItemKind.Function,
    detail: "Reverse array/string",
    documentation: FILTER_DOCS["reverse"],
  },
  {
    label: "round",
    kind: CompletionItemKind.Function,
    insertText: "round(${1:precision})",
    insertTextFormat: InsertTextFormat.Snippet,
    detail: "Round number",
    documentation: FILTER_DOCS["round"],
  },
  {
    label: "slice",
    kind: CompletionItemKind.Function,
    insertText: "slice(${1:start}, ${2:length})",
    insertTextFormat: InsertTextFormat.Snippet,
    detail: "Slice array/string",
    documentation: FILTER_DOCS["slice"],
  },
  {
    label: "slug",
    kind: CompletionItemKind.Function,
    detail: "URL slug",
    documentation: FILTER_DOCS["slug"],
  },
  {
    label: "sort",
    kind: CompletionItemKind.Function,
    detail: "Sort array",
    documentation: FILTER_DOCS["sort"],
  },
  {
    label: "spaceless",
    kind: CompletionItemKind.Function,
    detail: "Remove whitespace",
    documentation: FILTER_DOCS["spaceless"],
  },
  {
    label: "split",
    kind: CompletionItemKind.Function,
    insertText: "split('${1:delimiter}')",
    insertTextFormat: InsertTextFormat.Snippet,
    detail: "Split string",
    documentation: FILTER_DOCS["split"],
  },
  {
    label: "striptags",
    kind: CompletionItemKind.Function,
    detail: "Strip HTML tags",
    documentation: FILTER_DOCS["striptags"],
  },
  {
    label: "timezone_name",
    kind: CompletionItemKind.Function,
    detail: "Timezone name",
    documentation: FILTER_DOCS["timezone_name"],
  },
  {
    label: "title",
    kind: CompletionItemKind.Function,
    detail: "Title case",
    documentation: FILTER_DOCS["title"],
  },
  {
    label: "trim",
    kind: CompletionItemKind.Function,
    detail: "Trim whitespace",
    documentation: FILTER_DOCS["trim"],
  },
  {
    label: "u",
    kind: CompletionItemKind.Function,
    detail: "Unicode string",
    documentation: FILTER_DOCS["u"],
  },
  {
    label: "upper",
    kind: CompletionItemKind.Function,
    detail: "Uppercase",
    documentation: FILTER_DOCS["upper"],
  },
  {
    label: "url_encode",
    kind: CompletionItemKind.Function,
    detail: "URL encode",
    documentation: FILTER_DOCS["url_encode"],
  },
];
