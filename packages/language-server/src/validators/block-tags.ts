import { Diagnostic, DiagnosticSeverity } from "vscode-languageserver/node";
import type { Tree } from "web-tree-sitter";
import {
  extractScopedBlocks,
  TagLocation,
  NestingError,
  MisplacedKeyword,
} from "../document-analyzer";

/**
 * Validates block tag structure in Twig templates.
 * Maps TagAnalysisResult diagnostic data from extractScopedBlocks()
 * to LSP Diagnostic[] objects.
 *
 * All diagnostics use Warning severity and source "twig-sense".
 */
export function validateBlockTags(tree: Tree): Diagnostic[] {
  const result = extractScopedBlocks(tree);
  const diagnostics: Diagnostic[] = [];

  // Map unclosed tags
  for (const tag of result.unclosed) {
    diagnostics.push(makeUnclosedDiagnostic(tag));
  }

  // Map orphan closers
  for (const tag of result.orphanClosers) {
    diagnostics.push(makeOrphanCloserDiagnostic(tag));
  }

  // Map nesting errors
  for (const error of result.nestingErrors) {
    diagnostics.push(makeNestingErrorDiagnostic(error));
  }

  // Map misplaced keywords
  for (const keyword of result.misplacedKeywords) {
    diagnostics.push(makeMisplacedKeywordDiagnostic(keyword));
  }

  return diagnostics;
}

function makeUnclosedDiagnostic(tag: TagLocation): Diagnostic {
  const keyword = tag.keyword;
  const closer = `end${keyword}`;
  return {
    severity: DiagnosticSeverity.Warning,
    range: {
      start: { line: tag.line, character: tag.character },
      end: { line: tag.endLine, character: tag.endCharacter },
    },
    message: `Unclosed {% ${keyword} %} — expected {% ${closer} %}`,
    source: "twig-sense",
  };
}

function makeOrphanCloserDiagnostic(tag: TagLocation): Diagnostic {
  const keyword = tag.keyword;
  // Strip the "end" prefix to get the opening tag name
  const opener = keyword.replace(/^end/, "");
  return {
    severity: DiagnosticSeverity.Warning,
    range: {
      start: { line: tag.line, character: tag.character },
      end: { line: tag.endLine, character: tag.endCharacter },
    },
    message: `Unexpected {% ${keyword} %} — no matching {% ${opener} %}`,
    source: "twig-sense",
  };
}

function makeNestingErrorDiagnostic(error: NestingError): Diagnostic {
  const outerKeyword = error.outer.keyword;
  const innerKeyword = error.inner.keyword;
  // Lines are 0-indexed internally, but display as 1-indexed for user messages
  const outerLine = error.outer.line + 1;
  const innerLine = error.inner.line + 1;
  return {
    severity: DiagnosticSeverity.Warning,
    range: {
      start: { line: error.closer.line, character: error.closer.character },
      end: { line: error.closer.endLine, character: error.closer.endCharacter },
    },
    message: `{% ${outerKeyword} %} at line ${outerLine} was closed while {% ${innerKeyword} %} at line ${innerLine} was still open`,
    source: "twig-sense",
  };
}

function makeMisplacedKeywordDiagnostic(keyword: MisplacedKeyword): Diagnostic {
  const kw = keyword.location.keyword;
  const parents = keyword.validParents.map((p) => `{% ${p} %}`).join(", ");
  return {
    severity: DiagnosticSeverity.Warning,
    range: {
      start: { line: keyword.location.line, character: keyword.location.character },
      end: { line: keyword.location.endLine, character: keyword.location.endCharacter },
    },
    message: `{% ${kw} %} is only valid inside ${parents}`,
    source: "twig-sense",
  };
}
