/**
 * Tree-sitter grammar for Twig templates
 * Starting with minimal grammar focusing on delimiters
 */
module.exports = grammar({
  name: "twig",

  extras: ($) => [/\s/],

  rules: {
    source_file: ($) => repeat($._node),

    _node: ($) =>
      choice($.output_statement, $.statement_block, $.comment, $.raw_content),

    // {{ expression }}
    output_statement: ($) =>
      seq(
        choice("{{", "{{-"),
        optional($._expression_content),
        choice("}}", "-}}")
      ),

    // {% tag %}
    statement_block: ($) =>
      seq(
        choice("{%", "{%-"),
        optional($._statement_content),
        choice("%}", "-%}")
      ),

    // {# comment #}
    comment: ($) => seq("{#", optional($.comment_content), "#}"),

    comment_content: ($) => /[^#]+/,

    _statement_content: ($) =>
      seq($.keyword, optional($._expression_content)),

    keyword: ($) =>
      choice(
        "if",
        "else",
        "elseif",
        "endif",
        "for",
        "endfor",
        "in",
        "block",
        "endblock",
        "extends",
        "include",
        "set",
        "endset",
        "macro",
        "endmacro",
        "import",
        "from",
        "as",
        "with",
        "apply",
        "endapply",
        "autoescape",
        "endautoescape",
        "embed",
        "endembed",
        "flush",
        "sandbox",
        "endsandbox",
        "use",
        "verbatim",
        "endverbatim",
        "do",
        "cache",
        "endcache",
        "deprecated"
      ),

    _expression_content: ($) =>
      repeat1(
        choice(
          $.identifier,
          $.property_access,
          $.filter,
          $.string,
          $.number,
          $.operator,
          $.parenthesized,
          $.brackets
        )
      ),

    identifier: ($) => /[a-zA-Z_][a-zA-Z0-9_]*/,

    property_access: ($) => seq(".", $.identifier),

    filter: ($) => seq("|", $.identifier),

    string: ($) =>
      choice(seq('"', optional(/[^"]*/), '"'), seq("'", optional(/[^']*/), "'")),

    number: ($) => /\d+(\.\d+)?/,

    operator: ($) =>
      choice(
        "+",
        "-",
        "*",
        "/",
        "%",
        "~",
        "==",
        "!=",
        "<",
        ">",
        "<=",
        ">=",
        "and",
        "or",
        "not",
        "is",
        "?",
        ":",
        "..",
        "??",
        "=",
        ","
      ),

    parenthesized: ($) => seq("(", optional($._expression_content), ")"),

    brackets: ($) => seq("[", optional($._expression_content), "]"),

    // Anything outside Twig delimiters
    raw_content: ($) => token(prec(-1, /[^{]+/)),
  },
});
