import { MarkupContent, MarkupKind } from "vscode-languageserver/node";

/**
 * Create a MarkupContent object for documentation
 */
function md(content: string): MarkupContent {
  return { kind: MarkupKind.Markdown, value: content };
}

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
 * Documentation for Twig functions
 */
export const FUNCTION_DOCS: Record<string, MarkupContent> = {
  attribute: md(`### attribute
Accesses a dynamic attribute of a variable.

**Syntax:** \`attribute(object, method, arguments)\`

**Parameters:**
- \`object\` - The object to access
- \`method\` - The attribute or method name
- \`arguments\` (optional) - Arguments for method calls

**Example:**
\`\`\`twig
{{ attribute(object, method) }}
{{ attribute(object, 'get' ~ name) }}
{{ attribute(array, key) }}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/functions/attribute.html)`),

  block: md(`### block
Renders a named block.

**Syntax:** \`block(name, template)\`

**Parameters:**
- \`name\` - The block name
- \`template\` (optional) - Template to get block from

**Example:**
\`\`\`twig
{{ block('sidebar') }}
{{ block('footer', 'footer.twig') }}

{% if block('optional_section') is defined %}
  {{ block('optional_section') }}
{% endif %}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/functions/block.html)`),

  constant: md(`### constant
Returns the value of a constant.

**Syntax:** \`constant(name, object)\`

**Parameters:**
- \`name\` - The constant name
- \`object\` (optional) - Object to get class constant from

**Example:**
\`\`\`twig
{{ constant('DATE_W3C') }}
{{ constant('App\\\\Entity\\\\User::ROLE_ADMIN') }}
{{ constant('STATUS_ACTIVE', user) }}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/functions/constant.html)`),

  country_names: md(`### country_names
Returns the names of all countries.

**Syntax:** \`country_names(locale)\`

**Parameters:**
- \`locale\` (optional) - The locale for country names

**Example:**
\`\`\`twig
{% for code, name in country_names() %}
  <option value="{{ code }}">{{ name }}</option>
{% endfor %}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/functions/country_names.html)`),

  country_timezones: md(`### country_timezones
Returns the timezones for a country.

**Syntax:** \`country_timezones(country)\`

**Parameters:**
- \`country\` (optional) - ISO 3166-1 alpha-2 country code

**Example:**
\`\`\`twig
{% for tz in country_timezones('US') %}
  {{ tz }}
{% endfor %}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/functions/country_timezones.html)`),

  currency_names: md(`### currency_names
Returns the names of all currencies.

**Syntax:** \`currency_names(locale)\`

**Parameters:**
- \`locale\` (optional) - The locale for currency names

**Example:**
\`\`\`twig
{% for code, name in currency_names() %}
  <option value="{{ code }}">{{ name }}</option>
{% endfor %}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/functions/currency_names.html)`),

  cycle: md(`### cycle
Cycles through values.

**Syntax:** \`cycle(values, position)\`

**Parameters:**
- \`values\` - An array of values to cycle through
- \`position\` - The current position

**Example:**
\`\`\`twig
{% for user in users %}
  <tr class="{{ cycle(['odd', 'even'], loop.index0) }}">
    <td>{{ user.name }}</td>
  </tr>
{% endfor %}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/functions/cycle.html)`),

  date: md(`### date
Creates a date object.

**Syntax:** \`date(date, timezone)\`

**Parameters:**
- \`date\` (optional) - Date string or timestamp (default: now)
- \`timezone\` (optional) - The timezone

**Example:**
\`\`\`twig
{% set now = date() %}
{% set christmas = date('2024-12-25') %}
{% set event = date(timestamp) %}

{{ date('now')|date('Y-m-d') }}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/functions/date.html)`),

  dump: md(`### dump
Dumps variable information for debugging.

**Syntax:** \`dump(var, ...)\`

**Parameters:**
- \`var\` (optional) - Variables to dump (dumps all if none specified)

**Example:**
\`\`\`twig
{{ dump(user) }}
{{ dump(user, session) }}
{{ dump() }} {# dumps all variables #}
\`\`\`

**Note:** Only available when debug mode is enabled.

[Twig Documentation](https://twig.symfony.com/doc/3.x/functions/dump.html)`),

  html_classes: md(`### html_classes
Generates an HTML class attribute string.

**Syntax:** \`html_classes(classes)\`

**Parameters:**
- \`classes\` - Class names (string, array, or hash with conditions)

**Example:**
\`\`\`twig
<div class="{{ html_classes('base', {'active': isActive, 'error': hasError}) }}">

{# With array #}
<div class="{{ html_classes(['nav', 'nav-pills']) }}">
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/functions/html_classes.html)`),

  include: md(`### include (function)
Includes and renders another template.

**Syntax:** \`include(template, variables, with_context, ignore_missing, sandboxed)\`

**Parameters:**
- \`template\` - The template to include
- \`variables\` (optional) - Variables to pass
- \`with_context\` (optional) - Include current context (default: true)
- \`ignore_missing\` (optional) - Ignore if template is missing
- \`sandboxed\` (optional) - Run in sandbox mode

**Example:**
\`\`\`twig
{{ include('header.twig') }}
{{ include('sidebar.twig', {items: menu}) }}
{{ include('widget.twig', ignore_missing=true) }}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/functions/include.html)`),

  language_names: md(`### language_names
Returns the names of all languages.

**Syntax:** \`language_names(locale)\`

**Parameters:**
- \`locale\` (optional) - The locale for language names

**Example:**
\`\`\`twig
{% for code, name in language_names() %}
  <option value="{{ code }}">{{ name }}</option>
{% endfor %}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/functions/language_names.html)`),

  locale_names: md(`### locale_names
Returns the names of all locales.

**Syntax:** \`locale_names(locale)\`

**Parameters:**
- \`locale\` (optional) - The locale for locale names

**Example:**
\`\`\`twig
{% for code, name in locale_names() %}
  <option value="{{ code }}">{{ name }}</option>
{% endfor %}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/functions/locale_names.html)`),

  max: md(`### max
Returns the largest value.

**Syntax:** \`max(value1, value2, ...)\` or \`max(array)\`

**Parameters:**
- \`values\` - Values to compare (as arguments or array)

**Example:**
\`\`\`twig
{{ max(1, 3, 2) }}
{# outputs: 3 #}

{{ max([1, 3, 2]) }}
{# outputs: 3 #}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/functions/max.html)`),

  min: md(`### min
Returns the smallest value.

**Syntax:** \`min(value1, value2, ...)\` or \`min(array)\`

**Parameters:**
- \`values\` - Values to compare (as arguments or array)

**Example:**
\`\`\`twig
{{ min(1, 3, 2) }}
{# outputs: 1 #}

{{ min([1, 3, 2]) }}
{# outputs: 1 #}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/functions/min.html)`),

  parent: md(`### parent
Renders the parent block content.

**Syntax:** \`parent()\`

**Example:**
\`\`\`twig
{% block sidebar %}
  <h3>Table Of Contents</h3>
  {{ parent() }}
{% endblock %}
\`\`\`

Used inside a \`{% block %}\` to include the content from the parent template's block.

[Twig Documentation](https://twig.symfony.com/doc/3.x/functions/parent.html)`),

  random: md(`### random
Returns a random value.

**Syntax:** \`random(values, max)\`

**Parameters:**
- \`values\` (optional) - Array or string to pick from, or max integer
- \`max\` (optional) - Maximum value when \`values\` is min integer

**Example:**
\`\`\`twig
{{ random() }}
{# random integer #}

{{ random(['a', 'b', 'c']) }}
{# random array element #}

{{ random('hello') }}
{# random character #}

{{ random(1, 10) }}
{# random integer between 1 and 10 #}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/functions/random.html)`),

  range: md(`### range
Returns a list of values in a range.

**Syntax:** \`range(low, high, step)\`

**Parameters:**
- \`low\` - Start value
- \`high\` - End value
- \`step\` (optional) - Increment (default: 1)

**Example:**
\`\`\`twig
{% for i in range(0, 10) %}
  {{ i }}
{% endfor %}

{% for letter in range('a', 'z') %}
  {{ letter }}
{% endfor %}

{% for i in range(0, 100, 10) %}
  {{ i }}
{% endfor %}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/functions/range.html)`),

  script_names: md(`### script_names
Returns the names of all scripts (writing systems).

**Syntax:** \`script_names(locale)\`

**Parameters:**
- \`locale\` (optional) - The locale for script names

**Example:**
\`\`\`twig
{% for code, name in script_names() %}
  <option value="{{ code }}">{{ name }}</option>
{% endfor %}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/functions/script_names.html)`),

  source: md(`### source
Returns the content of a template without rendering.

**Syntax:** \`source(name, ignore_missing)\`

**Parameters:**
- \`name\` - The template name
- \`ignore_missing\` (optional) - Return empty if missing

**Example:**
\`\`\`twig
{{ source('template.twig') }}
{{ source('emails/base.html', ignore_missing=true) }}

{# Include raw CSS #}
<style>{{ source('styles.css') }}</style>
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/functions/source.html)`),

  template_from_string: md(`### template_from_string
Loads a template from a string.

**Syntax:** \`template_from_string(template, name)\`

**Parameters:**
- \`template\` - The template content as string
- \`name\` (optional) - Template name for error messages

**Example:**
\`\`\`twig
{% set template = '{{ name }} is {{ age }} years old' %}
{{ include(template_from_string(template)) }}
\`\`\`

**Note:** Requires \`StringLoader\` extension to be enabled.

[Twig Documentation](https://twig.symfony.com/doc/3.x/functions/template_from_string.html)`),

  timezone_names: md(`### timezone_names
Returns the names of all timezones.

**Syntax:** \`timezone_names(locale, country)\`

**Parameters:**
- \`locale\` (optional) - The locale for timezone names
- \`country\` (optional) - Filter by country code

**Example:**
\`\`\`twig
{% for code, name in timezone_names() %}
  <option value="{{ code }}">{{ name }}</option>
{% endfor %}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/functions/timezone_names.html)`),
};

/**
 * Documentation for Twig keywords (tags)
 */
export const KEYWORD_DOCS: Record<string, MarkupContent> = {
  if: md(`### if
Conditionally displays content.

**Syntax:**
\`\`\`twig
{% if condition %}
  ...
{% elseif other_condition %}
  ...
{% else %}
  ...
{% endif %}
\`\`\`

**Example:**
\`\`\`twig
{% if user.isAdmin %}
  <a href="/admin">Admin Panel</a>
{% elseif user.isModerator %}
  <a href="/moderate">Moderate</a>
{% else %}
  <a href="/profile">Profile</a>
{% endif %}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/tags/if.html)`),

  elseif: md(`### elseif
Alternative condition in an if block.

**Syntax:** \`{% elseif condition %}\`

**Example:**
\`\`\`twig
{% if score >= 90 %}
  Grade: A
{% elseif score >= 80 %}
  Grade: B
{% elseif score >= 70 %}
  Grade: C
{% else %}
  Grade: F
{% endif %}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/tags/if.html)`),

  else: md(`### else
Default branch in an if or for block.

**Syntax:** \`{% else %}\`

**Example:**
\`\`\`twig
{% if items %}
  {% for item in items %}
    {{ item }}
  {% endfor %}
{% else %}
  No items found.
{% endif %}

{% for item in items %}
  {{ item }}
{% else %}
  No items to display.
{% endfor %}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/tags/if.html)`),

  endif: md(`### endif
Closes an if block.

**Syntax:** \`{% endif %}\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/tags/if.html)`),

  for: md(`### for
Loops over a sequence.

**Syntax:**
\`\`\`twig
{% for item in sequence %}
  ...
{% else %}
  ... {# shown if sequence is empty #}
{% endfor %}
\`\`\`

**Loop Variables:**
- \`loop.index\` - Current iteration (1-indexed)
- \`loop.index0\` - Current iteration (0-indexed)
- \`loop.revindex\` - Iterations from end (1-indexed)
- \`loop.revindex0\` - Iterations from end (0-indexed)
- \`loop.first\` - True if first iteration
- \`loop.last\` - True if last iteration
- \`loop.length\` - Total number of items
- \`loop.parent\` - Parent context

**Example:**
\`\`\`twig
{% for user in users %}
  {{ loop.index }}. {{ user.name }}
{% endfor %}

{% for key, value in items %}
  {{ key }}: {{ value }}
{% endfor %}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/tags/for.html)`),

  endfor: md(`### endfor
Closes a for loop.

**Syntax:** \`{% endfor %}\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/tags/for.html)`),

  block: md(`### block
Defines a block that can be overridden by child templates.

**Syntax:**
\`\`\`twig
{% block name %}
  content
{% endblock %}

{# Short syntax #}
{% block name %}content{% endblock name %}
\`\`\`

**Example:**
\`\`\`twig
{# base.twig #}
{% block title %}Default Title{% endblock %}

{# child.twig #}
{% extends 'base.twig' %}
{% block title %}Custom Title{% endblock %}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/tags/block.html)`),

  endblock: md(`### endblock
Closes a block definition.

**Syntax:** \`{% endblock %}\` or \`{% endblock name %}\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/tags/block.html)`),

  extends: md(`### extends
Extends a parent template.

**Syntax:** \`{% extends "template" %}\`

**Example:**
\`\`\`twig
{% extends "base.twig" %}

{% block content %}
  This replaces the parent's content block.
{% endblock %}
\`\`\`

**Note:** Must be the first tag in the template.

[Twig Documentation](https://twig.symfony.com/doc/3.x/tags/extends.html)`),

  include: md(`### include
Includes another template.

**Syntax:**
\`\`\`twig
{% include "template" %}
{% include "template" with {var: value} %}
{% include "template" only %}
{% include "template" ignore missing %}
\`\`\`

**Example:**
\`\`\`twig
{% include 'header.twig' %}
{% include 'sidebar.twig' with {items: menu} only %}
{% include 'widget.twig' ignore missing %}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/tags/include.html)`),

  set: md(`### set
Assigns a value to a variable.

**Syntax:**
\`\`\`twig
{% set name = value %}
{% set name %}captured content{% endset %}
\`\`\`

**Example:**
\`\`\`twig
{% set username = 'John' %}
{% set items = [1, 2, 3] %}
{% set config = {debug: true, theme: 'dark'} %}

{% set greeting %}
  Hello, {{ username }}!
{% endset %}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/tags/set.html)`),

  endset: md(`### endset
Closes a block-style set tag.

**Syntax:** \`{% endset %}\`

**Example:**
\`\`\`twig
{% set content %}
  <p>This is captured content</p>
{% endset %}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/tags/set.html)`),

  macro: md(`### macro
Defines a reusable piece of template.

**Syntax:**
\`\`\`twig
{% macro name(arg1, arg2, ...) %}
  content using {{ arg1 }}, {{ arg2 }}
{% endmacro %}
\`\`\`

**Example:**
\`\`\`twig
{% macro input(name, value, type = 'text') %}
  <input type="{{ type }}" name="{{ name }}" value="{{ value }}">
{% endmacro %}

{{ _self.input('username', '') }}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/tags/macro.html)`),

  endmacro: md(`### endmacro
Closes a macro definition.

**Syntax:** \`{% endmacro %}\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/tags/macro.html)`),

  import: md(`### import
Imports macros from a template.

**Syntax:** \`{% import "template" as alias %}\`

**Example:**
\`\`\`twig
{% import "forms.twig" as forms %}

{{ forms.input('username') }}
{{ forms.textarea('bio') }}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/tags/import.html)`),

  from: md(`### from
Imports specific macros from a template.

**Syntax:** \`{% from "template" import macro1, macro2 as alias %}\`

**Example:**
\`\`\`twig
{% from "forms.twig" import input, textarea as text %}

{{ input('username') }}
{{ text('bio') }}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/tags/from.html)`),

  with: md(`### with
Creates a new scope with additional variables.

**Syntax:**
\`\`\`twig
{% with {var: value} %}
  ...
{% endwith %}

{% with {var: value} only %}
  ...
{% endwith %}
\`\`\`

**Example:**
\`\`\`twig
{% with {title: 'Hello', count: 5} %}
  <h1>{{ title }}</h1>
  <p>Count: {{ count }}</p>
{% endwith %}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/tags/with.html)`),

  apply: md(`### apply
Applies a filter to a section of template.

**Syntax:**
\`\`\`twig
{% apply filter %}
  content
{% endapply %}
\`\`\`

**Example:**
\`\`\`twig
{% apply upper %}
  This text will be uppercase.
{% endapply %}

{% apply escape('html') %}
  <p>This will be escaped</p>
{% endapply %}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/tags/apply.html)`),

  endapply: md(`### endapply
Closes an apply block.

**Syntax:** \`{% endapply %}\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/tags/apply.html)`),

  autoescape: md(`### autoescape
Controls automatic output escaping.

**Syntax:**
\`\`\`twig
{% autoescape %}
  ...
{% endautoescape %}

{% autoescape 'js' %}
  ...
{% endautoescape %}

{% autoescape false %}
  ...
{% endautoescape %}
\`\`\`

**Strategies:** \`html\`, \`js\`, \`css\`, \`url\`, \`html_attr\`, \`false\`

**Example:**
\`\`\`twig
{% autoescape 'js' %}
  var data = {{ json_data }};
{% endautoescape %}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/tags/autoescape.html)`),

  endautoescape: md(`### endautoescape
Closes an autoescape block.

**Syntax:** \`{% endautoescape %}\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/tags/autoescape.html)`),

  embed: md(`### embed
Combines include and extends functionality.

**Syntax:**
\`\`\`twig
{% embed "template" %}
  {% block name %}
    override content
  {% endblock %}
{% endembed %}
\`\`\`

**Example:**
\`\`\`twig
{% embed "card.twig" %}
  {% block title %}Custom Title{% endblock %}
  {% block content %}
    <p>Custom content here</p>
  {% endblock %}
{% endembed %}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/tags/embed.html)`),

  endembed: md(`### endembed
Closes an embed block.

**Syntax:** \`{% endembed %}\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/tags/embed.html)`),

  flush: md(`### flush
Flushes the output buffer.

**Syntax:** \`{% flush %}\`

**Example:**
\`\`\`twig
{% for item in items %}
  {{ item }}
  {% flush %}
{% endfor %}
\`\`\`

Useful for streaming long outputs to the browser.

[Twig Documentation](https://twig.symfony.com/doc/3.x/tags/flush.html)`),

  sandbox: md(`### sandbox
Enables sandbox mode for a section.

**Syntax:**
\`\`\`twig
{% sandbox %}
  {% include user_template %}
{% endsandbox %}
\`\`\`

Restricts available tags, filters, and functions for security.

[Twig Documentation](https://twig.symfony.com/doc/3.x/tags/sandbox.html)`),

  endsandbox: md(`### endsandbox
Closes a sandbox block.

**Syntax:** \`{% endsandbox %}\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/tags/sandbox.html)`),

  use: md(`### use
Imports blocks from another template (horizontal reuse).

**Syntax:** \`{% use "template" %}\`

**Example:**
\`\`\`twig
{% use "blocks.twig" %}

{# Now blocks from blocks.twig are available #}
{{ block('sidebar') }}
\`\`\`

Different from \`extends\` - allows importing blocks without inheritance.

[Twig Documentation](https://twig.symfony.com/doc/3.x/tags/use.html)`),

  verbatim: md(`### verbatim
Outputs content as raw text without parsing.

**Syntax:**
\`\`\`twig
{% verbatim %}
  {{ this.will.not.be.parsed }}
{% endverbatim %}
\`\`\`

**Example:**
\`\`\`twig
{% verbatim %}
  <script id="template">
    {{ item.name }}
  </script>
{% endverbatim %}
\`\`\`

Useful for outputting Twig/Mustache/Vue templates in browser.

[Twig Documentation](https://twig.symfony.com/doc/3.x/tags/verbatim.html)`),

  endverbatim: md(`### endverbatim
Closes a verbatim block.

**Syntax:** \`{% endverbatim %}\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/tags/verbatim.html)`),

  do: md(`### do
Executes an expression without printing output.

**Syntax:** \`{% do expression %}\`

**Example:**
\`\`\`twig
{% do items.append(newItem) %}
{% do collection.sort() %}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/tags/do.html)`),

  cache: md(`### cache
Caches a section of template.

**Syntax:**
\`\`\`twig
{% cache "key" [ttl(seconds)] %}
  expensive content
{% endcache %}
\`\`\`

**Example:**
\`\`\`twig
{% cache "sidebar" ttl(3600) %}
  {% include 'sidebar.twig' %}
{% endcache %}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/tags/cache.html)`),

  endcache: md(`### endcache
Closes a cache block.

**Syntax:** \`{% endcache %}\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/tags/cache.html)`),

  deprecated: md(`### deprecated
Marks a template or block as deprecated.

**Syntax:** \`{% deprecated "message" %}\`

**Example:**
\`\`\`twig
{% deprecated 'The "old.twig" template is deprecated, use "new.twig" instead.' %}
\`\`\`

Triggers a deprecation warning when the template is used.

[Twig Documentation](https://twig.symfony.com/doc/3.x/tags/deprecated.html)`),
};

/**
 * Documentation for Twig tests
 */
export const TEST_DOCS: Record<string, MarkupContent> = {
  constant: md(`### is constant
Tests if a value equals a constant.

**Syntax:** \`value is constant(name)\`

**Example:**
\`\`\`twig
{% if status is constant('STATUS_ACTIVE') %}
  Active
{% endif %}

{% if role is constant('User::ADMIN', user) %}
  Admin user
{% endif %}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/tests/constant.html)`),

  defined: md(`### is defined
Tests if a variable is defined.

**Syntax:** \`value is defined\`

**Example:**
\`\`\`twig
{% if user is defined %}
  Hello, {{ user.name }}
{% endif %}

{% if attribute is defined and attribute %}
  {{ attribute }}
{% endif %}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/tests/defined.html)`),

  "divisible by": md(`### is divisible by
Tests if a number is divisible by another number.

**Syntax:** \`value is divisible by(number)\`

**Example:**
\`\`\`twig
{% if loop.index is divisible by(3) %}
  {# Every third item #}
{% endif %}

{% if count is divisible by(2) %}
  Even count
{% endif %}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/tests/divisibleby.html)`),

  empty: md(`### is empty
Tests if a value is empty.

**Syntax:** \`value is empty\`

Empty values: \`false\`, \`null\`, \`''\`, \`[]\`, \`0\`

**Example:**
\`\`\`twig
{% if items is empty %}
  No items found.
{% endif %}

{% if not user.name is empty %}
  {{ user.name }}
{% endif %}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/tests/empty.html)`),

  even: md(`### is even
Tests if a number is even.

**Syntax:** \`value is even\`

**Example:**
\`\`\`twig
{% for item in items %}
  <tr class="{{ loop.index is even ? 'even' : 'odd' }}">
    {{ item }}
  </tr>
{% endfor %}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/tests/even.html)`),

  iterable: md(`### is iterable
Tests if a value can be iterated over.

**Syntax:** \`value is iterable\`

**Example:**
\`\`\`twig
{% if items is iterable %}
  {% for item in items %}
    {{ item }}
  {% endfor %}
{% else %}
  {{ items }}
{% endif %}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/tests/iterable.html)`),

  null: md(`### is null
Tests if a value is null.

**Syntax:** \`value is null\`

**Example:**
\`\`\`twig
{% if user is null %}
  Guest user
{% endif %}

{% if value is not null %}
  {{ value }}
{% endif %}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/tests/null.html)`),

  odd: md(`### is odd
Tests if a number is odd.

**Syntax:** \`value is odd\`

**Example:**
\`\`\`twig
{% if loop.index is odd %}
  <tr class="odd">
{% endif %}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/tests/odd.html)`),

  "same as": md(`### is same as
Tests if two values are the same (strict comparison).

**Syntax:** \`value is same as(other)\`

**Example:**
\`\`\`twig
{% if status is same as(true) %}
  {# Strictly true, not just truthy #}
{% endif %}

{% if type is same as('admin') %}
  Admin type
{% endif %}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/tests/sameas.html)`),
};

/**
 * Documentation for loop variable properties
 */
export const LOOP_VARIABLE_DOCS: Record<string, MarkupContent> = {
  index: md(`### loop.index
The current iteration of the loop (1-indexed).

**Example:**
\`\`\`twig
{% for item in items %}
  {{ loop.index }}. {{ item }}
{% endfor %}
{# outputs: 1. first, 2. second, etc. #}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/tags/for.html#the-loop-variable)`),

  index0: md(`### loop.index0
The current iteration of the loop (0-indexed).

**Example:**
\`\`\`twig
{% for item in items %}
  {{ loop.index0 }}. {{ item }}
{% endfor %}
{# outputs: 0. first, 1. second, etc. #}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/tags/for.html#the-loop-variable)`),

  revindex: md(`### loop.revindex
The number of iterations from the end (1-indexed).

**Example:**
\`\`\`twig
{% for item in items %}
  {{ loop.revindex }} items remaining
{% endfor %}
{# Last item shows "1 items remaining" #}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/tags/for.html#the-loop-variable)`),

  revindex0: md(`### loop.revindex0
The number of iterations from the end (0-indexed).

**Example:**
\`\`\`twig
{% for item in items %}
  {{ loop.revindex0 }} items after this
{% endfor %}
{# Last item shows "0 items after this" #}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/tags/for.html#the-loop-variable)`),

  first: md(`### loop.first
True if this is the first iteration.

**Example:**
\`\`\`twig
{% for item in items %}
  {% if loop.first %}<ul>{% endif %}
  <li>{{ item }}</li>
  {% if loop.last %}</ul>{% endif %}
{% endfor %}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/tags/for.html#the-loop-variable)`),

  last: md(`### loop.last
True if this is the last iteration.

**Example:**
\`\`\`twig
{% for item in items %}
  {{ item }}{% if not loop.last %}, {% endif %}
{% endfor %}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/tags/for.html#the-loop-variable)`),

  length: md(`### loop.length
The total number of items in the sequence.

**Example:**
\`\`\`twig
{% for item in items %}
  Item {{ loop.index }} of {{ loop.length }}
{% endfor %}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/tags/for.html#the-loop-variable)`),

  parent: md(`### loop.parent
The parent context in nested loops.

**Example:**
\`\`\`twig
{% for category in categories %}
  {% for item in category.items %}
    Category {{ loop.parent.loop.index }}, Item {{ loop.index }}
  {% endfor %}
{% endfor %}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/tags/for.html#the-loop-variable)`),
};
